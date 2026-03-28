import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const steps = [
  { num: 1, title: "Enter your details", desc: "Name, class, section, roll number. That's all. No sign-up, no email required." },
  { num: 2, title: "Attempt Section A", desc: "20 aptitude MCQs. 60-minute timer. No negative marking. Answer at your own pace." },
  { num: 3, title: "Complete Section B", desc: "50 statements about your interests and personality. No right or wrong answers. Just be honest." },
  { num: 4, title: "Get your report", desc: "Instant, personalised report. Stream recommendation, career pathways, personality insights, and a concrete action plan." },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section id="how" className="py-20 lg:py-24">
      <div className="max-w-[1080px] mx-auto px-6">
        <motion.div initial={{ y: 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-primary bg-lavender-light px-3.5 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Simple to start
          </div>
          <h2 className="font-heading text-[clamp(1.8rem,3.2vw,2.6rem)] font-bold text-foreground mb-3.5">
            Four steps to your
            <br />
            <span className="italic text-primary">personalised report</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-[540px] mx-auto">
            Works on any phone, tablet, or computer. No app download needed.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-[38px] left-[12.5%] right-[12.5%] h-[2px]" style={{ background: "repeating-linear-gradient(90deg, hsl(var(--lavender-light)) 0, hsl(var(--lavender-light)) 8px, transparent 8px, transparent 16px)" }} />

          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ y: 28, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center px-3 py-5 relative z-10 group"
            >
              <div className="w-[60px] h-[60px] rounded-full bg-card border-[2.5px] border-lavender-light shadow-[0_0_0_6px_hsl(var(--lavender-light))] flex items-center justify-center mx-auto mb-5 font-heading text-xl text-primary font-bold transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_0_6px_hsl(var(--lavender-light)),0_4px_18px_hsl(var(--primary)/0.35)]">
                {s.num}
              </div>
              <h3 className="font-extrabold text-foreground text-sm mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-center mt-14">
          <Button
            size="lg"
            className="min-h-[56px] text-base font-bold px-10 gradient-accent rounded-full gap-2 border-0 text-primary-foreground shadow-lg"
            onClick={() => navigate("/register")}
          >
            Start the free assessment <ArrowRight size={16} />
          </Button>
          <p className="text-muted-foreground text-xs mt-3">Takes 60–75 minutes · Works on mobile · Completely free</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
