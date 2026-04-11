import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { buildStudentReportPath, verifyReportPaymentUnlock } from "@/lib/backend/assessmentGateway";

type PaymentStatus = "verifying" | "success" | "error";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("verifying");
  const [reportPath, setReportPath] = useState<string>("/");

  useEffect(() => {
    const verify = async () => {
      const reportId = searchParams.get("reportId")?.trim() ?? "";
      const reportAccessToken = searchParams.get("token")?.trim() ?? "";
      const razorpayPaymentId = searchParams.get("razorpay_payment_id")?.trim() ?? "";
      const razorpayPaymentLinkId = searchParams.get("razorpay_payment_link_id")?.trim() ?? "";
      const razorpayPaymentLinkStatus = searchParams.get("razorpay_payment_link_status")?.trim() ?? "";
      const nextReportPath = buildStudentReportPath(reportId, reportAccessToken);

      setReportPath(nextReportPath);

      try {
        await verifyReportPaymentUnlock({
          reportId,
          reportAccessToken,
          razorpayPaymentId,
          razorpayPaymentLinkId,
          razorpayPaymentLinkStatus,
        });
        setStatus("success");
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus("error");
      }
    };

    void verify();
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
            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] leading-[1]">Verifying payment...</h1>
            <p className="text-white/50 text-sm">Please wait while we confirm your Razorpay payment.</p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
            <div className="w-28 h-28 rounded-full bg-[hsl(var(--mint)/0.12)] border border-[hsl(var(--mint)/0.2)] flex items-center justify-center mx-auto">
              <CheckCircle2 size={56} className="text-[hsl(var(--mint))]" />
            </div>
            <h1 className="text-[clamp(1.8rem,5vw,3rem)] leading-[0.96]">Payment successful</h1>
            <p className="text-white/55 text-[0.95rem] leading-7">
              Your full Career Clarity Report is now unlocked.
            </p>
            <Button
              size="lg"
              className="w-full min-h-[56px] text-base font-semibold rounded-full gradient-accent text-primary-foreground border-0 gap-2 shadow-lg hover:opacity-95"
              onClick={() => navigate(reportPath)}
            >
              View unlocked report
            </Button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
            <div className="w-28 h-28 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <XCircle size={56} className="text-red-400" />
            </div>
            <h1 className="text-[clamp(1.8rem,5vw,3rem)] leading-[0.96]">Payment verification issue</h1>
            <p className="text-white/55 text-[0.95rem] leading-7">
              We could not verify the payment yet. If you were charged, please keep this report link and contact support.
            </p>
            <Button
              size="lg"
              className="w-full min-h-[52px] rounded-full gradient-accent text-primary-foreground border-0 hover:opacity-95"
              onClick={() => navigate(reportPath)}
            >
              Return to report
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
