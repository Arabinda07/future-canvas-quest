import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const specs = [
  { icon: "📋", label: "Section A", val: "20 MCQs — Quantitative, Logical & Verbal Reasoning · 60 minutes · No negative marking" },
  { icon: "🧭", label: "Section B", val: "50 statements — RIASEC interests & Big Five personality · No time limit · No right or wrong answers" },
  { icon: "⚡", label: "Report", val: "Generated instantly · Personalised to your class & answers · Printable PDF" },
  { icon: "💰", label: "Cost", val: "Rs 99/- per student · Instant report" },
];

const reportItems = [
  { letter: "A", title: "Profile at a Glance", desc: "Core aptitudes, dominant interest type, key personality trait, and stream recommendation — one summary page." },
  { letter: "B", title: "Aptitude Deep Dive", desc: "Numerical, Logical, and Verbal scores with visual bars and school-relevant interpretation for each." },
  { letter: "C", title: "Interests & Personality", desc: "Your RIASEC archetype with activities, and Big Five traits in plain language — not jargon." },
  { letter: "D", title: "Action Plan", desc: "Subject choices, CBSE project ideas, and olympiad targets — tailored to your specific class and stream." },
  { letter: "E", title: "Career Pathways", desc: "5–10 career options matched to your interests, grounded in the Indian job market — not generic lists." },
  { letter: "F", title: "Guidance Notes", desc: "Personalised counsellor flags with kind, targeted advice — readable by student, parent, and counsellor alike." },
];

const ReportSections = () => {
  const navigate = useNavigate();

  return (
    <section id="what" className="py-24 lg:py-28 relative overflow-hidden" style={{ background: "#0a0a0a" }}>
      <div className="glow-blob w-[500px] h-[500px] -bottom-[100px] -right-[100px]" style={{ background: "rgba(124,107,202,0.18)", animationDuration: "12s" }} />

      <div className="max-w-[1100px] mx-auto px-7">
        <div className="grid lg:grid-cols-2 gap-[72px] items-start relative z-[1]">
          {/* Left: specs */}
          <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <div className="glass inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-white/80 px-4 py-1.5 rounded-full mb-5">
              <span className="w-[5px] h-[5px] rounded-full bg-white/60 shrink-0" />
              The assessment
            </div>
            <h2 className="font-heading italic text-[clamp(2.4rem,4.5vw,3.8rem)] text-white mb-5">
              Future Canvas:<br /><em>what the test looks like</em>
            </h2>
            <p className="text-white/60 text-[0.95rem] font-light leading-[1.8] mb-8">
              70 carefully designed questions. Two sections. One personalised report. Works on any phone, tablet, or computer — no app needed.
            </p>

            <div className="grid gap-2.5 mb-8">
              {specs.map((s) => (
                <div key={s.label} className="glass flex items-center gap-3.5 p-4 rounded-[14px]">
                  <div className="w-10 h-10 rounded-[10px] bg-white/5 flex items-center justify-center text-[1.1rem] shrink-0">{s.icon}</div>
                  <div>
                    <div className="text-[0.68rem] font-semibold tracking-[0.08em] uppercase text-white/40 mb-0.5">{s.label}</div>
                    <div className="text-[0.92rem] text-white/80 leading-[1.5]">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/register")}
              className="glass-strong inline-flex items-center gap-2 text-white font-medium text-[0.9rem] px-7 py-3.5 rounded-full hover:-translate-y-0.5 transition-transform"
            >
              Start the free assessment →
            </button>
          </motion.div>

          {/* Right: report sections */}
          <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.08em] uppercase px-4 py-1.5 rounded-full" style={{ background: "rgba(124,107,202,0.12)", border: "1px solid rgba(124,107,202,0.25)", color: "rgba(200,185,255,0.9)" }}>
                <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: "rgba(200,185,255,0.8)" }} />
                What your report contains
              </span>
            </div>
            <div className="grid gap-2">
              {reportItems.map((r) => (
                <div key={r.letter} className="glass flex gap-3.5 p-4 rounded-[14px] hover:bg-white/5 transition-colors cursor-default">
                  <div className="font-heading italic text-xl text-primary w-6 shrink-0 leading-[1.4]">{r.letter}</div>
                  <div>
                    <div className="text-[0.9rem] font-medium text-white/90 mb-0.5">{r.title}</div>
                    <div className="text-[0.78rem] font-light text-white/40 leading-[1.5]">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReportSections;
