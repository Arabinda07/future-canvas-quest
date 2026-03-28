import { useNavigate } from "react-router-dom";
import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Success = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    toast({ title: "Report generating…", description: "Your career report PDF will be ready shortly. This is a demo." });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center max-w-md mx-auto">
      <div className="rounded-full bg-teal-light p-6 mb-6">
        <CheckCircle2 size={64} className="text-success" />
      </div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Assessment Complete!</h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Thank you for completing the NextStep Career Canvas assessment. Your personalized career report is being generated.
      </p>
      <Button size="lg" className="w-full min-h-[52px] text-base font-semibold mb-3" onClick={handleDownload}>
        <Download size={18} /> Download Career Report (PDF)
      </Button>
      <Button variant="ghost" className="min-h-[44px] text-muted-foreground" onClick={() => navigate("/")}>
        <RotateCcw size={16} /> Start Over
      </Button>
    </div>
  );
};

export default Success;
