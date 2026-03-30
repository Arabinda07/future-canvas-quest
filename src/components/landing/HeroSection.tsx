import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const heroWords = ["Most", "students", "choose", "a", "stream.", "You", "can", "know", "yours."];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden py-28 lg:py-0 bg-background">
      {/* Glow blobs */}
      <div className="glow-blob w-[700px] h-[700px] -top-[200px] -right-[150px] z-0" style={{ background: "rgba(124,107,202,0.18)", animationDuration: "11s" }} />
      <div className="glow-blob w-[400px] h-[400px] -bottom-[100px] -left-[100px] z-0" style={{ background: "rgba(76,175,142,0.15)", animationDuration: "14s" }} />

      <div className="max-w-[1100px] mx-auto px-7 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-14 items-center">
          {/* Text */}
          <div className="relative z-[2]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-7 inline-flex items-center gap-2.5">
              <span className="bg-white text-black font-semibold text-[0.72rem] tracking-[0.1em] uppercase px-3 py-0.5 rounded-full">Free</span>
              <span className="text-white/60 text-[0.9rem]">Career Assessment · Classes 9 to 12</span>
            </motion.div>

            <h1 className="font-heading italic text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.03em] text-white mb-6">
              {heroWords.map((word, i) => (
                <span
                  key={i}
                  className="inline-block opacity-0 animate-word-in"
                  style={{
                    animationDelay: `${0.15 + i * 0.12}s`,
                    color: i >= 5 ? "rgba(200,185,255,1)" : undefined,
                  }}
                >
                  {i > 0 ? "\u00a0" : ""}{word}
                </span>
              ))}
            </h1>

            <motion.p initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }} className="text-white/60 text-[1.05rem] font-light max-w-[520px] mb-10 leading-[1.8]">
              A 60-minute psychometric assessment — grounded in three internationally validated frameworks — that maps your genuine strengths, interests, and personality to where you'll actually thrive.
            </motion.p>

            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }} className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => navigate("/register")}
                className="glass-strong inline-flex items-center gap-2 text-white font-medium text-[0.9rem] px-7 py-3.5 rounded-full hover:-translate-y-0.5 transition-transform"
              >
                Take the free assessment
                <ArrowRight size={16} />
              </button>
              <a href="#why" className="text-white/60 hover:text-white text-[0.9rem] font-medium py-3 transition-colors">
                Why this matters ↓
              </a>
            </motion.div>
          </div>

          {/* Stat pills */}
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col gap-3 relative z-[2]">
            {[
              { icon: "🧠", num: "70", label: "carefully designed\nquestions", dur: "5s", delay: "0s" },
              { icon: "⚡", num: "60 min", label: "total time,\ninstant report", dur: "6.5s", delay: "-2s" },
              { icon: "🏛️", num: "PM SHRI", label: "deployed in\nKendriya Vidyalayas", dur: "8s", delay: "-4s", numStyle: "text-xl text-[rgba(245,200,66,0.9)]" },
            ].map((s) => (
              <div key={s.num} className="glass flex items-center gap-3.5 px-5 py-4 rounded-[20px] min-w-[230px] animate-float" style={{ animationDuration: s.dur, animationDelay: s.delay }}>
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">{s.icon}</div>
                <div>
                  <div className={`font-heading italic leading-none ${s.numStyle || "text-[1.6rem] text-white"}`}>{s.num}</div>
                  <div className="text-[0.72rem] text-white/40 leading-snug mt-1 whitespace-pre-line">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
