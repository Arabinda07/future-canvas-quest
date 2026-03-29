import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { label: "What it tests", href: "#what" },
  { label: "How it works", href: "#how" },
  { label: "PM SHRI Deployment", href: "#proof" },
  { label: "About me", href: "#about" },
  { label: "For schools", href: "#schools" },
];

const LandingNavbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/90 backdrop-blur-xl border-b border-border shadow-card py-2.5" : "py-4"}`}>
        <div className="max-w-[1080px] mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 font-heading text-lg font-bold text-foreground">
            <div className="w-9 h-9 rounded-[10px] gradient-accent flex items-center justify-center shadow-md">
              <Sparkles size={16} className="text-primary-foreground" />
            </div>
            Future Canvas
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((l) => (
              <button key={l.label} onClick={() => scrollTo(l.href)} className="text-muted-foreground text-sm font-semibold px-3.5 py-2 rounded-lg hover:text-primary hover:bg-lavender-light transition-all">
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Button size="sm" className="hidden sm:inline-flex gradient-accent text-primary-foreground rounded-full font-bold px-5 gap-1.5" onClick={() => navigate("/register")}>
              Take the test <ArrowRight size={14} />
            </Button>
            <button className="md:hidden p-1" onClick={() => setMobileOpen(true)}>
              <Menu size={22} className="text-foreground" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99] bg-background flex flex-col px-7 pt-24 gap-1">
          <button className="absolute top-5 right-5 w-9 h-9 rounded-full bg-lavender-light flex items-center justify-center text-primary" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
          {navLinks.map((l) => (
            <button key={l.label} onClick={() => scrollTo(l.href)} className="block py-3.5 text-lg font-bold text-foreground border-b border-border text-left hover:text-primary transition-colors">
              {l.label}
            </button>
          ))}
          <Button className="mt-5 gradient-accent text-primary-foreground rounded-full font-bold min-h-[52px] justify-center" onClick={() => { setMobileOpen(false); navigate("/register"); }}>
            Take the free test <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </>
  );
};

export default LandingNavbar;
