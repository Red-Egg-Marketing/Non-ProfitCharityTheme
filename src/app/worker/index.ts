import systemPrompt from "./prompts/system.md";
import knowledge from "./prompts/knowledge.md";

const SYSTEM_PROMPT = `${systemPrompt.trim()}

${knowledge.trim()}`;

const CORS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface Env {
  ANTHROPIC_API_KEY: string;
  SLACK_WEBHOOK_URL: string;
  SESSIONS: KVNamespace;
}

interface ChatMessage {
  id: string;
  role: "visitor" | "staff";
  content: string;
  timestamp: number;
}

interface Session {
  sessionId: string;
  initialTranscript: string;
  visitorName: string;
  visitorPhone: string;
  messages: ChatMessage[];
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const { pathname } = url;

    // POST /chat — stream Anthropic response
    if (pathname === "/chat" && request.method === "POST") {
      const { messages } = await request.json<{
        messages: { role: string; content: string }[];
      }>();

      const upstream = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-5",
            max_tokens: 512,
            system: SYSTEM_PROMPT,
            messages,
            stream: true,
          }),
        },
      );

      if (!upstream.ok) {
        const err = await upstream.text();
        console.error("Anthropic error:", upstream.status, err);
        return new Response(JSON.stringify({ error: err }), {
          status: upstream.status,
          headers: {
            ...CORS,
            "Content-Type": "application/json",
          },
        });
      }

      return new Response(upstream.body, {
        headers: {
          ...CORS,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }

    // POST /handoff — create session, post to Slack with reply link
    if (pathname === "/handoff" && request.method === "POST") {
      const { transcript, name, phone } = await request.json<{
        transcript: string;
        name?: string;
        phone?: string;
      }>();

      const visitorName =
        (name ?? "").trim().slice(0, 100) || "Not provided";
      const visitorPhone =
        (phone ?? "").trim().slice(0, 40) || "Not provided";
      const sessionId = crypto.randomUUID();

      const session: Session = {
        sessionId,
        initialTranscript: transcript,
        visitorName,
        visitorPhone,
        messages: [],
      };
      await env.SESSIONS.put(
        `session:${sessionId}`,
        JSON.stringify(session),
        {
          expirationTtl: 86400,
        },
      );

      const staffUrl = `${url.origin}/staff?session=${sessionId}`;

      if (!env.SLACK_WEBHOOK_URL) {
        console.error("SLACK_WEBHOOK_URL is not configured");
        return new Response(
          JSON.stringify({
            error: "Slack notifications are not configured",
          }),
          {
            status: 503,
            headers: {
              ...CORS,
              "Content-Type": "application/json",
            },
          },
        );
      }

      const slackResponse = await fetch(env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `:wave: *New MHBHC Chat Handoff*\n\nA visitor is requesting to speak with a human.\n\n*Name:* ${visitorName}\n*Phone:* ${visitorPhone}\n\n*Transcript:*\n${transcript}\n\n*<${staffUrl}|Click here to reply in the chat widget>*`,
        }),
      });

      if (!slackResponse.ok) {
        const error = await slackResponse.text();
        console.error(
          "Slack webhook error:",
          slackResponse.status,
          error,
        );
        return new Response(
          JSON.stringify({
            error: "Slack notification failed",
          }),
          {
            status: 502,
            headers: {
              ...CORS,
              "Content-Type": "application/json",
            },
          },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, sessionId }),
        {
          headers: {
            ...CORS,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // GET /poll?session=xxx&since=timestamp — fetch new messages
    if (pathname === "/poll" && request.method === "GET") {
      const sessionId = url.searchParams.get("session");
      const since = parseInt(
        url.searchParams.get("since") ?? "0",
      );
      if (!sessionId)
        return new Response("Missing session", {
          status: 400,
          headers: CORS,
        });

      const session = await env.SESSIONS.get<Session>(
        `session:${sessionId}`,
        "json",
      );
      if (!session)
        return new Response("Session not found", {
          status: 404,
          headers: CORS,
        });

      const messages = session.messages.filter(
        (m) => m.timestamp > since,
      );
      return new Response(JSON.stringify({ messages }), {
        headers: {
          ...CORS,
          "Content-Type": "application/json",
        },
      });
    }

    // POST /message — post a visitor or staff message
    if (pathname === "/message" && request.method === "POST") {
      const {
        session: sessionId,
        role,
        content,
      } = await request.json<{
        session: string;
        role: "visitor" | "staff";
        content: string;
      }>();

      const session = await env.SESSIONS.get<Session>(
        `session:${sessionId}`,
        "json",
      );
      if (!session)
        return new Response("Session not found", {
          status: 404,
          headers: CORS,
        });

      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: Date.now(),
      };
      session.messages = [...session.messages, msg];
      await env.SESSIONS.put(
        `session:${sessionId}`,
        JSON.stringify(session),
        {
          expirationTtl: 86400,
        },
      );

      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          ...CORS,
          "Content-Type": "application/json",
        },
      });
    }

    // GET /staff?session=xxx — serve staff chat UI
    if (pathname === "/staff" && request.method === "GET") {
      const sessionId = url.searchParams.get("session");
      if (!sessionId)
        return new Response("Missing session", { status: 400 });

      const session = await env.SESSIONS.get<Session>(
        `session:${sessionId}`,
        "json",
      );
      const transcript =
        session?.initialTranscript ??
        "No transcript available.";
      const visitorName =
        session?.visitorName ?? "Not provided";
      const visitorPhone =
        session?.visitorPhone ?? "Not provided";

      return new Response(
        staffHtml(
          sessionId,
          url.origin,
          transcript,
          visitorName,
          visitorPhone,
        ),
        {
          headers: {
            "Content-Type": "text/html;charset=UTF-8",
          },
        },
      );
    }

    return new Response("Not found", {
      status: 404,
      headers: CORS,
    });
  },
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function staffHtml(
  sessionId: string,
  workerUrl: string,
  transcript: string,
  visitorName: string,
  visitorPhone: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MHBHC Staff Chat</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0faf8;height:100vh;display:flex;flex-direction:column}
    header{background:linear-gradient(135deg,#25a794,#1d9e8c);color:#fff;padding:14px 24px;flex-shrink:0}
    header h1{font-size:17px;font-weight:600}
    header p{font-size:12px;opacity:.8;margin-top:2px}
    .contact{background:#fff;border-bottom:1px solid #e5e7eb;padding:10px 24px;flex-shrink:0;display:flex;gap:24px;flex-wrap:wrap;font-size:12px;color:#1D3557}
    .contact strong{color:#457B9D;font-weight:600}
    details{background:#fff;border-bottom:1px solid #e5e7eb;padding:12px 24px;flex-shrink:0}
    summary{font-size:12px;font-weight:600;color:#457B9D;cursor:pointer;user-select:none}
    pre{font-size:11px;color:#6b7280;white-space:pre-wrap;margin-top:8px;line-height:1.5}
    #chat{flex:1;overflow-y:auto;padding:16px 24px;display:flex;flex-direction:column;gap:12px}
    .msg{display:flex;gap:8px;align-items:flex-start}
    .msg.visitor{flex-direction:row-reverse}
    .av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;color:#fff}
    .av.staff{background:linear-gradient(135deg,#25a794,#1d9e8c)}
    .av.visitor{background:#457B9D}
    .col{display:flex;flex-direction:column;max-width:72%}
    .msg.visitor .col{align-items:flex-end}
    .lbl{font-size:10px;color:#9ca3af;margin-bottom:3px}
    .bubble{padding:9px 13px;border-radius:16px;font-size:13px;line-height:1.5;word-break:break-word}
    .bubble.staff{background:#fff;color:#1D3557;border-radius:4px 16px 16px 16px;box-shadow:0 1px 3px rgba(0,0,0,.1)}
    .bubble.visitor{background:#457B9D;color:#fff;border-radius:16px 4px 16px 16px}
    .waiting{text-align:center;color:#9ca3af;font-size:13px;padding:24px}
    .bar{padding:14px 24px;background:#fff;border-top:1px solid #e5e7eb;display:flex;gap:8px;flex-shrink:0}
    input{flex:1;padding:9px 16px;border:1px solid #d1d5db;border-radius:9999px;font-size:14px;outline:none}
    input:focus{border-color:#25a794}
    button{padding:9px 20px;background:linear-gradient(135deg,#25a794,#1d9e8c);color:#fff;border:none;border-radius:9999px;font-size:14px;font-weight:600;cursor:pointer}
    button:disabled{opacity:.5;cursor:not-allowed}
  </style>
</head>
<body>
  <header>
    <h1>MHBHC Staff Chat</h1>
    <p>Visitor requested human support</p>
  </header>
  <div class="contact">
    <span><strong>Name:</strong> ${esc(visitorName)}</span>
    <span><strong>Phone:</strong> ${esc(visitorPhone)}</span>
  </div>
  <details>
    <summary>View AI chat transcript</summary>
    <pre>${esc(transcript)}</pre>
  </details>
  <div id="chat">
    <div class="waiting" id="waiting">Visitor is waiting for your reply…</div>
  </div>
  <div class="bar">
    <input id="inp" placeholder="Type your reply…" autofocus />
    <button id="btn">Send</button>
  </div>
<script>
  const SESSION=${JSON.stringify(sessionId)};
  const W=${JSON.stringify(workerUrl)};
  let last=0;

  async function poll(){
    try{
      const r=await fetch(W+'/poll?session='+SESSION+'&since='+last);
      if(!r.ok)return;
      const{messages}=await r.json();
      if(messages.length){
        document.getElementById('waiting').style.display='none';
        messages.forEach(add);
        last=Math.max(...messages.map(m=>m.timestamp));
        const c=document.getElementById('chat');
        c.scrollTop=c.scrollHeight;
      }
    }catch(e){}
  }

  function add(m){
    const chat=document.getElementById('chat');
    const d=document.createElement('div');
    d.className='msg '+m.role;
    d.innerHTML=
      '<div class="av '+m.role+'">'+(m.role==='staff'?'S':'V')+'</div>'+
      '<div class="col">'+
        '<div class="lbl">'+(m.role==='staff'?'You (Staff)':'Visitor')+'</div>'+
        '<div class="bubble '+m.role+'">'+m.content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div>'+
      '</div>';
    chat.appendChild(d);
  }

  async function send(){
    const inp=document.getElementById('inp');
    const content=inp.value.trim();
    if(!content)return;
    inp.value='';
    document.getElementById('btn').disabled=true;
    try{
      await fetch(W+'/message',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({session:SESSION,role:'staff',content}),
      });
      poll();
    }finally{
      document.getElementById('btn').disabled=false;
      inp.focus();
    }
  }

  document.getElementById('btn').onclick=send;
  document.getElementById('inp').addEventListener('keydown',e=>{
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}
  });

  setInterval(poll,500);
  poll();
</script>
</body>
</html>`;
}