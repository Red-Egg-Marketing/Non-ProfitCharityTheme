import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Maria T.",
      role: "MHBHC Client, Behavioral Health Program",
      initial: "M",
      color: "#25a794",
      quote: "MHBHC helped me when I had nowhere else to turn. The counselors treated me with dignity and helped me find stability again. I wouldn't be where I am today without this organization."
    },
    {
      name: "James R.",
      role: "Community Donor",
      initial: "J",
      color: "#457B9D",
      quote: "I donate through Colorado Gives every year because I trust MHBHC with my money. They serve some of the most vulnerable people in Denver and do it with genuine compassion."
    },
    {
      name: "Aaliyah W.",
      role: "Volunteer, Denver Element Program",
      initial: "A",
      color: "#1D3557",
      quote: "Volunteering at Denver Element opened my eyes to how much LGBTQ2S+ affirming mental health care matters. The staff are incredible advocates for every single client."
    },
    {
      name: "Dr. Sandra K.",
      role: "Community Partner, Sheridan Clinic",
      initial: "S",
      color: "#25a794",
      quote: "The integrated health model at the Sheridan location is exactly what our community needed. MHBHC bridges physical and behavioral health seamlessly — it's a model for the state."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F1FAEE]">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-white rounded-full mb-4">
            <span className="text-[#25a794] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Stories of Impact</span>
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#1D3557] mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
          >
            Voices from Our <span className="text-[#25a794]">Community</span>
          </h2>
          <p className="text-[#457B9D]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Real words from those whose lives have been touched by MHBHC&apos;s programs, donors,
            and community partners across Colorado.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-white border-none shadow-lg h-full">
                  <CardContent className="p-8 space-y-6">
                    {/* Quote Icon */}
                    <div className="w-12 h-12 bg-gradient-to-r from-[#25a794] to-[#1d9e8c] rounded-full flex items-center justify-center">
                      <Quote className="w-6 h-6 text-white" />
                    </div>

                    {/* Quote */}
                    <p
                      className="text-[#457B9D] italic leading-relaxed"
                      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                    >
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                        style={{ backgroundColor: testimonial.color, fontFamily: "'Poppins', sans-serif" }}
                      >
                        {testimonial.initial}
                      </div>
                      <div>
                        <div
                          className="text-[#1D3557] font-semibold text-sm"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >{testimonial.name}</div>
                        <div
                          className="text-xs text-[#457B9D]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
