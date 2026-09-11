import { useState } from "react";
import { X, Heart, CheckCircle, ExternalLink, Brain, MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import logoImg from "../../imports/MHBHC-stacked_copy.jpg";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (!isOpen) return null;

  const displayAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount || selectedAmount?.toString() || "";
    const url = new URL("https://www.coloradogives.org/donate/MHBHC");
    if (amount) url.searchParams.set("amount", amount);
    if (frequency === "monthly") url.searchParams.set("frequency", "monthly");
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ fontFamily: "'Inter', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid lg:grid-cols-[380px_1fr]">

          {/* Left Panel — Nonprofit Info */}
          <div className="bg-gradient-to-b from-[#1A3A6B] to-[#0F2449] text-white p-8 lg:p-10 flex flex-col gap-6 lg:rounded-l-2xl">
            {/* Close button (mobile) */}
            <button
              onClick={onClose}
              className="lg:hidden absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#25a794] to-[#1d9e8c] rounded-xl flex items-center justify-center flex-shrink-0">
                <img
                  src={logoImg}
                  alt="Mile High Behavioral Health Care logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <div
                  className="font-bold text-lg leading-tight"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >Mile High</div>
                <div className="text-white/70 text-xs">Behavioral Health Care</div>
              </div>
            </div>

            {/* Mission */}
            <div>
              <h2
                className="text-xl font-bold mb-3 leading-snug"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Your Gift Changes Lives in Colorado
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                MHBHC&apos;s mission is to provide a caring, seamless continuum of behavioral
                healthcare to those in need — regardless of income, identity, or background.
              </p>
            </div>

            {/* Impact bullets */}
            <div className="space-y-3">
              {[
                { icon: Users, text: "250,000+ individuals served across Colorado" },
                { icon: MapPin, text: "4 locations: Denver, Sheridan, Aurora & Summit County" },
                { icon: Heart, text: "11+ programs including LGBTQ2S+ affirming care" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-white/80" />
                  </div>
                  <p className="text-white/80 text-sm">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Amount preview */}
            {displayAmount && displayAmount > 0 && (
              <div className="mt-auto bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-white/60 text-xs mb-1">Your {frequency === "monthly" ? "monthly" : "one-time"} gift</p>
                <p
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  ${displayAmount.toLocaleString()}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Processed securely via Colorado Gives Foundation
                </p>
              </div>
            )}

            {/* Colorado Gives branding */}
            <div className="mt-auto pt-4 border-t border-white/20">
              <p className="text-white/40 text-xs mb-1">Powered by</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#2E7D32] rounded flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <span className="text-white/70 text-sm font-medium">ColoradoGives.org</span>
              </div>
              <p className="text-white/40 text-xs mt-2">
                Colorado Gives Foundation · EIN 51-0157964 · 501(c)(3)
              </p>
            </div>
          </div>

          {/* Right Panel — Donation Form */}
          <div className="bg-white p-8 lg:p-10 flex flex-col gap-6 lg:rounded-r-2xl">
            {/* Close button (desktop) */}
            <div className="flex items-center justify-between">
              <h3
                className="text-xl font-bold text-[#1D3557]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Make a Donation
              </h3>
              <button
                onClick={onClose}
                className="hidden lg:flex w-8 h-8 bg-gray-100 rounded-full items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Frequency Toggle */}
              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-3">
                  Gift Frequency
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                  {(["once", "monthly"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        frequency === f
                          ? "bg-white text-[#1A3A6B] shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {f === "once" ? "One-Time" : "Monthly"}
                    </button>
                  ))}
                </div>
                {frequency === "monthly" && (
                  <p className="text-xs text-[#457B9D] mt-2">
                    Monthly gifts provide MHBHC with reliable funding to plan and expand services.
                  </p>
                )}
              </div>

              {/* Amount Presets */}
              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedAmount === amount
                          ? "border-[#1A3A6B] bg-[#1A3A6B] text-white"
                          : "border-gray-200 text-gray-700 hover:border-[#1A3A6B] hover:text-[#1A3A6B]"
                      }`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      ${amount}
                    </button>
                  ))}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold">$</span>
                    <input
                      type="number"
                      placeholder="Other"
                      value={customAmount}
                      onChange={(e) => handleCustomAmount(e.target.value)}
                      min="1"
                      className={`w-full py-3 pl-7 pr-3 rounded-xl text-sm font-semibold border-2 transition-all outline-none ${
                        customAmount
                          ? "border-[#1A3A6B] bg-[#1A3A6B] text-white placeholder:text-white/60"
                          : "border-gray-200 text-gray-700 placeholder:text-gray-400 hover:border-[#1A3A6B]"
                      }`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Donor Info */}
              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-3">
                  Your Information
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={!isAnonymous}
                      disabled={isAnonymous}
                      className="h-11 text-sm border-gray-200 focus:border-[#1A3A6B]"
                    />
                    <Input
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={!isAnonymous}
                      disabled={isAnonymous}
                      className="h-11 text-sm border-gray-200 focus:border-[#1A3A6B]"
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={!isAnonymous}
                    disabled={isAnonymous}
                    className="h-11 text-sm border-gray-200 focus:border-[#1A3A6B]"
                  />

                  {/* Anonymous toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 accent-[#1A3A6B]"
                    />
                    <span className="text-sm text-gray-600">Make my donation anonymous</span>
                  </label>

                  {/* Comment */}
                  <textarea
                    placeholder="Leave a message for MHBHC (optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#1A3A6B] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Trust signals */}
              <div className="flex items-center gap-4 py-3 border-y border-gray-100">
                {[
                  "Secure 256-bit encryption",
                  "Tax-deductible gift",
                  "Powered by Colorado Gives"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32] flex-shrink-0" />
                    <span className="text-xs text-gray-500">{item}</span>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={!displayAmount || displayAmount <= 0}
                className="w-full h-14 bg-gradient-to-r from-[#25a794] to-[#1d9e8c] text-white hover:opacity-90 text-base font-bold rounded-xl gap-2 disabled:opacity-40"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Heart className="w-5 h-5 fill-white" />
                Give {displayAmount && displayAmount > 0 ? `$${Number(displayAmount).toLocaleString()}` : "Now"}
                {frequency === "monthly" ? " / Month" : ""}
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>

              <p className="text-center text-xs text-gray-400">
                You&apos;ll be redirected to Colorado Gives Foundation to complete your secure donation.
                MHBHC is a registered 501(c)(3) nonprofit.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
