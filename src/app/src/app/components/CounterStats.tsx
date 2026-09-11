import { Users, MapPin, Layers, HeartHandshake } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function CounterStats() {
  const stats = [
    {
      icon: Users,
      end: 250000,
      label: "Individuals Served",
      suffix: "+"
    },
    {
      icon: Layers,
      end: 11,
      label: "Programs Offered",
      suffix: "+"
    },
    {
      icon: MapPin,
      end: 4,
      label: "Colorado Locations",
      suffix: ""
    },
    {
      icon: HeartHandshake,
      end: 40,
      label: "Years of Community Care",
      suffix: "+"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-r from-[#457B9D] to-[#1D3557] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1440px] mx-auto px-10 lg:px-20 relative z-10">
        <div className="text-center mb-12">
          <p
            className="text-white/70 text-sm uppercase tracking-widest mb-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >Our Impact</p>
          <h2
            className="text-3xl lg:text-4xl text-white"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
          >
            Changing Lives Across Colorado
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-4 group"
            >
              <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              <div>
                <div
                  className="text-4xl lg:text-5xl text-white mb-2 font-bold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Counter
                    end={stat.end}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-white/80 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = end / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  return (
    <span ref={ref}>
      {count >= 1000 ? formatNumber(count) : count}
      {suffix}
    </span>
  );
}
