import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Why", href: "#why" },
  { label: "Science", href: "#how-science" },
  { label: "Assessment", href: "#what" },
  { label: "About", href: "#who" },
  { label: "Contact", href: "#contact" },
];

const LandingNavbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 px-5 ${scrolled ? "top-0" : "top-4"}`}>
        <div className="max-w-[1100px] mx-auto">
          <div className="glass flex items-center justify-between gap-2 px-3 py-2 rounded-full border border-white/20">
            {/* Logo */}
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2 font-heading italic text-base text-white/90 px-2 py-1 shrink-0">
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              Future Canvas
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map((l) => (
                <button key={l.label} onClick={() => scrollTo(l.href)} className="text-white/60 text-[0.82rem] font-normal px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">
                  {l.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate("/counselor/login")}
                className="inline-flex items-center gap-2 text-white/65 text-[0.8rem] font-medium px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:text-white hover:bg-white/[0.07] transition-all"
              >
                Counselor login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 bg-white text-black text-[0.8rem] font-medium px-5 py-2 rounded-full hover:bg-white/90 hover:-translate-y-0.5 transition-all"
              >
                Take the test
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 text-white/80" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99] bg-black/96 backdrop-blur-xl flex flex-col px-7 pt-24 gap-1">
          <button className="absolute top-5 right-6 text-white/60 text-xl p-2" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
          {navLinks.map((l) => (
            <button key={l.label} onClick={() => scrollTo(l.href)} className="block py-4 text-left font-heading italic text-3xl text-white/80 border-b border-white/10 hover:text-white transition-colors">
              {l.label}
            </button>
          ))}
          <button onClick={() => { setMobileOpen(false); navigate("/register"); }} className="mt-6 bg-white text-black font-medium py-3.5 rounded-full text-center">
            Take the test →
          </button>
          <button onClick={() => { setMobileOpen(false); navigate("/counselor/login"); }} className="border border-white/10 bg-white/[0.04] text-white/80 font-medium py-3.5 rounded-full text-center">
            Counselor login
          </button>
        </div>
      )}
    </>
  );
};

export default LandingNavbar;
