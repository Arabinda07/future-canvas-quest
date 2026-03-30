import aboutProfile from "@/assets/about-profile.webp";
import { GraduationCap, Linkedin, Sparkles } from "lucide-react";

const credentials = [
  "IIT Kharagpur",
  "IIM Calcutta",
  "Ex-Edudigm",
  "Career Guidance Researcher",
];

const AboutSection = () => {
  return (
    <section id="about" className="relative px-5 py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[26rem] h-[26rem] bg-[hsl(var(--lavender-glow)/0.16)] top-[-8rem] right-[-7rem]" />
        <div className="glow-blob w-[24rem] h-[24rem] bg-[hsl(var(--mint-glow)/0.12)] bottom-[-8rem] left-[-5rem]" style={{ animationDuration: "16s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute inset-x-[8%] top-[12%] h-[70%] rounded-[42px] bg-[radial-gradient(circle_at_50%_35%,rgba(150,132,255,0.32),rgba(150,132,255,0.06)_45%,transparent_74%)] blur-2xl" />
          <div className="absolute inset-x-[14%] bottom-[2%] h-[48%] rounded-[999px] bg-[radial-gradient(circle_at_50%_50%,rgba(95,211,184,0.18),transparent_72%)] blur-3xl" />

          <div className="relative mx-auto max-w-[30rem]">
            <div className="about-photo-shell rounded-[38px] p-[1px]">
              <div className="about-photo-panel rounded-[38px] px-5 pt-5 sm:px-7 sm:pt-7">
                <div className="about-photo-mask aspect-[4/5] overflow-hidden rounded-[30px]">
                  <img
                    src={aboutProfile}
                    alt="Robin Saha"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-6 glass rounded-full px-4 py-2 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-white/80 animate-float">
              Founder-led
            </div>
            <div
              className="absolute -left-4 bottom-10 glass rounded-[18px] px-4 py-3 flex items-center gap-3 animate-float"
              style={{ animationDuration: "6s", animationDirection: "reverse", background: "rgba(124,107,202,0.14)", border: "1px solid rgba(124,107,202,0.22)" }}
            >
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
                <GraduationCap size={18} className="text-white/85" />
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-white/55">Built from research</p>
                <p className="text-sm font-medium text-white/88">For Indian students and schools</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="glass inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-white/80 px-4 py-1.5 rounded-full mb-5">
            <Sparkles size={14} className="text-[hsl(var(--lavender))]" />
            About the maker
          </div>

          <h2 className="text-[clamp(2.8rem,6vw,5.1rem)] max-w-[11ch] mb-6">
            Career guidance,
            <br />
            rebuilt with care.
          </h2>

          <div className="space-y-4 text-white/68 text-[0.98rem] leading-[1.85] max-w-2xl">
            <p>
              I’m Robin Saha, the creator of Future Canvas. I studied at <span className="text-white/88 font-medium">IIT Kharagpur</span> and <span className="text-white/88 font-medium">IIM Calcutta</span>, and I previously worked with Edudigm on career guidance for schools.
            </p>
            <p>
              This assessment is designed to feel calm, modern, and trustworthy while staying grounded in validated question design for Indian students.
            </p>
            <p>
              I left Edudigm to continue this as a personal initiative — not a startup, not an institution. One person, one validated question paper, and a commitment to getting career guidance right for Indian students before scaling it.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-7 mb-8">
            {credentials.map((credential) => (
              <span key={credential} className="glass text-[0.72rem] font-medium tracking-[0.04em] px-3.5 py-1 rounded-full text-white/72">
                {credential}
              </span>
            ))}
          </div>

          <a
            href="https://www.linkedin.com/in/robin0607saha/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[0.82rem] font-medium text-white/80 hover:text-white transition-colors"
          >
            <Linkedin size={16} />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
