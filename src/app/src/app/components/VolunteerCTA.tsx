import { Button } from "./ui/button";
import { HandHeart, Users, Calendar, Megaphone } from "lucide-react";

export function VolunteerCTA() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-r from-[#25a794] to-[#1d9e8c] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border-4 border-white rounded-full" />
      </div>

      <div className="max-w-[1440px] mx-auto px-10 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <HandHeart className="w-5 h-5" />
              <span className="text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Get Involved</span>
            </div>

            <h2
              className="text-4xl lg:text-5xl leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              Make a Difference in Colorado&apos;s Behavioral Health
            </h2>

            <p
              className="text-lg text-white/90 leading-relaxed"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              MHBHC welcomes community support in many forms — volunteer your time,
              serve on a committee, organize a drive, or request a speaker for your
              organization. Every act of engagement strengthens our ability to serve.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="bg-white text-[#25a794] hover:bg-white/90 px-8 rounded-full font-semibold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                asChild
              >
                <a href="mailto:info@mhbhc.org">Volunteer with MHBHC</a>
              </Button>
              
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Users, number: "4", label: "Service Locations" },
              { icon: Calendar, number: "Year-Round", label: "Community Events" },
              { icon: HandHeart, number: "11+", label: "Active Programs" },
              { icon: Megaphone, number: "Speakers", label: "Available for Outreach" }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/30 transition-colors"
              >
                <stat.icon className="w-10 h-10 mb-4" />
                <div
                  className="text-2xl mb-2 font-bold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >{stat.number}</div>
                <div className="text-sm text-white/80" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
