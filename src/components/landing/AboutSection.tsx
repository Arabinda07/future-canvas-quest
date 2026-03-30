import { Globe, Linkedin, Mail, MessageCircle } from "lucide-react";

const credentials = [
  "Program Head · Edudigm",
  "PM SHRI · KV Programs",
  "Stellar Space Quiz · 600+ Schools",
  "Data Consultant · LKS",
];

const AboutSection = () => {
  return (
    <section id="who" className="relative overflow-hidden border-t border-white/10 px-5 py-24 md:py-32">
      <div className="glow-blob who-glow" />

      <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="who-photo-wrap order-2 lg:order-1">
          <div className="who-photo glass">
            <img src="https://arabinda07.github.io/assets/photo.png" alt="Arabinda Saha" loading="lazy" />
            <div className="who-photo-blend" aria-hidden="true" />
          </div>

          <div className="who-badge wb-1 glass">
            <span className="wb-emoji" aria-hidden="true">🎤</span>
            <div>
              <div className="wb-title">IIT Kgp Research Park</div>
              <div className="wb-sub">Speaker · 2025</div>
            </div>
          </div>

          <div className="who-badge wb-2 glass">
            <span className="wb-emoji" aria-hidden="true">📍</span>
            <div>
              <div className="wb-title wb-title-accent">Durgapur, West Bengal</div>
              <div className="wb-sub">M.Sc. Mathematics · Jadavpur University</div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-white/80">
            <span className="inline-flex h-2 w-2 rounded-full bg-[hsl(var(--lavender))]" />
            The person behind this
          </div>

          <h2 className="mb-6 text-[clamp(2.2rem,6vw,4.9rem)] leading-[1.05]">
            Hi, I&apos;m
            <br />
            <em>Arabinda Saha</em>
          </h2>

          <p className="who-body">
            I spent three years as Program Head at Edudigm — designing and scaling school programs across 600+ schools,
            6 states, and 1,500+ students. A significant part of that work was delivering career readiness under the
            Government of India&apos;s PM SHRI initiative at Kendriya Vidyalayas.
          </p>
          <p className="who-body">
            Future Canvas is what came out of those three years. The frameworks — Aptitude, RIASEC, Big Five — were
            tested in real classrooms, with real Class 9–12 students and real counsellors watching. I saw what worked
            and what didn&apos;t.
          </p>
          <p className="who-body">
            I left Edudigm to continue this as a personal initiative — not a startup, not an institution. One person,
            one validated question paper, and a commitment to getting career guidance right for Indian students before
            scaling it.
          </p>

          <div className="cred-row">
            {credentials.map((credential) => (
              <span key={credential} className="cred-chip glass">
                {credential}
              </span>
            ))}
          </div>

          <div className="who-links">
            <a href="https://www.linkedin.com/in/robin0607saha/" target="_blank" rel="noopener noreferrer" className="who-link glass">
              <Linkedin size={14} className="text-[hsl(var(--lavender))]" />
              LinkedIn
            </a>
            <a href="https://arabinda07.github.io/" target="_blank" rel="noopener noreferrer" className="who-link glass">
              <Globe size={14} className="text-[hsl(var(--lavender))]" />
              Full portfolio →
            </a>
            <a href="mailto:arabinda.saha06.07@gmail.com" className="who-link glass">
              <Mail size={14} className="text-[hsl(var(--lavender))]" />
              Email
            </a>
            <a href="https://wa.me/918240959567" target="_blank" rel="noopener noreferrer" className="who-link glass">
              <MessageCircle size={14} className="text-[hsl(var(--mint))]" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
