import { motion } from "framer-motion";

const cards = [
  {
    num: "1", icon: "🧮", framework: "Aptitude Testing", title: "What you can learn",
    body: "Standard marks measure what you have studied. Aptitude measures your natural capacity to learn — in quantitative, logical, and verbal domains. Two students with identical marks can have very different aptitude profiles.",
    q: '"Am I naturally stronger with numbers, patterns, or language?"',
    fwColor: "rgba(180,165,255,0.9)", qBorder: "hsl(260,40%,72%)", qBg: "rgba(124,107,202,0.07)",
  },
  {
    num: "2", icon: "🎯", framework: "RIASEC — Holland's Model", title: "What energises you",
    body: "Developed by John Holland and used in career guidance globally for 50+ years, RIASEC maps a person across six career archetypes — Realistic, Investigative, Artistic, Social, Enterprising, Conventional. Your profile reveals which work environments you'll thrive in, not just tolerate.",
    q: '"What kind of work do I find genuinely meaningful?"',
    fwColor: "rgba(100,210,170,0.9)", qBorder: "hsl(160,40%,55%)", qBg: "rgba(76,175,142,0.07)",
  },
  {
    num: "3", icon: "🧬", framework: "Big Five Personality", title: "How you actually work",
    body: "The most rigorously tested personality model in psychological science. The Big Five — Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — reveals not who you should be, but how you actually operate under real conditions: deadlines, collaboration, pressure, independence.",
    q: '"How do I work best — and where might I struggle?"',
    fwColor: "rgba(255,210,80,0.9)", qBorder: "hsl(45,90%,60%)", qBg: "rgba(245,200,66,0.07)",
  },
];

const together = [
  { label: "Aptitude", color: "rgba(180,165,255,0.9)", text: "Tells you what you", strong: "CAN do", sub: "naturally" },
  { label: "RIASEC", color: "rgba(100,210,170,0.9)", text: "Tells you what you", strong: "WANT to do", sub: "" },
  { label: "Big Five", color: "rgba(255,210,80,0.9)", text: "Tells you", strong: "HOW", sub: "you\nwork best" },
];

const WhatItTests = () => (
  <section id="how-science" className="py-24 lg:py-28 bg-background relative overflow-hidden">
    <div className="glow-blob w-[600px] h-[600px] -top-[80px] -left-[120px]" style={{ background: "rgba(76,175,142,0.15)", animationDuration: "16s" }} />

    <div className="max-w-[1100px] mx-auto px-7">
      <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center max-w-[640px] mx-auto mb-16 relative z-[1]">
        <div className="glass inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-white/80 px-4 py-1.5 rounded-full mb-5">
          <span className="w-[5px] h-[5px] rounded-full bg-white/60 shrink-0" />
          The science behind it
        </div>
        <h2 className="font-heading italic text-[clamp(2.4rem,4.5vw,3.8rem)] text-white mb-5">
          Three frameworks.<br /><em>One complete picture.</em>
        </h2>
        <p className="text-white/60 text-[1.05rem] font-light leading-[1.8]">
          Career guidance works best when it triangulates — not just what you're good at, or what you enjoy, but how those two things align with who you actually are.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 relative z-[1] mb-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.num}
            initial={{ y: 28, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-[20px] p-7 relative"
          >
            <div className="font-heading italic text-[4rem] opacity-[0.06] absolute top-3 right-5 leading-none">{c.num}</div>
            <div className="text-[1.6rem] mb-4">{c.icon}</div>
            <div className="text-[0.68rem] font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: c.fwColor }}>{c.framework}</div>
            <div className="text-[1.1rem] font-semibold text-white mb-3">{c.title}</div>
            <p className="text-[0.88rem] font-light text-white/50 leading-[1.7] mb-4">{c.body}</p>
            <div className="text-[0.85rem] italic text-white/60 p-3 rounded-[14px] border-l-2" style={{ borderColor: c.qBorder, background: c.qBg }}>
              {c.q}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Together bar */}
      <div className="glass rounded-[20px] p-6 relative z-[1]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-start">
          {together.map((t, i) => (
            <div key={t.label} className="flex flex-col items-center text-center">
              <div className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: t.color }}>{t.label}</div>
              <div className="text-[0.9rem] font-light text-white/60 leading-[1.5] whitespace-pre-line">
                {t.text}<br /><strong className="text-white/80 font-medium">{t.strong}</strong>{t.sub ? ` ${t.sub}` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhatItTests;
