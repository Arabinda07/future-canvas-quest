import { useNavigate } from "react-router-dom";
import { Brain, Zap, ShieldCheck, ArrowRight, Sparkles, CheckCircle, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroDashboard from "@/assets/hero-dashboard.png";

const features = [
  { icon: Brain, title: "70 Questions", desc: "Aptitude, RIASEC & Personality — all in one sitting.", color: "bg-lavender-light text-primary" },
  { icon: Zap, title: "Instant AI Report", desc: "Personalized career paths generated in seconds.", color: "bg-mint-light text-mint-dark" },
  { icon: ShieldCheck, title: "100% Private", desc: "Your data is never shared with third parties.", color: "bg-peach-light text-foreground" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden gradient-hero">
      {/* Nav */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 py-4 flex items-center justify-between relative z-10 max-w-6xl mx-auto w-full"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
            <Sparkles size={16} className="text-accent-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground">NextStep</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-primary/30 bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => navigate("/register")}
        >
          Get Started
        </Button>
      </motion.header>

      {/* Hero Section - Two Column */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 gap-8 lg:gap-12 max-w-6xl mx-auto w-full py-12 lg:py-0">
        {/* Left - Text */}
        <div className="flex-1 text-center lg:text-left max-w-xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur-sm border border-border px-4 py-2 text-sm font-medium text-foreground mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full gradient-accent animate-pulse" />
            Psychometric Career Assessment
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-5"
          >
            Discover Your{" "}
            <span className="text-gradient">True Potential</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0"
          >
            A scientifically backed assessment combining Aptitude, RIASEC, and Personality traits — built for high school students.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto min-h-[56px] text-base font-bold px-10 gradient-cta rounded-full gap-2 border-0 text-foreground shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => navigate("/register")}
            >
              Start Free Assessment <ArrowRight size={18} />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 mt-4 text-sm text-muted-foreground justify-center lg:justify-start"
          >
            <CheckCircle size={14} className="text-secondary" />
            No signup required • Takes ~15 minutes
          </motion.div>
        </div>

        {/* Right - Hero Image */}
        <motion.div
          initial={{ x: 40, opacity: 0, rotateY: -5 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex-1 flex items-center justify-center lg:justify-end max-w-lg lg:max-w-xl relative"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-lavender-light blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-mint-light blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-32 h-32 rounded-full bg-peach-light blur-2xl opacity-40 pointer-events-none" />

          <img
            src={heroDashboard}
            alt="NextStep Career Assessment Dashboard Preview"
            width={1024}
            height={768}
            className="relative z-10 w-full h-auto drop-shadow-2xl"
          />
        </motion.div>
      </main>

      {/* Features */}
      <section className="px-6 pb-16 pt-8 max-w-6xl mx-auto w-full">
        <div className="grid sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="group flex items-start gap-4 rounded-2xl bg-card/80 backdrop-blur-sm p-5 shadow-card border border-border hover:shadow-card-hover transition-all duration-300"
            >
              <div className={`rounded-xl ${f.color} p-3 shrink-0 group-hover:scale-110 transition-transform`}>
                <f.icon size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-[15px]">{f.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Bar */}
      <section className="px-6 pb-12 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card"
        >
          <div>
            <h2 className="font-heading font-bold text-foreground text-lg">Have an access code?</h2>
            <p className="text-muted-foreground text-sm">Enter your school or counselor code to get started.</p>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[48px] px-8 font-semibold"
            onClick={() => navigate("/register")}
          >
            Enter Code & Start
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
