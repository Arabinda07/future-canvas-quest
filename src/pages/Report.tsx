import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, FileText, ArrowRight, Star, Compass, Brain, BarChart3, Target, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const reportSections = [
  { icon: Star, letter: "A", title: "Aptitude Profile", desc: "Your cognitive strengths across numerical, verbal, abstract, and spatial reasoning." },
  { icon: Compass, letter: "B", title: "Interest Map (RIASEC)", desc: "Holland-code breakdown showing which career environments suit you best." },
  { icon: Brain, letter: "C", title: "Personality Snapshot", desc: "Big Five traits mapped to work styles and team dynamics." },
  { icon: BarChart3, letter: "D", title: "Stream Recommendation", desc: "Science / Commerce / Arts / Vocational — ranked with confidence scores." },
  { icon: Target, letter: "E", title: "Career Shortlist", desc: "Top 8–10 career paths matched to your unique profile." },
  { icon: BookOpen, letter: "F", title: "Action Plan", desc: "Subject choices, entrance exams, and next steps for Classes 11–12." },
];

const Report = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isPaid = localStorage.getItem("fc_payment_status") === "paid";

  const handlePay = async () => {
    setLoading(true);
    try {
      // Get student info from localStorage (set during registration)
      const studentName = localStorage.getItem("fc_student_name") || "Student";
      const studentEmail = localStorage.getItem("fc_student_email") || "";
      const studentPhone = localStorage.getItem("fc_student_phone") || "";

      const callbackUrl = `${window.location.origin}/payment-success`;

      const { data, error } = await supabase.functions.invoke("create-payment-link", {
        body: { studentName, studentEmail, studentPhone, callbackUrl },
      });

      if (error) throw error;

      if (data?.short_url) {
        // Redirect to Razorpay payment page
        window.location.href = data.short_url;
      } else {
        throw new Error("No payment link received");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Payment failed",
        description: "Could not create payment link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[32rem] h-[32rem] bg-[hsl(var(--lavender-glow)/0.12)] top-10 -right-20" />
        <div className="glow-blob w-[26rem] h-[26rem] bg-[hsl(var(--mint-glow)/0.1)] bottom-20 -left-16" style={{ animationDuration: "14s" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-16">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <FileText size={16} className="text-white/60" />
            <span className="text-white/60 text-sm">Your Career Report</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3rem)] leading-[0.96] mb-4">
            Your Future Canvas Report is Ready
          </h1>
          <p className="text-white/50 text-[0.95rem] leading-7 max-w-lg mx-auto">
            We've analyzed your 70 responses across three frameworks. Unlock your full personalized report below.
          </p>
        </motion.div>

        {/* Report sections — blurred preview */}
        <div className="relative">
          <div className="space-y-4">
            {reportSections.map((s, i) => (
              <motion.div
                key={s.letter}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className={`glass rounded-2xl p-5 flex items-start gap-4 ${!isPaid && i >= 2 ? "blur-[6px] select-none pointer-events-none" : ""}`}
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <s.icon size={20} className="text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[0.7rem] font-semibold tracking-widest text-white/30 uppercase">Section {s.letter}</span>
                    <span className="font-heading italic text-white/90">{s.title}</span>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed">{s.desc}</p>
                  {i < 2 && (
                    <div className="mt-3 glass rounded-xl p-3 text-sm text-white/40 italic">
                      {i === 0
                        ? "Your strongest aptitude area: Numerical Reasoning — top 22% among test takers in your class."
                        : "Primary RIASEC code: Investigative (I) — you thrive in analytical, research-oriented environments."}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Paywall overlay — only show if not paid */}
          {!isPaid && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute inset-x-0 bottom-0 top-[45%] flex flex-col items-center justify-end pb-6 bg-gradient-to-t from-background via-background/95 to-transparent"
            >
              <div className="glass-strong rounded-2xl p-8 text-center max-w-sm w-full mx-auto">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Lock size={24} className="text-white/60" />
                </div>
                <h3 className="font-heading italic text-xl text-white/90 mb-2">Unlock Full Report</h3>
                <p className="text-white/45 text-sm leading-relaxed mb-6">
                  Get your complete 6-section career report with personalized insights, stream recommendations, and an actionable plan.
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-heading italic text-white">{"\u20B9"}99</span>
                  <span className="text-white/40 text-sm ml-1">one-time</span>
                </div>
                <Button
                  size="lg"
                  className="w-full min-h-[52px] text-base font-semibold rounded-full gradient-accent text-primary-foreground border-0 gap-2 shadow-lg hover:opacity-95"
                  onClick={handlePay}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating payment link…
                    </>
                  ) : (
                    <>
                      Pay & Unlock Report <ArrowRight size={16} />
                    </>
                  )}
                </Button>
                <p className="text-white/30 text-xs mt-3">Secure payment via Razorpay · Instant access</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-12">
          <Button
            variant="ghost"
            className="text-white/40 rounded-full gap-2 hover:text-white/70 hover:bg-white/[0.05]"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Report;
