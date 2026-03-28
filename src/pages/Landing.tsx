import { useNavigate } from "react-router-dom";
import { Brain, Zap, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  { icon: Brain, title: "70 Questions", desc: "Aptitude, RIASEC & Personality — all in one sitting.", color: "from-teal to-teal-dark" },
  { icon: Zap, title: "Instant AI Report", desc: "Personalized career paths generated in seconds.", color: "from-teal-dark to-primary" },
  { icon: ShieldCheck, title: "100% Private", desc: "Your data is never shared with third parties.", color: "from-primary to-navy-light" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Nav */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-5 py-4 flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Sparkles size={16} className="text-accent-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground">NextStep</span>
        </div>
        <Button variant="outline" size="sm" className="rounded-full border-border" onClick={() => navigate("/register")}>
          Get Started
        </Button>
      </motion.header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center max-w-xl mx-auto relative">
        {/* Background orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-primary/8 blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full glass border border-border px-4 py-2 text-sm font-medium text-foreground mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full gradient-accent animate-pulse" />
          Psychometric Career Assessment
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground leading-[1.1] mb-5"
        >
          Discover Your{" "}
          <span className="text-gradient">True Potential</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-base sm:text-lg mb-10 leading-relaxed max-w-md"
        >
          A scientifically backed assessment combining Aptitude, RIASEC, and Personality traits — built for high school students.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full sm:w-auto"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto min-h-[56px] text-base font-bold px-10 gradient-accent glow-teal rounded-full gap-2 border-0 text-accent-foreground"
            onClick={() => navigate("/register")}
          >
            Start Free Assessment <ArrowRight size={18} />
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-muted-foreground mt-4"
        >
          No signup required • Takes ~15 minutes
        </motion.p>
      </main>

      {/* Features */}
      <section className="px-5 pb-12 pt-6 max-w-xl mx-auto w-full">
        <div className="grid gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="group flex items-start gap-4 rounded-2xl bg-card p-5 shadow-card border border-border hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className={`rounded-xl bg-gradient-to-br ${f.color} p-3 shrink-0 group-hover:animate-float`}>
                <f.icon size={20} className="text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-[15px]">{f.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
