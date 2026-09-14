import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  Phone,
  Loader2,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import { MessageContent } from "./MessageContent";

interface Message {
  role: "user" | "assistant" | "staff";
  content: string;
}

const WORKER_URL = "https://mhbhc-chat.web-026.workers.dev";
const SESSION_KEY = "mhbhc_session_id";

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  // Mobile: size the panel to the *visual* viewport so the iOS keyboard shrinks
  // the panel instead of pushing it offscreen, and lock the page behind it.
  const [mobileHeight, setMobileHeight] = useState<number | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;
    const vv = window.visualViewport;
    const update = () => setMobileHeight(vv ? vv.height : window.innerHeight);
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      document.body.style.overflow = prevOverflow;
      setMobileHeight(null);
    };
  }, [isOpen]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the MHBHC assistant. I can answer questions about our behavioral health programs, services, and how to get support. Please, how can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [handoffSent, setHandoffSent] = useState(false);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [showHandoffForm, setShowHandoffForm] = useState(false);
  const [handoffName, setHandoffName] = useState("");
  const [handoffPhone, setHandoffPhone] = useState("");
  const [handoffError, setHandoffError] = useState<
    string | null
  >(null);
  const [sessionId, setSessionId] = useState<string | null>(
    () => {
      try {
        return sessionStorage.getItem(SESSION_KEY);
      } catch {
        return null;
      }
    },
  );

  const [pollStatus, setPollStatus] = useState<
    "idle" | "ok" | "error"
  >("idle");
  const [chatEnded, setChatEnded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lastTimestampRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (showHandoffForm) nameRef.current?.focus();
  }, [showHandoffForm]);

  // Poll for staff messages when a session is active
  useEffect(() => {
    if (!sessionId) return;

    const poll = async () => {
      try {
        const res = await fetch(
          `${WORKER_URL}/poll?session=${sessionId}&since=${lastTimestampRef.current}`,
        );
        if (!res.ok) {
          console.error(
            "[MHBHC poll] HTTP error:",
            res.status,
            await res.text().catch(() => ""),
          );
          setPollStatus("error");
          return;
        }
        const data = (await res.json()) as {
          messages: {
            id: string;
            role: "visitor" | "staff";
            content: string;
            timestamp: number;
          }[];
        };
        setPollStatus("ok");

        if (data.messages.length) {
          // Advance the timestamp cursor for ALL returned messages (visitor echo + staff)
          lastTimestampRef.current = Math.max(
            ...data.messages.map((m) => m.timestamp),
          );

          // Only display staff messages — visitor messages are already shown locally
          const staffMessages = data.messages.filter(
            (m) => m.role === "staff",
          );
          if (staffMessages.length) {
            setMessages((prev) => [
              ...prev,
              ...staffMessages.map((m) => ({
                role: "staff" as const,
                content: m.content,
              })),
            ]);
          }
        }
      } catch (e) {
        console.error("[MHBHC poll] fetch error:", e);
        setPollStatus("error");
      }
    };

    const id = setInterval(poll, 3000);
    poll();
    return () => clearInterval(id);
  }, [sessionId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");

    // Staff chat mode — send directly to worker as visitor message
    if (sessionId) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
      ]);
      await fetch(`${WORKER_URL}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: sessionId,
          role: "visitor",
          content: text,
        }),
      }).catch(() => {});
      return;
    }

    // AI chat mode
    const userMessage: Message = {
      role: "user",
      content: text,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`${WORKER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.filter(
            (m) => m.role !== "staff",
          ),
        }),
      });

      if (!response.ok || !response.body) {
        const errText = await response.text();
        throw new Error(
          `Worker error ${response.status}: ${errText}`,
        );
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const event = JSON.parse(data);
            if (
              event.type === "content_block_delta" &&
              event.delta?.type === "text_delta"
            ) {
              assistantText += event.delta.text;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return next;
              });
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong. Please try again or reach out directly at info@mhbhc.org or (303) 863-8300.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHumanHandoff = async () => {
    const name = handoffName.trim();
    const phone = handoffPhone.trim();

    if (!name) {
      setHandoffError("Please enter your name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setHandoffError("Please enter a valid phone number.");
      return;
    }

    setHandoffError(null);
    setHandoffLoading(true);
    const transcript = messages
      .map(
        (m) =>
          `${m.role === "user" ? "Visitor" : m.role === "staff" ? "Staff" : "Assistant"}: ${m.content}`,
      )
      .join("\n");

    try {
      const res = await fetch(`${WORKER_URL}/handoff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, name, phone }),
      });
      if (!res.ok)
        throw new Error(`Handoff failed: ${res.status}`);
      const data = (await res.json()) as {
        ok: boolean;
        sessionId: string;
      };
      if (data.ok && data.sessionId) {
        setSessionId(data.sessionId);
        try {
          sessionStorage.setItem(SESSION_KEY, data.sessionId);
        } catch {}
      }
      setShowHandoffForm(false);
      setHandoffSent(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Thanks, ${name} — you're now connected to an MHBHC team member. They'll reply here shortly, or reach you at ${phone} if you step away.`,
        },
      ]);
    } catch {
      setShowHandoffForm(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Please contact our team directly at info@mhbhc.org or call (303) 863-8300.",
        },
      ]);
    } finally {
      setHandoffLoading(false);
    }
  };

  const handleEndChat = async () => {
    if (!sessionId) return;
    setChatEnded(true);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "You have ended this chat session. Thank you for reaching out to MHBHC. If you need further assistance, feel free to start a new chat.",
      },
    ]);
    await fetch(`${WORKER_URL}/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session: sessionId }),
    }).catch(() => {});
    setSessionId(null);
  };

  const isLiveChat = !!sessionId;

  return (
    <div data-aichat>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Open MHBHC chat assistant"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full ${isOpen ? "hidden md:flex" : "flex"} bg-gradient-to-br from-[#25a794] to-[#1d9e8c] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 items-center justify-center`}
      >
        {isOpen ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden md:inset-auto md:bottom-24 md:right-6 md:w-[360px] md:h-auto md:max-h-[540px] md:rounded-2xl md:shadow-2xl md:border md:border-gray-100"
          style={mobileHeight ? { height: mobileHeight } : undefined}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25a794] to-[#1d9e8c] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                {isLiveChat ? (
                  <UserCheck className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p
                  className="text-white font-semibold text-sm leading-none"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {isLiveChat
                    ? "Live Support"
                    : "MHBHC Assistant"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isLiveChat && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${pollStatus === "error" ? "bg-red-400" : "bg-green-300 animate-pulse"}`}
                    />
                  )}
                  <p className="text-white/80 text-xs">
                    {isLiveChat
                      ? pollStatus === "error"
                        ? "Connection issue — retrying…"
                        : "Connected to MHBHC staff"
                      : "Mile High Behavioral Health Care"}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-[#f8fcfb]"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-[#457B9D]"
                      : msg.role === "staff"
                        ? "bg-[#1D3557]"
                        : "bg-gradient-to-br from-[#25a794] to-[#1d9e8c]"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-3.5 h-3.5 text-white" />
                  ) : msg.role === "staff" ? (
                    <UserCheck className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <div className="flex flex-col max-w-[75%]">
                  {msg.role === "staff" && (
                    <span
                      className="text-[10px] font-semibold text-[#25a794] mb-0.5"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      MHBHC Staff
                    </span>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#457B9D] text-white rounded-tr-sm"
                        : msg.role === "staff"
                          ? "bg-[#e8f8f5] text-[#1D3557] rounded-tl-sm border border-[#25a794]/30"
                          : "bg-white text-[#1D3557] rounded-tl-sm shadow-sm border border-gray-100"
                    }`}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {msg.content ? (
                      <MessageContent text={msg.content} />
                    ) : (
                      <span className="flex gap-1 items-center py-0.5">
                        <span
                          className="w-1.5 h-1.5 bg-[#25a794] rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-[#25a794] rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-[#25a794] rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* End Chat button — shown below last message when in live support */}
            {isLiveChat && !chatEnded && (
              <div className="flex justify-center pt-1 pb-2">
                <button
                  onClick={handleEndChat}
                  className="flex items-center gap-1.5 text-xs text-[#b91c1c]/70 hover:text-[#b91c1c] border border-[#b91c1c]/20 hover:border-[#b91c1c]/50 bg-white rounded-full px-3 py-1.5 transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <X className="w-3 h-3" />
                  End Chat
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Human handoff strip — only shown in AI mode */}
          {!handoffSent && !isLiveChat && !showHandoffForm && (
            <div className="flex-shrink-0 px-4 py-2 bg-[#F1FAEE] border-t border-[#25a794]/20 flex items-center justify-between">
              <span
                className="text-xs text-[#457B9D]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Prefer to speak with a person?
              </span>
              <button
                onClick={() => setShowHandoffForm(true)}
                className="flex items-center gap-1.5 text-xs text-[#25a794] font-semibold hover:text-[#1d9e8c] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Phone className="w-3 h-3" />
                Talk to a Human
              </button>
            </div>
          )}

          {/* Contact details collected before connecting to staff */}
          {!handoffSent && !isLiveChat && showHandoffForm && (
            <div
              className="flex-shrink-0 px-4 py-3 bg-[#F1FAEE] border-t border-[#25a794]/20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#1D3557]">
                  Where can our team reach you?
                </span>
                <button
                  onClick={() => {
                    setShowHandoffForm(false);
                    setHandoffError(null);
                  }}
                  aria-label="Cancel request for a human"
                  className="text-[#457B9D]/60 hover:text-[#457B9D] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  ref={nameRef}
                  type="text"
                  value={handoffName}
                  onChange={(e) =>
                    setHandoffName(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleHumanHandoff()
                  }
                  placeholder="Your name"
                  autoComplete="name"
                  disabled={handoffLoading}
                  className="w-full text-base md:text-sm px-3 py-2 rounded-lg border border-[#25a794]/30 bg-white text-[#1D3557] placeholder:text-gray-400 focus:outline-none focus:border-[#25a794] transition-colors disabled:opacity-60"
                />
                <input
                  type="tel"
                  value={handoffPhone}
                  onChange={(e) =>
                    setHandoffPhone(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleHumanHandoff()
                  }
                  placeholder="Phone number"
                  autoComplete="tel"
                  inputMode="tel"
                  disabled={handoffLoading}
                  className="w-full text-base md:text-sm px-3 py-2 rounded-lg border border-[#25a794]/30 bg-white text-[#1D3557] placeholder:text-gray-400 focus:outline-none focus:border-[#25a794] transition-colors disabled:opacity-60"
                />
              </div>
              {handoffError && (
                <p className="text-xs text-[#b91c1c] mt-2">
                  {handoffError}
                </p>
              )}
              <button
                onClick={handleHumanHandoff}
                disabled={handoffLoading}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#25a794] to-[#1d9e8c] rounded-full px-3 py-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {handoffLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Phone className="w-3 h-3" />
                )}
                {handoffLoading
                  ? "Connecting…"
                  : "Connect me with a person"}
              </button>
            </div>
          )}

          {/* Input */}
          <div className="flex-shrink-0 p-3 border-t border-gray-100 bg-white flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                sendMessage()
              }
              placeholder={
                chatEnded
                  ? "Chat ended"
                  : isLiveChat
                    ? "Message MHBHC staff…"
                    : "Ask about MHBHC programs…"
              }
              disabled={isLoading || chatEnded}
              className="flex-1 text-base md:text-sm px-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-[#1D3557] placeholder:text-gray-400 focus:outline-none focus:border-[#25a794] focus:bg-white transition-colors disabled:opacity-60"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || chatEnded}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#25a794] to-[#1d9e8c] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}