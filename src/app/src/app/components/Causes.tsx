import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";
import { Progress } from "./ui/progress";
import behavioralHealthImg from "../../imports/mental_health_substance_use.jpg";
import familyImg from "../../imports/family_preservation_center.jpg";
import housingImg from "../../imports/homeless_services.jpg";
import lgbtqImg from "../../imports/the_Denver_Element.jpg";

interface ProgramProps {
  onDonateClick: () => void;
}

export function Causes({ onDonateClick }: ProgramProps) {
  const programs = [
    {
      title: "Behavioral Health",
      category: "Mental Health & SUD",
      description: "Mental health and substance use disorder treatment for adults at our 4242 Delaware St. location in Denver.",
      image: behavioralHealthImg,
      raised: 48000,
      goal: 75000,
      progress: 64
    },
    {
      title: "Family Preservation Center",
      category: "Children & Families",
      description: "Children and adolescent mental health services helping families thrive at our Aurora Montview Blvd. clinic.",
      image: familyImg,
      raised: 31500,
      goal: 50000,
      progress: 63
    },
    {
      title: "Housing & Crisis Support",
      category: "Housing Stability",
      description: "The Comitis Crisis Center provides shelter, housing navigation, and crisis stabilization for individuals in acute need.",
      image: housingImg,
      raised: 62000,
      goal: 80000,
      progress: 78
    },
    {
      title: "LGBTQ2S+ Services",
      category: "Affirming Care",
      description: "Denver Element, PRIDEvolution, and the Transgender Center of the Rockies offer culturally affirming care for all identities.",
      image: lgbtqImg,
      raised: 27000,
      goal: 45000,
      progress: 60
    }
  ];

  return (
    <section id="programs" className="py-20 lg:py-28 bg-[#F1FAEE]">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-white rounded-full mb-4">
            <span className="text-[#25a794] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Our Programs</span>
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#1D3557] mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
          >
            Support a <span className="text-[#25a794]">Program</span> Today
          </h2>
          <p className="text-[#457B9D]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Your donation directly funds the services that change lives across Denver and Colorado.
            Every gift helps MHBHC meet growing community need.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52">
                <ImageWithFallback
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-[#25a794] px-3 py-1 rounded-full text-xs font-semibold shadow">
                    {program.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3
                  className="text-[#1D3557] font-semibold text-base leading-snug"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >{program.title}</h3>
                <p className="text-sm text-[#457B9D] line-clamp-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {program.description}
                </p>

                {/* Progress */}
                <div className="space-y-2">
                  <Progress value={program.progress} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-[#25a794] font-semibold">
                      ${program.raised.toLocaleString()} raised
                    </span>
                    <span className="text-[#457B9D]">
                      of ${program.goal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  onClick={onDonateClick}
                  className="w-full bg-gradient-to-r from-[#25a794] to-[#1d9e8c] text-white hover:opacity-90 gap-2 rounded-full text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Donate Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Programs */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-[#457B9D] text-[#457B9D] hover:bg-[#457B9D] hover:text-white px-8 rounded-full"
            style={{ fontFamily: "'Inter', sans-serif" }}
            asChild
          >
            <a href="https://www.milehighbehavioralhealthcare.org/" target="_blank" rel="noopener noreferrer">
              View All Programs
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
