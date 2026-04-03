import { motion } from "framer-motion";
import kv2Photo1 from "@/assets/kv2-classroom-1.jpg";
import kv2Photo2 from "@/assets/kv2-classroom-2.jpg";
import kv2Photo3 from "@/assets/kv2-classroom-3.jpg";

const SocialProof = () => (
  <section id="proof" className="py-24 lg:py-28 relative overflow-hidden border-t border-white/10" style={{ background: "#0a0a0a" }}>
    <div className="glow-blob w-[500px] h-[500px] -bottom-[80px] -left-[80px]" style={{ background: "rgba(76,175,142,0.15)", animationDuration: "15s" }} />

    <div className="max-w-[1100px] mx-auto px-7">
      <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="mb-14 relative z-[1]">
        <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.08em] uppercase px-4 py-1.5 rounded-full mb-5" style={{ background: "rgba(76,175,142,0.1)", border: "1px solid rgba(76,175,142,0.25)", color: "rgba(100,220,170,0.9)" }}>
          <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: "rgba(100,220,170,0.8)" }} />
          From the classroom
        </span>
        <h2 className="font-heading italic text-[clamp(2.4rem,4.5vw,3.8rem)] text-white mb-4">
          Tested with real students.<br /><em>At a real school.</em>
        </h2>
        <p className="text-white/60 text-[1.05rem] font-light leading-[1.8] max-w-[600px]">
          Future Canvas was first deployed at Kendriya Vidyalaya No. 2, Kharagpur — across all four secondary classes, under real exam conditions, with real counsellors present.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-14 relative z-[1]">
        {/* Photo strip */}
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="col-span-2 glass rounded-[14px] overflow-hidden relative">
              <div className="aspect-video overflow-hidden">
                <img src={kv2Photo1} alt="Students at KV-2 Kharagpur classroom" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent text-white/60 text-[0.72rem] font-medium px-3 py-2.5 pt-6 tracking-[0.04em]">
                KV-2 Kharagpur · Classes 9, 10, 11 & 12
              </div>
            </div>
            <div className="glass rounded-[14px] overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={kv2Photo2} alt="Students writing the assessment at KV-2" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            <div className="glass rounded-[14px] overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={kv2Photo3} alt="Arabinda conducting session at KV-2" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats + testimonial */}
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
          <div className="grid grid-cols-2 gap-2.5 mb-3.5">
            {[
              { num: "480+", label: "Students assessed across all four classes", color: "rgba(200,185,255,0.9)" },
              { num: "4", label: "Classes tested simultaneously (9–12)", color: "rgba(100,220,170,0.9)" },
              { num: "120+", label: "Students per class", color: "rgba(255,210,120,0.9)" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-[14px] p-5 text-center">
                <div className="font-heading italic text-[2.2rem] leading-none mb-1.5" style={{ color: s.color }}>{s.num}</div>
                <div className="text-[0.72rem] text-white/40 leading-snug">{s.label}</div>
              </div>
            ))}
            <div className="glass rounded-[14px] p-5 text-center" style={{ border: "1px solid rgba(245,200,66,0.2)" }}>
              <div className="font-heading italic text-xl leading-none mb-1.5 text-gold">PM SHRI</div>
              <div className="text-[0.72rem] text-white/40 leading-snug">Government of India<br />Kendriya Vidyalayas</div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="glass-strong rounded-[20px] p-6">
            <p className="text-[0.9rem] italic font-light text-white/60 leading-[1.8] mb-5 relative pt-2">
              <span className="absolute -top-1 -left-1 font-heading text-[3rem] text-primary/25 leading-none not-italic">"</span>
              Replace this with the real quote from your KV-2 teacher coordinator once confirmed. A single honest sentence is worth more than any made-up one.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading italic text-base shrink-0" style={{ background: "rgba(124,107,202,0.2)", color: "rgba(200,185,255,0.9)" }}>T</div>
              <div>
                <div className="text-[0.85rem] font-medium text-white/90">Teacher Coordinator — name to be confirmed</div>
                <div className="text-[0.72rem] font-light text-white/40">Kendriya Vidyalaya No. 2, Kharagpur · <em style={{ color: "rgba(124,107,202,0.8)" }}>Quote pending</em></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default SocialProof;
