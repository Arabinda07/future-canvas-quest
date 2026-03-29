import { motion } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";

const AboutSection = () => (
  <section id="about" className="py-20 lg:py-24 border-t border-border">
    <div className="max-w-[1080px] mx-auto px-6">
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-center">
        {/* Photo */}
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="relative">
          <div className="w-full aspect-[3/4] rounded-3xl bg-gradient-to-br from-lavender-light to-mint-light shadow-card-hover overflow-hidden flex flex-col items-center justify-center gap-2.5">
            <span className="text-5xl opacity-35">🧑‍💼</span>
            <span className="text-muted-foreground text-sm font-bold">Your photo here</span>
          </div>
          <div className="absolute -top-4 -right-5 bg-card border border-border rounded-xl p-3 shadow-card-hover animate-float" style={{ animationDuration: "5s" }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <div>
                <div className="text-xs font-extrabold text-foreground">IIT Kharagpur</div>
                <div className="text-xs text-muted-foreground">Alumni Network</div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-5 gradient-accent rounded-xl p-3 shadow-lg animate-float" style={{ animationDuration: "6s", animationDirection: "reverse" }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <div>
                <div className="text-xs font-extrabold text-primary-foreground">Durgapur</div>
                <div className="text-xs text-primary-foreground/65">West Bengal</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-primary bg-lavender-light px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            The person behind this
          </div>
          <h2 className="font-heading text-[clamp(1.8rem,3vw,2.4rem)] font-bold text-foreground mb-4">
            Hi, I'm <span className="italic text-primary">Arabinda Saha</span>
          </h2>
          <div className="space-y-4 text-muted-foreground text-base leading-relaxed mb-6">
            <p>Future Canvas started as a career readiness program I designed and delivered at Kendriya Vidyalayas under the Government of India's PM SHRI initiative — a NEP 2020 implementation program I ran across schools as Program Head at Edudigm.</p>
            <p>After three years of building and scaling school programs — 600+ schools, 1,500+ students, 6 states — I left to continue this work independently. Future Canvas is that continuation: the same assessment, the same science, now available directly to any student or school, without institutional overhead.</p>
            <p>This is not a startup. It's one person, one validated question paper, and a genuine commitment to getting career guidance right for Indian students — one school at a time.</p>
          </div>
          <div className="flex gap-3.5 flex-wrap">
            <a href="https://www.linkedin.com/in/robin0607saha/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary hover:bg-lavender-light transition-all">
              <Linkedin size={16} className="opacity-60" /> LinkedIn
            </a>
            <a href="mailto:arabinda.saha06.07@gmail.com" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary hover:bg-lavender-light transition-all">
              <Mail size={16} className="opacity-60" /> arabinda.saha06.07@gmail.com
            </a>
            <a href="https://wa.me/918240959567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border border-border bg-card text-muted-foreground hover:border-secondary hover:text-secondary hover:bg-mint-light transition-all">
              <span className="text-base">💬</span> WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
