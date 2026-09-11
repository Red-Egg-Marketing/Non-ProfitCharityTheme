import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export function Events() {
  const events = [
    {
      title: "Annual Mental Health Awareness Walk",
      date: "October 10, 2026",
      time: "9:00 AM - 12:00 PM",
      location: "City Park, Denver, CO",
      image: "https://images.unsplash.com/photo-1485109937568-36342ad79216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwY29sb3JhZG8lMjBub25wcm9maXQlMjB2b2x1bnRlZXJpbmd8ZW58MXx8fHwxNzg5MTQwNjA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Community"
    },
    {
      title: "MHBHC Fall Fundraising Gala",
      date: "November 8, 2026",
      time: "6:00 PM - 10:00 PM",
      location: "The Crawford Hotel, Denver, CO",
      image: "https://images.unsplash.com/photo-1600043908813-ee35bec3251d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwY29sb3JhZG8lMjBub25wcm9maXQlMjB2b2x1bnRlZXJpbmd8ZW58MXx8fHwxNzg5MTQwNjA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Fundraiser"
    },
    {
      title: "Volunteer Orientation & Tour",
      date: "September 27, 2026",
      time: "10:00 AM - 12:00 PM",
      location: "4242 Delaware St., Denver, CO",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBjb3Vuc2VsaW5nJTIwY29tbXVuaXR5JTIwc3VwcG9ydHxlbnwxfHx8fDE3ODkxNDA2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Volunteer"
    }
  ];

  return (
    <section id="events" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-[#F1FAEE] rounded-full mb-4">
            <span className="text-[#25a794] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Upcoming Events</span>
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#1D3557] mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
          >
            Join the <span className="text-[#25a794]">MHBHC Community</span>
          </h2>
          <p className="text-[#457B9D]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Connect, give back, and help reduce stigma around behavioral health.
            Our events bring together supporters across Colorado to advance our mission.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#25a794] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3
                  className="text-[#1D3557] font-semibold group-hover:text-[#25a794] transition-colors leading-snug"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {event.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#457B9D]">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#457B9D]">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#457B9D]">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-[#25a794] text-[#25a794] hover:bg-[#25a794] hover:text-white gap-2 rounded-full text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  asChild
                >
                  <a href="mailto:info@mhbhc.org">
                    Register / Learn More
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            className="bg-gradient-to-r from-[#25a794] to-[#1d9e8c] text-white hover:opacity-90 px-8 rounded-full"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            asChild
          >
            <a href="mailto:info@mhbhc.org">Contact Us About Events</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
