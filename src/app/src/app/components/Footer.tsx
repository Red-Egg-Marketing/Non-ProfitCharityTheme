import { Brain, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import logoImg from "../../imports/MHBHC-stacked_copy.jpg";

export function Footer() {
  const quickLinks = [
    { label: "About MHBHC", href: "#about" },
    { label: "Our Programs", href: "#programs" },
    { label: "Get Involved", href: "#volunteer" },
    { label: "Events", href: "#events" },
    { label: "News", href: "#blog" },
    { label: "Contact Us", href: "#contact" }
  ];

  const programs = [
    { label: "Behavioral Health", href: "https://www.milehighbehavioralhealthcare.org/" },
    { label: "Family Preservation Center", href: "https://www.milehighbehavioralhealthcare.org/" },
    { label: "Housing & Crisis Support", href: "https://www.milehighbehavioralhealthcare.org/" },
    { label: "LGBTQ2S+ Services", href: "https://www.milehighbehavioralhealthcare.org/" },
    { label: "Integrated Health Care", href: "https://www.milehighbehavioralhealthcare.org/" },
    { label: "Transcend Aftercare", href: "https://www.milehighbehavioralhealthcare.org/" }
  ];

  const resources = [
    { label: "Donate via Colorado Gives", href: "https://www.coloradogives.org/donate/MHBHC" },
    { label: "Volunteer Opportunities", href: "mailto:info@mhbhc.org" },
    { label: "Request a Speaker", href: "mailto:info@mhbhc.org" },
    { label: "Schedule a Tour", href: "mailto:info@mhbhc.org" },
    { label: "Annual Reports", href: "https://www.milehighbehavioralhealthcare.org/" },
    { label: "Privacy Policy", href: "#" }
  ];

  const locations = [
    { label: "Denver (Executive)", phone: "(720) 975-0155" },
    { label: "Behavioral Health", phone: "(303) 825-8113" },
    { label: "Sheridan Integrated", phone: "(303) 761-0200" },
    { label: "Summit County", phone: "(970) 485-6676" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/MileHighBehavioralHealthCare", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/milehighbehavioralhealthcare/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/mile-high-behavioral-health-care/", label: "LinkedIn" }
  ];

  return (
    <footer id="contact" className="bg-[#1D3557] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-10 lg:px-20 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* About Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img
                src={logoImg}
                alt="Mile High Behavioral Health Care logo"
                className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <div
                  className="text-white font-bold text-base leading-tight"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >Mile High</div>
                <div className="text-white/60 text-xs">Behavioral Health Care</div>
              </div>
            </div>

            <p className="text-white/70 leading-relaxed text-sm">
              To provide a caring, seamless continuum of behavioral healthcare to those in need
              — across Denver, Sheridan, Aurora, and Summit County.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>P.O. Box 919<br />Aurora, CO 80040</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>(720) 975-0155</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@mhbhc.org" className="hover:text-[#25a794] transition-colors">info@mhbhc.org</a>
              </div>
            </div>

            {/* Locations Quick Reference */}
            <div className="space-y-2">
              <div className="text-white/50 text-xs uppercase tracking-wider">Clinic Lines</div>
              {locations.map((loc, i) => (
                <div key={i} className="text-xs text-white/60">
                  <span className="text-white/40">{loc.label}:</span>{" "}
                  <a href={`tel:${loc.phone.replace(/\D/g, "")}`} className="hover:text-[#25a794] transition-colors">
                    {loc.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-white mb-6 font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-[#25a794] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Programs */}
          <div>
            <h3
              className="text-white mb-6 font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >Our Programs</h3>
            <ul className="space-y-3">
              {programs.map((program, index) => (
                <li key={index}>
                  <a
                    href={program.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[#25a794] transition-colors text-sm"
                  >
                    {program.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className="text-white mb-6 font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >Resources & Support</h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.href}
                    target={resource.href.startsWith("http") ? "_blank" : undefined}
                    rel={resource.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-white/70 hover:text-[#25a794] transition-colors text-sm"
                  >
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Colorado Gives Badge */}
            <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20">
              <p className="text-xs text-white/60 mb-2">Donate securely through</p>
              <a
                href="https://www.coloradogives.org/donate/MHBHC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold text-sm hover:text-[#25a794] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                ColoradoGives.org →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-10 lg:px-20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/50">
              © 2026 Mile High Behavioral Health Care. All rights reserved. A 501(c)(3) nonprofit organization.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 hover:bg-[#25a794] rounded-full flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
