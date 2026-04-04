import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    const verify = async () => {
      try {
        const razorpayPaymentId = searchParams.get("razorpay_payment_id");
        const razorpayPaymentLinkId = searchParams.get("razorpay_payment_link_id");
        const razorpayPaymentLinkStatus = searchParams.get("razorpay_payment_link_status");

        const assessmentId = localStorage.getItem("fc_assessment_id");

        if (!assessmentId) {
          setStatus("error");
          return;
        }

        if (razorpayPaymentLinkStatus === "paid" && razorpayPaymentId) {
          // Update assessment with payment info
          const { error } = await supabase
            .from("assessments")
            .update({
              payment_status: "paid",
              payment_id: razorpayPaymentId,
              razorpay_payment_link_id: razorpayPaymentLinkId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", assessmentId);

          if (error) throw error;

          localStorage.setItem("fc_payment_status", "paid");
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-clip flex flex-col items-center justify-center px-5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[28rem] h-[28rem] bg-[hsl(var(--mint-glow)/0.12)] top-20 -right-16" />
        <div className="glow-blob w-[24rem] h-[24rem] bg-[hsl(var(--lavender-glow)/0.1)] bottom-20 -left-16" style={{ animationDuration: "14s" }} />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        {status === "verifying" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Loader2 size={56} className="animate-spin text-white/40 mx-auto" />
            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] leading-[1]">Verifying payment…</h1>
            <p className="text-white/50 text-sm">Please wait while we confirm your payment.</p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
            <div className="w-28 h-28 rounded-full bg-[hsl(var(--mint)/0.12)] border border-[hsl(var(--mint)/0.2)] flex items-center justify-center mx-auto">
              <CheckCircle2 size={56} className="text-[hsl(var(--mint))]" />
            </div>
            <h1 className="text-[clamp(1.8rem,5vw,3rem)] leading-[0.96]">Payment Successful!</h1>
            <p className="text-white/55 text-[0.95rem] leading-7">
              Your full Future Canvas Career Report is now unlocked. View your personalized results below.
            </p>
            <Button
              size="lg"
              className="w-full min-h-[56px] text-base font-semibold rounded-full gradient-accent text-primary-foreground border-0 gap-2 shadow-lg hover:opacity-95"
              onClick={() => navigate("/report")}
            >
              View Your Report
            </Button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
            <div className="w-28 h-28 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <XCircle size={56} className="text-red-400" />
            </div>
            <h1 className="text-[clamp(1.8rem,5vw,3rem)] leading-[0.96]">Payment Issue</h1>
            <p className="text-white/55 text-[0.95rem] leading-7">
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full min-h-[52px] rounded-full gradient-accent text-primary-foreground border-0 hover:opacity-95"
                onClick={() => navigate("/report")}
              >
                Try Again
              </Button>
              <Button
                variant="ghost"
                className="text-white/40 rounded-full gap-2 hover:text-white/70 hover:bg-white/[0.05]"
                onClick={() => navigate("/")}
              >
                ← Back to Home
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
