import aboutProfilePhoto from "@/assets/about-profile.webp";
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
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="relative">
          <div className="glass w-full aspect-[3/4] rounded-[20px] overflow-hidden" style={{ background: "rgba(124,107,202,0.08)" }}>
            <img src={aboutProfilePhoto} alt="Portrait of Arabinda Saha" className="h-full w-full object-cover object-center" />
          </div>
          <div className="absolute -top-4 -right-5 glass rounded-[14px] p-3 flex items-center gap-2.5 animate-float" style={{ animationDuration: "5s" }}>
            <span className="text-xl">??</span>
            <div>
              <div className="text-[0.8rem] font-medium text-white/90 leading-tight">IIT Kgp Research Park</div>
              <div className="text-[0.72rem] font-light text-white/50">Speaker · 2025</div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-5 glass rounded-[14px] p-3 flex items-center gap-2.5 animate-float" style={{ animationDuration: "6s", animationDirection: "reverse", background: "rgba(124,107,202,0.15)", border: "1px solid rgba(124,107,202,0.3)" }}>
            <span className="text-xl">??</span>
            <div>
              <div className="text-[0.8rem] font-medium leading-tight" style={{ color: "rgba(200,185,255,0.9)" }}>Durgapur, West Bengal</div>
              <div className="text-[0.72rem] font-light text-white/50">M.Sc. Mathematics · Jadavpur University</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
          <div className="glass inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-white/80 px-4 py-1.5 rounded-full mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-white/60 shrink-0" />
            The person behind this
          </div>
          <h2 className="font-heading italic text-[clamp(2.4rem,4.5vw,3.8rem)] text-white mb-5">
            Hi, I&apos;m
            <br />
            <em>Arabinda Saha</em>
          </h2>
          <div className="space-y-4 mb-5">
            <p className="text-white/60 text-[0.97rem] font-light leading-[1.85]">I spent three years as Program Head at Edudigm — designing and scaling school programs across 600+ schools, 6 states, and 1,500+ students. A significant part of that work was delivering career readiness under the Government of India&apos;s PM SHRI initiative at Kendriya Vidyalayas.</p>
            <p className="text-white/60 text-[0.97rem] font-light leading-[1.85]">Future Canvas is what came out of those three years. The frameworks — Aptitude, RIASEC, Big Five — were tested in real classrooms, with real Class 9–12 students, with real counsellors watching. I saw what worked and what didn&apos;t.</p>
            <p className="text-white/60 text-[0.97rem] font-light leading-[1.85]">I left Edudigm to continue this as a personal initiative — not a startup, not an institution. One person, one validated question paper, and a commitment to getting career guidance right for Indian students before scaling it.</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-7">
            {credentials.map((credential) => (
              <span key={credential} className="glass text-[0.72rem] font-medium tracking-[0.04em] px-3.5 py-1 rounded-full text-white/70">{credential}</span>
            ))}
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <a href="https://www.linkedin.com/in/robin0607saha/" target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[0.82rem] font-medium text-white/80 hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
