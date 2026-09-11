import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, User, ArrowRight } from "lucide-react";
import healthCareImg from "../../imports/health_care.jpg";

export function Blog() {
  const posts = [
    {
      title: "Breaking the Stigma: Behavioral Health in Denver&apos;s Globeville Neighborhood",
      excerpt: "How MHBHC is changing the conversation around mental health and substance use in one of Denver&apos;s most underserved communities.",
      image: healthCareImg,
      author: "MHBHC Communications",
      date: "August 20, 2026",
      category: "Community"
    },
    {
      title: "LGBTQ2S+ Affirming Care: How the Transgender Center of the Rockies Serves Colorado",
      excerpt: "A look inside MHBHC&apos;s gender-affirming programs — from Denver Element to PRIDEvolution — and why they matter more than ever.",
      image: "https://images.unsplash.com/photo-1618333832740-86db840a1f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwY29sb3JhZG8lMjBub25wcm9maXQlMjB2b2x1bnRlZXJpbmd8ZW58MXx8fHwxNzg5MTQwNjA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "MHBHC Programs Team",
      date: "July 15, 2026",
      category: "Programs"
    },
    {
      title: "Housing as Healthcare: MHBHC&apos;s Holistic Approach to Crisis Stabilization",
      excerpt: "The Comitis Crisis Center doesn&apos;t just provide shelter — it connects individuals to a full continuum of care for lasting stability.",
      image: "https://images.unsplash.com/photo-1607749101678-01b521ae7900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxyZWNvdmVyeSUyMGhvcGUlMjB3ZWxsbmVzcyUyMHBlb3BsZSUyMHNtaWxpbmd8ZW58MXx8fHwxNzg5MTQwNjE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "MHBHC Housing Team",
      date: "June 28, 2026",
      category: "Impact"
    }
  ];

  return (
    <section id="blog" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-[#F1FAEE] rounded-full mb-4">
            <span className="text-[#25a794] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Latest News</span>
          </div>
          <h2
            className="text-4xl lg:text-5xl text-[#1D3557] mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
          >
            Stories of <span className="text-[#25a794]">Hope & Change</span>
          </h2>
          <p className="text-[#457B9D]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Stay updated on MHBHC&apos;s programs, community impact, and the people behind the mission.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#25a794] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3
                  className="text-[#1D3557] font-semibold group-hover:text-[#25a794] transition-colors line-clamp-2 leading-snug"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />

                <p
                  className="text-sm text-[#457B9D] line-clamp-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-[#457B9D] pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Read More */}
                <Button
                  variant="ghost"
                  className="text-[#25a794] hover:text-[#25a794] hover:bg-[#F1FAEE] p-0 h-auto gap-1 text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
