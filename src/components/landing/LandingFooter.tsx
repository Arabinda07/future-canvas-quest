import { Mail, Phone, MapPin } from "lucide-react";

const LandingFooter = () => (
  <footer className="py-12 pb-7" style={{ background: "hsl(250 30% 15%)", color: "rgba(255,255,255,0.4)" }}>
    <div className="max-w-[1080px] mx-auto px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-9">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="4" stroke="white" strokeWidth="2"/>
                <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-heading text-lg font-bold text-white">Future Canvas</span>
          </div>
          <p className="text-sm max-w-[280px] leading-relaxed">A personal initiative to give every Class 9–12 student in India a science-backed career direction — not just a guess.</p>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <div className="text-[0.72rem] font-extrabold uppercase tracking-widest text-white/40 mb-2">Contact Arabinda</div>
          <a href="mailto:arabinda.saha06.07@gmail.com" className="flex items-center gap-2 text-sm text-white/50 hover:text-sunshine transition-colors">
            <Mail size={14} /> arabinda.saha06.07@gmail.com
          </a>
          <a href="https://wa.me/918240959567" className="flex items-center gap-2 text-sm text-white/50 hover:text-sunshine transition-colors">
            <Phone size={14} /> +91 82409 59567
          </a>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <MapPin size={14} /> Siliguri, West Bengal
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
        <span>© {new Date().getFullYear()} Future Canvas · Arabinda Saha · Personal Initiative</span>
        <span className="text-white/25">Built with care for Indian school students</span>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
