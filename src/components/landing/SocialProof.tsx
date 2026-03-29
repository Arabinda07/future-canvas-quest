import { motion } from "framer-motion";

const SocialProof = () => (
  <section id="proof" className="py-20 lg:py-24 bg-card">
    <div className="max-w-[1080px] mx-auto px-6">
      <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
        {/* Provenance tag */}
        <div className="inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-sunshine bg-gradient-to-r from-navy to-navy-mid border border-sunshine/30 rounded-full px-4 py-1.5 mb-5" style={{ background: "linear-gradient(135deg, hsl(250 30% 15%), hsl(250 20% 23%))" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-sunshine shrink-0" />
          Deployed in PM SHRI Schools · Government of India
        </div>

        {/* Hierarchy chain */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-4 text-sm font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunshine-light border-[1.5px] border-sunshine/50 text-sunshine-dark">🏛️ PM SHRI Program · NEP 2020</span>
          <span className="text-border">↓</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border-[1.5px] border-lavender-light text-lavender-dark">🏫 Kendriya Vidyalayas</span>
          <span className="text-border">↓</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border-[1.5px] border-border">📍 KV-2 Kharagpur</span>
        </div>

        <h2 className="font-heading text-[clamp(1.8rem,3.2vw,2.6rem)] font-bold text-foreground mb-3.5">
          Tested in real classrooms.
          <br />
          <span className="italic text-primary">Not in a lab.</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-[600px] mx-auto">
          Future Canvas was deployed as part of PM SHRI career readiness programs at Kendriya Vidyalayas — a Government of India initiative under NEP 2020. The first deployment was at KV-2 Kharagpur, across all four secondary classes.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-14 items-start">
        {/* Photo strip */}
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-2xl overflow-hidden shadow-card-hover relative">
            <div className="aspect-video bg-gradient-to-br from-lavender-light to-primary/10 flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm font-bold">
              <span className="text-4xl opacity-30">📸</span>
              <span>Your wide classroom photo here</span>
              <span className="text-xs opacity-50 font-normal">(e.g. students at desks, exam hall view)</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/75 to-transparent text-primary-foreground text-xs font-bold px-3 py-2.5 pt-6">
              PM SHRI · KV-2 Kharagpur · Classes 9–12
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card-hover">
            <div className="aspect-[4/5] bg-gradient-to-br from-mint-light to-secondary/10 flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm font-bold">
              <span className="text-3xl opacity-30">🖼</span>
              <span>Photo 2</span>
              <span className="text-xs opacity-50 font-normal">students engaged</span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card-hover">
            <div className="aspect-[4/5] bg-gradient-to-br from-peach-light to-peach/10 flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm font-bold">
              <span className="text-3xl opacity-30">📷</span>
              <span>Photo 3</span>
              <span className="text-xs opacity-50 font-normal">counsellor session</span>
            </div>
          </div>
        </motion.div>

        {/* Stats + testimonial */}
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <div className="grid grid-cols-2 gap-3.5 mb-7">
            {[
              { num: "480+", label: "Total students assessed", bg: "bg-lavender-light", color: "text-lavender-dark" },
              { num: "4", label: "Classes tested\n(9, 10, 11 & 12)", bg: "bg-mint-light", color: "text-mint-dark" },
              { num: "120+", label: "Students per class", bg: "bg-sunshine-light", color: "text-sunshine-dark" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-5 text-center`}>
                <div className={`font-heading text-[2rem] font-bold leading-none mb-1 ${s.color}`}>{s.num}</div>
                <div className="text-xs font-bold text-muted-foreground leading-tight whitespace-pre-line">{s.label}</div>
              </div>
            ))}
            {/* PM SHRI stat box */}
            <div className="rounded-2xl p-5 text-center border-[1.5px] border-sunshine/30" style={{ background: "linear-gradient(160deg, hsl(250 30% 15%), hsl(250 20% 23%))" }}>
              <div className="font-heading text-lg font-bold leading-none mb-1 text-sunshine tracking-wide">PM SHRI</div>
              <div className="text-xs font-bold text-white/55 leading-tight">Govt of India · NEP 2020<br />Kendriya Vidyalayas</div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-gradient-to-br from-lavender-light to-primary/5 border-[1.5px] border-lavender-light rounded-3xl p-6">
            <p className="font-heading text-base italic text-muted-foreground leading-relaxed mb-5 relative pl-2">
              <span className="absolute -top-3 -left-2 font-heading text-[3.5rem] text-primary/25 leading-none not-italic">"</span>
              The students found it genuinely relevant — many came back with follow-up questions about their results. It gave us a scientific basis for career conversations we were previously having only on intuition.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full gradient-accent flex items-center justify-center font-heading text-lg text-primary-foreground font-bold shrink-0">T</div>
              <div>
                <div className="font-extrabold text-foreground text-sm">Teacher Coordinator</div>
                <div className="text-xs text-muted-foreground">Kendriya Vidyalaya No. 2, Kharagpur · <em className="text-primary">Testimonial pending confirmation</em></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default SocialProof;
