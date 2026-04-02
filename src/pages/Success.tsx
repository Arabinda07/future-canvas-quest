import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-x-clip flex flex-col items-center justify-center px-5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[28rem] h-[28rem] bg-[hsl(var(--mint-glow)/0.12)] top-20 -right-16" />
        <div className="glow-blob w-[24rem] h-[24rem] bg-[hsl(var(--lavender-glow)/0.1)] bottom-20 -left-16" style={{ animationDuration: "14s" }} />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mb-8 inline-block"
        >
          <div className="w-28 h-28 rounded-full bg-[hsl(var(--mint)/0.12)] border border-[hsl(var(--mint)/0.2)] flex items-center justify-center">
            <CheckCircle2 size={56} className="text-[hsl(var(--mint))]" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -top-2 -right-2 w-10 h-10 rounded-full gradient-accent flex items-center justify-center shadow-lg"
          >
            <PartyPopper size={18} className="text-primary-foreground" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[clamp(2rem,6vw,3.5rem)] leading-[0.96] mb-4"
        >
          Assessment Complete!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/55 text-[0.95rem] leading-7 mb-10"
        >
          Great job finishing all 70 questions! Your personalized Future Canvas Career Report is ready to view.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-3"
        >
          <Button
            size="lg"
            className="w-full min-h-[56px] text-base font-semibold rounded-full gradient-accent text-primary-foreground border-0 gap-2 shadow-lg hover:opacity-95"
            onClick={() => navigate("/report")}
          >
            View Your Report <ArrowRight size={18} />
          </Button>
          <Button
            variant="ghost"
            className="min-h-[48px] text-white/50 rounded-full gap-2 hover:text-white/80 hover:bg-white/[0.05]"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;
