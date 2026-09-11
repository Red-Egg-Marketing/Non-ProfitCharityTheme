import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoImg from "../../imports/MHBHC-stacked_copy.jpg";

interface HeaderProps {
  onDonateClick: () => void;
}

export function Header({ onDonateClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-[1440px] mx-auto px-10 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Mile High Behavioral Health Care logo"
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[#1D3557] font-bold text-base leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Mile High</span>
              <span className="text-[#457B9D] text-xs leading-tight tracking-wide">Behavioral Health Care</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">Home</a>
            <a href="#about" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">About</a>
            <a href="#programs" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">Programs</a>
            <a href="#events" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">Events</a>
            <a href="#blog" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">News</a>
            <a href="#contact" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">Contact</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={onDonateClick}
              className="bg-gradient-to-r from-[#25a794] to-[#1d9e8c] text-white hover:opacity-90 px-8 py-6 rounded-full font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Donate Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#1D3557]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <a href="#home" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">Home</a>
              <a href="#about" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">About</a>
              <a href="#programs" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">Programs</a>
              <a href="#events" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">Events</a>
              <a href="#blog" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">News</a>
              <a href="#contact" className="text-[#1D3557] hover:text-[#25a794] transition-colors text-sm font-medium">Contact</a>
              <Button
                onClick={onDonateClick}
                className="bg-gradient-to-r from-[#25a794] to-[#1d9e8c] text-white hover:opacity-90 w-full rounded-full"
              >
                Donate Now
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
