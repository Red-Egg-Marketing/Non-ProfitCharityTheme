import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F1FAEE]">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#1D3557] to-[#457B9D] rounded-3xl p-12 lg:p-16 relative overflow-hidden">
            {/* Background Circles */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-white rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>

              <h2
                className="text-3xl lg:text-4xl text-white"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
              >
                Stay Connected with MHBHC
              </h2>

              <p
                className="text-lg text-white/90 max-w-2xl mx-auto"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Get updates on our programs, community events, and ways to support
                behavioral health in Colorado. Join our newsletter and stay informed.
              </p>

              {submitted ? (
                <div className="bg-white/20 rounded-2xl p-6 max-w-xl mx-auto">
                  <p
                    className="text-white font-semibold text-lg"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Thank you for subscribing! ✓
                  </p>
                  <p className="text-white/80 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    We&apos;ll be in touch with news from MHBHC.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-white border-none h-14 px-6 text-[#1D3557] placeholder:text-[#457B9D] rounded-full"
                    />
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#25a794] to-[#1d9e8c] text-white hover:opacity-90 h-14 px-8 whitespace-nowrap rounded-full font-semibold"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-sm text-white/70 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
