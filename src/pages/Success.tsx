import { useNavigate } from "react-router-dom";
import { CheckCircle2, Download, RotateCcw, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Success = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    toast({ title: "Report generating…", description: "Your career report PDF will be ready shortly. This is a demo." });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center max-w-md mx-auto relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 right-0 w-64 h-64 rounded-full bg-teal/10 blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-56 h-56 rounded-full bg-success/10 blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <div className="w-28 h-28 rounded-full bg-teal-light flex items-center justify-center glow-teal">
          <CheckCircle2 size={56} className="text-success" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full gradient-accent flex items-center justify-center shadow-lg"
        >
          <PartyPopper size={18} className="text-accent-foreground" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-3xl font-extrabold text-foreground mb-3"
      >
        Assessment Complete!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-10 leading-relaxed"
      >
        Your personalized NextStep Career Report is being generated with AI-powered insights.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full space-y-3"
      >
        <Button
          size="lg"
          className="w-full min-h-[56px] text-base font-bold rounded-full gradient-accent glow-teal border-0 text-accent-foreground gap-2"
          onClick={handleDownload}
        >
          <Download size={18} /> Download Career Report (PDF)
        </Button>
        <Button variant="ghost" className="min-h-[48px] text-muted-foreground rounded-full gap-2" onClick={() => navigate("/")}>
          <RotateCcw size={16} /> Start Over
        </Button>
      </motion.div>
    </div>
  );
};

export default Success;
