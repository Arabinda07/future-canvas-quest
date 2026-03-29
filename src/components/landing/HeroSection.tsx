import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden py-28 lg:py-0" style={{ background: "linear-gradient(160deg, hsl(260 50% 97%), hsl(20 80% 97%) 50%, hsl(160 40% 97%) 100%)" }}>
      {/* Blobs */}
      <div className="absolute -top-44 -right-24 w-[520px] h-[520px] rounded-full bg-primary/10 blur-[60px] opacity-55 animate-float pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-[380px] h-[380px] rounded-full bg-secondary/10 blur-[60px] opacity-55 animate-float pointer-events-none" style={{ animationDirection: "reverse", animationDuration: "11s" }} />
      <div className="absolute top-[30%] right-[20%] w-60 h-60 rounded-full bg-sunshine/15 blur-[60px] opacity-40 animate-float pointer-events-none" style={{ animationDuration: "7s" }} />

      {/* Dots */}
      <div className="absolute w-2.5 h-2.5 rounded-full bg-primary opacity-25 top-[22%] left-[8%] animate-float" style={{ animationDuration: "7s" }} />
      <div className="absolute w-[7px] h-[7px] rounded-full bg-secondary opacity-35 top-[60%] left-[5%] animate-float" style={{ animationDuration: "9s" }} />
      <div className="absolute w-3 h-3 bg-sunshine opacity-30 top-[15%] right-[30%] animate-float rounded-sm rotate-[20deg]" style={{ animationDuration: "8s" }} />
      <div className="absolute w-2 h-2 rounded-full bg-peach opacity-40 bottom-[25%] right-[8%] animate-float" style={{ animationDuration: "6s" }} />

      <div className="max-w-[1080px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 text-sm font-bold text-primary mb-6 shadow-card"
            >
              <div className="w-[26px] h-[26px] rounded-full gradient-accent flex items-center justify-center">
                <Star size={12} className="text-primary-foreground" />
              </div>
              Free Career Assessment · Classes 9–12
            </motion.div>

            <motion.h1
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-heading text-[clamp(2.4rem,5vw,3.8rem)] font-bold text-foreground leading-[1.2] mb-5 tracking-tight"
            >
              Find the career
              <br />
              <span className="italic text-primary">you were made for</span>
            </motion.h1>

            <motion.p
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-base sm:text-lg max-w-[460px] mb-9 leading-relaxed"
            >
              A 60-minute science-backed assessment that maps your aptitude, interests, and personality to the stream and career paths where you'll genuinely thrive — not just what you're expected to do.
            </motion.p>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-3.5 mb-11"
            >
              <Button
                size="lg"
                className="min-h-[56px] text-base font-bold px-9 gradient-accent rounded-full gap-2 border-0 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => navigate("/register")}
              >
                Take the free assessment <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="min-h-[56px] rounded-full border-2 border-lavender-light text-primary font-bold hover:bg-lavender-light"
                onClick={() => {
                  document.getElementById("proof")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Deployed in PM SHRI Schools ↓
              </Button>
            </motion.div>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 flex-wrap"
            >
              {[
                { emoji: "🏛️", text: "PM SHRI Schools", bg: "bg-sunshine-light", special: true },
                { emoji: "🎓", text: "480+ students tested", bg: "bg-lavender-light" },
                { emoji: "📋", text: "Classes 9 · 10 · 11 · 12", bg: "bg-mint-light" },
                { emoji: "⚡", text: "Instant report", bg: "bg-sunshine-light" },
              ].map((p) => (
                <div key={p.text} className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-card ${(p as any).special ? 'bg-gradient-to-r from-sunshine-light to-[#fff3c0] border border-sunshine/40 text-sunshine-dark' : 'bg-card border border-border text-foreground'}`}>
                  <div className={`w-[22px] h-[22px] rounded-full ${p.bg} flex items-center justify-center text-xs`}>{p.emoji}</div>
                  {p.text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Photo Mosaic */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative order-first lg:order-last"
          >
            <div className="grid grid-cols-2 gap-3" style={{ gridTemplateRows: "200px 160px" }}>
              <div className="row-span-2 rounded-[20px] overflow-hidden shadow-card-hover bg-gradient-to-br from-lavender-light to-primary/10 flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm font-semibold">
                <span className="text-5xl opacity-30">📸</span>
                <span>Add your KV-2 photo</span>
                <span className="text-xs opacity-60">(students at desks)</span>
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-card-hover bg-gradient-to-br from-mint-light to-secondary/10 flex flex-col items-center justify-center gap-1 text-muted-foreground text-sm font-semibold">
                <span className="text-3xl opacity-30">📷</span>
                <span>Photo 2</span>
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-card-hover bg-gradient-to-br from-peach-light to-peach/10 flex flex-col items-center justify-center gap-1 text-muted-foreground text-sm font-semibold">
                <span className="text-3xl opacity-30">🖼</span>
                <span>Photo 3</span>
              </div>
            </div>

            {/* Floating badges */}
            <div className="hidden lg:flex absolute -left-7 bottom-10 bg-card border border-border rounded-[14px] p-3 shadow-card-hover items-center gap-2.5 animate-float z-10" style={{ animationDelay: "-2s" }}>
              <div className="w-9 h-9 rounded-[10px] bg-lavender-light flex items-center justify-center text-lg">🧠</div>
              <div>
                <div className="font-heading text-2xl font-bold text-primary leading-none">480+</div>
                <div className="text-xs font-bold text-muted-foreground leading-tight">students<br />across 4 classes</div>
              </div>
            </div>
            <div className="hidden lg:flex absolute -right-5 top-7 bg-gradient-to-br from-sunshine-light to-[#fff3c0] border border-sunshine/40 rounded-[14px] p-3 shadow-card-hover items-center gap-2.5 animate-float z-10">
              <div className="w-9 h-9 rounded-[10px] bg-sunshine-light flex items-center justify-center text-lg">🏛️</div>
              <div>
                <div className="font-heading text-base font-bold text-sunshine-dark leading-none tracking-wide">PM SHRI</div>
                <div className="text-xs font-bold text-muted-foreground leading-tight">Kendriya Vidyalayas<br />career readiness</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
