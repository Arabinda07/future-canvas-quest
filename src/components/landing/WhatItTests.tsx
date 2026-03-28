import { motion } from "framer-motion";

const pillars = [
  {
    type: "aptitude" as const,
    icon: "🧮",
    title: "Aptitude Testing",
    desc: "20 MCQs across Quantitative, Logical, and Verbal Reasoning. Measures your natural academic strengths — the kind that don't show up on a report card.",
    tags: ["Numerical", "Logical", "Verbal"],
    tagStyle: "bg-lavender-light text-lavender-dark",
    cardBg: "bg-gradient-to-br from-lavender-light to-primary/5",
    borderColor: "border-lavender-light",
  },
  {
    type: "riasec" as const,
    icon: "🎯",
    title: "RIASEC Interest Explorer",
    desc: "Holland's RIASEC model — the most widely used career interest framework in the world — maps what kind of work environments genuinely energise you.",
    tags: ["Realistic", "Investigative", "Artistic", "+ 3 more"],
    tagStyle: "bg-mint-light text-mint-dark",
    cardBg: "bg-gradient-to-br from-mint-light to-secondary/5",
    borderColor: "border-mint-light",
  },
  {
    type: "personality" as const,
    icon: "🧬",
    title: "Big Five Personality",
    desc: "The gold standard in personality science. Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — not labels, but a mirror of how you actually work.",
    tags: ["Openness", "Conscientiousness", "+ 3 more"],
    tagStyle: "bg-peach-light text-foreground",
    cardBg: "bg-gradient-to-br from-peach-light to-peach/5",
    borderColor: "border-peach-light",
  },
];

const WhatItTests = () => (
  <section id="what" className="py-20 lg:py-24 bg-card border-t border-border">
    <div className="max-w-[1080px] mx-auto px-6">
      <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-primary bg-lavender-light px-3.5 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Three lenses, one clear direction
        </div>
        <h2 className="font-heading text-[clamp(1.8rem,3.2vw,2.6rem)] font-bold text-foreground mb-3.5">
          It's not just a quiz.
          <br />
          <span className="italic text-primary">It's a full profile.</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-[540px] mx-auto">
          Most career tests ask you what you like. Future Canvas asks who you <em>are</em> — combining three internationally validated frameworks into one 70-question assessment.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-5">
        {pillars.map((p, i) => (
          <motion.div
            key={p.type}
            initial={{ y: 28, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-3xl border-[1.5px] ${p.borderColor} ${p.cardBg} p-7 hover:-translate-y-1.5 hover:shadow-card-hover transition-all duration-300`}
          >
            <span className="absolute top-4 right-5 font-heading text-[3.5rem] font-bold opacity-[0.08] leading-none">{i + 1}</span>
            <div className="w-[52px] h-[52px] rounded-[14px] bg-primary/10 flex items-center justify-center text-2xl mb-5">{p.icon}</div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-2">{p.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className={`inline-block px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide ${p.tagStyle}`}>{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatItTests;
