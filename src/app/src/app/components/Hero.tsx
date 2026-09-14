import { Button } from "./ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import heroImg from "../../imports/shutterstock_58980130.jpg";

interface HeroProps {
  onDonateClick: () => void;
}

export function Hero({ onDonateClick }: HeroProps) {
  return (
    <section id="home" className="relative bg-[#F1FAEE] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-20 py-16 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <Heart className="w-4 h-4 text-[#25a794] fill-[#25a794]" />
              <span className="text-[#457B9D] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Serving Colorado Since 1960</span>
            </div>

            <h1
              className="text-4xl lg:text-6xl text-[#1D3557] leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              Caring, Seamless{" "}
              <span className="text-[#25a794]">Behavioral Health</span>{" "}
              for Everyone
            </h1>

            <p
              className="text-lg text-[#457B9D] max-w-xl leading-relaxed"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Mile High Behavioral Health Care provides a continuum of mental health,
              substance use, housing, and integrated care services — meeting people where
              they are across Denver and the Rocky Mountain region.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onDonateClick}
                className="bg-gradient-to-r from-[#25a794] to-[#1d9e8c] text-white hover:opacity-90 px-8 py-6 gap-2 rounded-full font-semibold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Donate via Colorado Gives
                <ArrowRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                className="border-[#457B9D] text-[#457B9D] hover:bg-[#457B9D] hover:text-white px-8 py-6 gap-2 rounded-full font-semibold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                asChild
              >
                <a href="#programs">Our Programs</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#457B9D]/20">
              <div>
                <div
                  className="text-3xl text-[#25a794] font-bold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >250K+</div>
                <div className="text-sm text-[#457B9D] mt-1">Individuals Served</div>
              </div>
              <div>
                <div
                  className="text-3xl text-[#25a794] font-bold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >11+</div>
                <div className="text-sm text-[#457B9D] mt-1">Programs Offered</div>
              </div>
              <div>
                <div
                  className="text-3xl text-[#25a794] font-bold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >4</div>
                <div className="text-sm text-[#457B9D] mt-1">Colorado Locations</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={heroImg}
                alt="Mother and son laughing together — family wellbeing at MHBHC"
                className="w-full h-[520px] object-cover"
              />
              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 bg-white rounded-2xl p-5 shadow-xl max-w-[260px]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#25a794] to-[#1d9e8c] rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Heart className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <div
                      className="text-xl text-[#1D3557] font-bold"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >Everyone Welcome</div>
                    <div className="text-xs text-[#457B9D]">Inclusive, affirming care for all</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent blob */}
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#25a794]/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#457B9D]/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
