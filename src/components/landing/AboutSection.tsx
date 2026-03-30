import { motion } from "framer-motion";

const credentials = [
  "Program Head · Edudigm",
  "PM SHRI · KV Programs",
  "Stellar Space Quiz · 600+ Schools",
  "Data Consultant · LKS",
];

const AboutSection = () => (
  <section id="who" className="py-24 lg:py-28 bg-background border-t border-white/10 relative overflow-hidden">
    <div className="glow-blob w-[500px] h-[500px] -top-[100px] -left-[100px]" style={{ background: "rgba(124,107,202,0.18)", animationDuration: "10s" }} />

    <div className="max-w-[1100px] mx-auto px-7">
      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-20 items-center relative z-[1]">
        {/* Photo */}
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="relative">
          <div className="glass w-full aspect-[3/4] rounded-[20px] flex flex-col items-center justify-center gap-2.5 overflow-hidden" style={{ background: "rgba(124,107,202,0.08)" }}>
            <span className="text-5xl opacity-20">🧑‍💼</span>
            <span className="text-white/40 text-[0.82rem] text-center leading-[1.5]">Your photo here<br /><span className="opacity-50 font-light">arabinda07.github.io/assets/photo.png</span></span>
          </div>
          {/* Badge 1 */}
          <div className="absolute -top-4 -right-5 glass rounded-[14px] p-3 flex items-center gap-2.5 animate-float" style={{ animationDuration: "5s" }}>
            <span className="text-xl">🎤</span>
            <div>
              <div className="text-[0.8rem] font-medium text-white/90 leading-tight">IIT Kgp Research Park</div>
              <div className="text-[0.72rem] font-light text-white/50">Speaker · 2025</div>
            </div>
          </div>
          {/* Badge 2 */}
          <div className="absolute -bottom-4 -left-5 glass rounded-[14px] p-3 flex items-center gap-2.5 animate-float" style={{ animationDuration: "6s", animationDirection: "reverse", background: "rgba(124,107,202,0.15)", border: "1px solid rgba(124,107,202,0.3)" }}>
            <span className="text-xl">📍</span>
            <div>
              <div className="text-[0.8rem] font-medium leading-tight" style={{ color: "rgba(200,185,255,0.9)" }}>Durgapur, West Bengal</div>
              <div className="text-[0.72rem] font-light text-white/50">M.Sc. Mathematics · Jadavpur University</div>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
          <div className="glass inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-white/80 px-4 py-1.5 rounded-full mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-white/60 shrink-0" />
            The person behind this
          </div>
          <h2 className="font-heading italic text-[clamp(2.4rem,4.5vw,3.8rem)] text-white mb-5">
            Hi, I'm<br /><em>Arabinda Saha</em>
          </h2>
          <div className="space-y-4 mb-5">
            <p className="text-white/60 text-[0.97rem] font-light leading-[1.85]">I spent three years as Program Head at Edudigm — designing and scaling school programs across 600+ schools, 6 states, and 1,500+ students. A significant part of that work was delivering career readiness under the Government of India's PM SHRI initiative at Kendriya Vidyalayas.</p>
            <p className="text-white/60 text-[0.97rem] font-light leading-[1.85]">Future Canvas is what came out of those three years. The frameworks — Aptitude, RIASEC, Big Five — were tested in real classrooms, with real Class 9–12 students, with real counsellors watching. I saw what worked and what didn't.</p>
            <p className="text-white/60 text-[0.97rem] font-light leading-[1.85]">I left Edudigm to continue this as a personal initiative — not a startup, not an institution. One person, one validated question paper, and a commitment to getting career guidance right for Indian students before scaling it.</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-7">
            {credentials.map((c) => (
              <span key={c} className="glass text-[0.72rem] font-medium tracking-[0.04em] px-3.5 py-1 rounded-full text-white/70">{c}</span>
            ))}
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <a href="https://www.linkedin.com/in/robin0607saha/" target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[0.82rem] font-medium text-white/80 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(124,107,202,0.8)"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
            <a href="https://arabinda07.github.io/" target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[0.82rem] font-medium text-white/80 hover:text-white transition-colors">
              🌐 Full portfolio →
            </a>
            <a href="mailto:arabinda.saha06.07@gmail.com" className="glass inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[0.82rem] font-medium text-white/80 hover:text-white transition-colors">
              ✉️ Email
            </a>
            <a href="https://wa.me/918240959567" target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[0.82rem] font-medium text-white/80 hover:text-white transition-colors">
              💬 WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
