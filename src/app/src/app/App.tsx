import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Causes } from "./components/Causes";
import { VolunteerCTA } from "./components/VolunteerCTA";
import { Events } from "./components/Events";
import { Testimonials } from "./components/Testimonials";
import { CounterStats } from "./components/CounterStats";
import { Blog } from "./components/Blog";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { DonationModal } from "./components/DonationModal";
import { AIChat } from "./components/AIChat";

export default function App() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const openDonate = () => setIsDonateOpen(true);
  const closeDonate = () => setIsDonateOpen(false);

  useEffect(() => {
    const moveToLeft = (el: HTMLElement) => {
      let target: HTMLElement = el;
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        const r = parent.getBoundingClientRect();
        if (r.width < 160 && r.height < 160) { target = parent; parent = parent.parentElement; }
        else break;
      }
      target.style.setProperty("position", "fixed", "important");
      target.style.setProperty("bottom", "24px", "important");
      target.style.setProperty("left", "24px", "important");
      target.style.setProperty("right", "auto", "important");
      target.style.setProperty("z-index", "9999", "important");
    };

    const scanRoot = (root: Document | ShadowRoot) => {
      root.querySelectorAll<HTMLElement>("*").forEach(el => {
        if (el.closest?.("[data-aichat]")) return;
        const text = el.textContent?.trim();
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const isBottomRight = rect.right > window.innerWidth * 0.6 && rect.bottom > window.innerHeight * 0.6;
        if (
          (text === "?" || text === "??") &&
          rect.width < 160 && rect.height < 160 && isBottomRight
        ) {
          moveToLeft(el);
        }
        if (el.shadowRoot) scanRoot(el.shadowRoot);
      });
    };

    const reposition = () => scanRoot(document);
    reposition();
    const observer = new MutationObserver(reposition);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header onDonateClick={openDonate} />
      <main>
        <Hero onDonateClick={openDonate} />
        <About />
        <Causes onDonateClick={openDonate} />
        <VolunteerCTA />
        <Events />
        <Testimonials />
        <CounterStats />
        <Blog />
        <Newsletter />
      </main>
      <Footer />
      <DonationModal isOpen={isDonateOpen} onClose={closeDonate} />
      <AIChat />
    </div>
  );
}
