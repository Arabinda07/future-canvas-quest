import { motion } from "framer-motion";

const sections = [
  { letter: "A", title: "Profile at a Glance", desc: "Your core aptitudes, primary interest type, dominant personality trait, and stream recommendation — all in one page.", tag: "Summary" },
  { letter: "B", title: "Aptitude Deep Dive", desc: "Numerical, Logical, and Verbal scores with visual bars and personalised, school-relevant interpretations for each.", tag: "Score-based" },
  { letter: "C", title: "Interests & Personality", desc: "Your full RIASEC archetype with activities. Big Five traits explained in language a 15-year-old will actually understand.", tag: "Profile-based" },
  { letter: "D", title: "Your Action Plan", desc: "Subject choices, CBSE project ideas, olympiad targets — all tailored to your class and recommended stream.", tag: "Actionable" },
  { letter: "E", title: "Career Pathways", desc: "5–10 specific career options matched to your top interests, grounded in the reality of the Indian job market.", tag: "India-specific" },
  { letter: "F", title: "Guidance Notes", desc: "Personalised flags — like low conscientiousness or high neuroticism — with targeted, kind, actionable advice for each.", tag: "Counsellor-ready" },
];

const ReportSections = () => (
  <section id="report" className="py-20 lg:py-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(250 30% 15%) 0%, hsl(250 20% 23%) 60%, hsl(220 30% 15%) 100%)" }}>
    {/* Blobs */}
    <div className="absolute -top-24 -right-20 w-[400px] h-[400px] rounded-full bg-primary/15 blur-[60px] pointer-events-none" />
    <div className="absolute -bottom-20 -left-16 w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[60px] pointer-events-none" />

    <div className="max-w-[1080px] mx-auto px-6 relative z-10">
      <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-sunshine bg-sunshine/15 px-3.5 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-sunshine" />
          What you get
        </div>
        <h2 className="font-heading text-[clamp(1.8rem,3.2vw,2.6rem)] font-bold text-white mb-3.5">
          Your report has
          <br />
          <em className="italic text-sunshine">six sections</em>
        </h2>
        <p className="text-white/55 text-base max-w-[540px] mx-auto">
          Not a generic output. A personalised document that a student, parent, and counsellor can all read and act on.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sections.map((s, i) => (
          <motion.div
            key={s.letter}
            initial={{ y: 28, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.1 }}
            className="bg-white/[0.07] border border-white/[0.12] rounded-2xl p-5 hover:bg-white/[0.12] hover:border-sunshine/40 transition-all duration-300"
          >
            <div className="font-heading text-[2rem] font-bold text-sunshine leading-none mb-2.5">{s.letter}</div>
            <h3 className="font-extrabold text-white text-sm mb-1.5">{s.title}</h3>
            <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
            <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-sunshine/[0.18] text-sunshine text-[0.68rem] font-extrabold uppercase tracking-wide">{s.tag}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ReportSections;
