import { useNavigate } from "react-router-dom";
import { Brain, Zap, ShieldCheck, ArrowRight, Sparkles, CheckCircle, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

      {/* Testimonials */}
      <section className="px-6 pb-16 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-8"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            What Students Say
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Trusted by thousands of students across India
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              name: "Ananya R.",
              class: "Class XII",
              text: "This assessment helped me realize I'm suited for design, not engineering. My parents were surprised but supportive once they saw the detailed report!",
              color: "bg-lavender-light",
            },
            {
              name: "Karthik M.",
              class: "Class X",
              text: "I loved how quick it was. The RIASEC section really opened my eyes to career paths I'd never considered before. Highly recommend!",
              color: "bg-mint-light",
            },
            {
              name: "Priya S.",
              class: "Class XI",
              text: "Our school counselor used NextStep for our entire batch. The personalized reports were incredibly accurate and easy to understand.",
              color: "bg-peach-light",
            },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.75 + i * 0.1 }}
              className="rounded-2xl bg-card/80 backdrop-blur-sm p-6 shadow-card border border-border flex flex-col"
            >
              <Quote size={20} className="text-primary/30 mb-3" />
              <p className="text-foreground text-sm leading-relaxed flex-1">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-heading font-bold text-sm text-foreground`}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.class}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={12} className="fill-sunshine text-sunshine" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          {[
            { stat: "12,000+", label: "Assessments Taken" },
            { stat: "4.8/5", label: "Average Rating" },
            { stat: "150+", label: "Schools Onboarded" },
          ].map((s) => (
            <div key={s.label} className="text-center rounded-2xl bg-card/60 backdrop-blur-sm border border-border p-5">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">{s.stat}</p>
              <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-16 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mb-8"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.95 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "How long does the assessment take?", a: "The full assessment has 70 questions and typically takes 12–18 minutes to complete. You can pause and resume anytime — your progress is auto-saved." },
              { q: "Is this assessment scientifically validated?", a: "Yes. The assessment combines three proven frameworks: cognitive aptitude testing, Holland's RIASEC interest model, and Big Five personality traits — all widely used in career counseling." },
              { q: "Do I need to create an account?", a: "No signup or account is required. Just enter your first name and class to get started. An email is optional and only used to send a backup of your report." },
              { q: "How is my data protected?", a: "Your responses are processed locally and never shared with third parties. We only use your data to generate your personalized career report." },
              { q: "Can schools or counselors use this?", a: "Absolutely! Schools and counselors can get a unique code to distribute to students. This allows batch administration and aggregated (anonymous) insights." },
              { q: "What does the career report include?", a: "Your report includes your aptitude strengths, RIASEC profile, personality insights, and AI-generated career path recommendations tailored to your unique combination of traits." },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border px-5 shadow-sm data-[state=open]:shadow-card"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
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

      {/* Footer */}
      <footer className="border-t border-border bg-card/40 backdrop-blur-sm mt-4">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
            {/* Brand */}
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                  <Sparkles size={14} className="text-accent-foreground" />
                </div>
                <span className="font-heading text-lg font-bold text-foreground">NextStep</span>
              </div>
              <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
                AI-powered psychometric career assessment for high school students.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-10 text-sm">
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-foreground text-xs uppercase tracking-wider">Legal</h4>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              </div>
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-foreground text-xs uppercase tracking-wider">Contact</h4>
                <a href="mailto:hello@nextstep.app" className="block text-muted-foreground hover:text-foreground transition-colors">hello@nextstep.app</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Support</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} NextStep Career Canvas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
