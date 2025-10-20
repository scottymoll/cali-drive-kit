import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollToSection, scrollToTop } = useScrollToSection();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        scrolled
          ? "bg-card/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={scrollToTop}
              className="font-heading font-bold text-lg md:text-xl tracking-tighter bg-pacific-900 text-white px-3 py-1.5 rounded-md hover:bg-pacific-600 transition-smooth"
            >
              CA Car Seller Kit
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Main navigation">
            <button
              onClick={() => scrollToSection("whats-inside")}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth"
              data-track="nav"
              aria-label="Navigate to What's Inside section"
            >
              What's Inside
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth"
              data-track="nav"
              aria-label="Navigate to How It Works section"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("results")}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth"
              data-track="nav"
              aria-label="Navigate to Results section"
            >
              Results
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth"
              data-track="nav"
              aria-label="Navigate to FAQ section"
            >
              FAQ
            </button>
          </nav>

          <Button
            size="lg"
            onClick={() => scrollToSection("price")}
            className="font-semibold"
            data-cta="buy"
          >
            Get the Kit — $19.99
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
