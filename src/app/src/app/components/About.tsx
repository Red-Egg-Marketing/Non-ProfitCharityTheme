import { Brain, Users, Home, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import aboutImg from "../../imports/military-mom.jpg";

export function About() {
  const features = [
    {
      icon: Brain,
      title: "Mental Health & Substance Use",
      description: "Comprehensive behavioral health services addressing the full spectrum of mental health and substance use needs."
    },
    {
      icon: Users,
      title: "Inclusive for Everyone",
      description: "Affirming care for LGBTQ2S+, families, youth, and justice-involved individuals — everyone is welcome at MHBHC."
    },
    {
      icon: Home,
      title: "Housing & Crisis Support",
      description: "The Comitis Crisis Center provides shelter and housing support for those in acute crisis, meeting people where they are."
    },
    {
      icon: Heart,
      title: "Integrated Healthcare",
      description: "Co-located behavioral and physical health services at our Sheridan and Summit County clinics for whole-person wellness."
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src={aboutImg}
                alt="Military mother reunited with daughter — MHBHC serves veterans and families"
                className="w-full h-[480px] object-cover"
              />
            </div>
            {/* Stat badge */}
            <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
              <div
                className="text-4xl text-[#25a794] font-bold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >250K+</div>
              <div className="text-sm text-[#457B9D] mt-1">Individuals Served</div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-block px-4 py-2 bg-[#F1FAEE] rounded-full">
              <span className="text-[#25a794] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>About MHBHC</span>
            </div>

            <h2
              className="text-4xl lg:text-5xl text-[#1D3557] leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              A Caring Continuum of{" "}
              <span className="text-[#25a794]">Behavioral Healthcare</span>
            </h2>

            <p className="text-[#457B9D] leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Mile High Behavioral Health Care&apos;s mission is to provide a caring, seamless continuum
              of behavioral healthcare to those in need. Based in Denver&apos;s Globeville neighborhood,
              we serve individuals and families across Denver, Sheridan, Aurora, and Summit County.
            </p>

            <p className="text-[#457B9D] leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              From mental health and substance use treatment to housing support and LGBTQ2S+ affirming
              care, our 11+ programs meet people wherever they are on their journey to wellness —
              with dignity, compassion, and without judgment.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#F1FAEE] rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#25a794] to-[#1d9e8c] rounded-xl flex items-center justify-center mb-3">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    className="text-[#1D3557] text-sm font-semibold mb-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >{feature.title}</h3>
                  <p className="text-xs text-[#457B9D]" style={{ fontFamily: "'Inter', sans-serif" }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
