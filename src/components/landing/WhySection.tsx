import { motion } from "framer-motion";

const stats = [
  { num: "93%", label: "of students say peer or parental influence was the primary factor in their stream choice", src: "CBSE Career Survey, 2022", accent: "lav" },
  { num: "1 in 3", label: "Class 12 students would choose a different stream if they could start over", src: "ASER Report, India", accent: "peach" },
  { num: "7 min", label: "average time a school counsellor spends on career guidance per student per year", src: "NCERT Counsellor Study, 2021", accent: "mint" },
];

const accentColors: Record<string, { border: string; numColor: string }> = {
  lav: { border: "rgba(124,107,202,0.4)", numColor: "rgba(200,185,255,1)" },
  peach: { border: "rgba(240,124,90,0.4)", numColor: "rgba(255,170,140,1)" },
  mint: { border: "rgba(76,175,142,0.4)", numColor: "rgba(100,220,180,1)" },
};

const WhySection = () => (
  <section id="why" className="py-24 lg:py-28 relative overflow-hidden" style={{ background: "#0a0a0a" }}>
    <div className="glow-blob w-[500px] h-[500px] -top-[100px] -right-[100px]" style={{ background: "rgba(240,124,90,0.14)", animationDuration: "13s" }} />

    <div className="max-w-[1100px] mx-auto px-7">
      <div className="grid lg:grid-cols-2 gap-20 items-start relative z-[1]">
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
          <div className="glass inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-white/80 px-4 py-1.5 rounded-full mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-white/60 shrink-0" />
            The real problem
          </div>
          <h2 className="font-heading italic text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[0.92] tracking-[-0.03em] text-white mb-5">
            Career decisions are being made on the wrong evidence.
          </h2>
          <p className="text-white/60 text-[1.05rem] font-light leading-[1.8] mb-4">
            In India, stream selection at Class 10 is treated as the first major life decision. In practice, it's made in the least informed way possible — based on marks, parental expectation, or what a classmate chose.
          </p>
          <p className="text-white/60 text-[1.05rem] font-light leading-[1.8] mb-7">
            The result isn't just a wrong subject choice. It's a student who spends years studying something misaligned with who they actually are — arriving at college, or a job, without ever understanding their own strengths.
          </p>
          <div className="glass rounded-[14px] border-l-2 border-l-primary p-5">
            <p className="font-heading italic text-[1.1rem] text-white/80 leading-[1.65]">
              "The question isn't which stream is best. It's which stream is best <em>for this specific student.</em> That requires knowing the student — not just their marks."
            </p>
          </div>
        </motion.div>

        <div className="grid gap-3.5">
          {stats.map((s, i) => {
            const a = accentColors[s.accent];
            return (
              <motion.div
                key={s.num}
                initial={{ y: 28, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[20px] p-6"
                style={{ borderTop: `1.5px solid ${a.border}` }}
              >
                <div className="font-heading italic text-[3.2rem] leading-none mb-2" style={{ color: a.numColor }}>{s.num}</div>
                <div className="text-white/60 text-[0.9rem] leading-[1.5] mb-1.5">{s.label}</div>
                <div className="text-white/30 text-[0.72rem]">{s.src}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default WhySection;
