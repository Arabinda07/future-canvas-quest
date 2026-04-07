import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssessment } from "@/context/AssessmentContext";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setStudentData, clearState } = useAssessment();
  const [name, setName] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [email, setEmail] = useState("");
  const [counselorCode, setCounselorCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [campaignSchool, setCampaignSchool] = useState<string | null>(null);

  // Detect campaign code from URL
  useEffect(() => {
    const code = searchParams.get("campaign");
    if (!code) return;
    supabase
      .from("campaigns")
      .select("id, school_name, class, section")
      .eq("campaign_code", code.toUpperCase())
      .eq("status", "active")
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCampaignId(data.id);
          setCampaignSchool(data.school_name);
          setCurrentClass(data.class);
          setCounselorCode(code.toUpperCase());
        }
      });
  }, [searchParams]);

  const isValid = name.trim() !== "" && currentClass !== "" && consent;

  const handleSubmit = () => {
    if (!isValid) return;
    clearState();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    setStudentData({ name: trimmedName, currentClass, email: trimmedEmail, counselorCode: counselorCode.trim(), consent });
    localStorage.setItem("fc_student_name", trimmedName);
    localStorage.setItem("fc_student_email", trimmedEmail);
    if (campaignId) localStorage.setItem("fc_campaign_id", campaignId);
    navigate("/assessment");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[30rem] h-[30rem] bg-[hsl(var(--lavender-glow)/0.12)] -top-32 -left-24" />
        <div className="glow-blob w-[26rem] h-[26rem] bg-[hsl(var(--mint-glow)/0.08)] bottom-0 -right-16" style={{ animationDuration: "15s" }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen px-4 py-6 sm:px-6 max-w-lg mx-auto w-full">
        {/* Back button */}
        <motion.button
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-white/50 text-sm min-h-[44px] hover:text-white/80 transition-colors mb-8 self-start"
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        {/* Header */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center">
              <Sparkles size={14} className="text-primary-foreground" />
            </div>
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--lavender-light))]">Step 1 of 2</span>
          </div>
          <h1 className="text-[clamp(2rem,6vw,3rem)] leading-[0.96]">Let's get started</h1>
          <p className="mt-3 text-[0.95rem] leading-7 text-white/55 mb-8">Minimal info — just enough to personalize your career report.</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-5 flex-1"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-white/70">First Name or Nickname *</Label>
            <Input id="name" placeholder="e.g. Priya" value={name} onChange={(e) => setName(e.target.value)}
              className="min-h-[50px] rounded-2xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(var(--lavender)/0.5)] focus:ring-1 focus:ring-[hsl(var(--lavender)/0.3)]" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/70">Current Class *</Label>
            <Select value={currentClass} onValueChange={setCurrentClass}>
              <SelectTrigger className="min-h-[50px] rounded-2xl bg-white/[0.04] border-white/10 text-white">
                <SelectValue placeholder="Select your class" />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--card))] border-white/10">
                {["IX", "X", "XI", "XII"].map((c) => (
                  <SelectItem key={c} value={c} className="text-white/80 focus:bg-white/[0.08] focus:text-white">Class {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-white/70">Parent or Student Email</Label>
            <Input id="email" type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="min-h-[50px] rounded-2xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(var(--lavender)/0.5)]" />
            <p className="text-xs text-white/40 pl-1">Only used to send a backup of your report.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium text-white/70">School / Counselor Code</Label>
            <Input id="code" placeholder="e.g. SCH-1234" value={counselorCode} onChange={(e) => setCounselorCode(e.target.value)}
              className="min-h-[50px] rounded-2xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(var(--lavender)/0.5)]" />
            <p className="text-xs text-white/40 pl-1">Leave blank if you are taking this independently.</p>
          </div>

          <div className="glass rounded-2xl border border-white/10 p-4 flex items-start gap-3">
            <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)}
              className="mt-0.5 min-w-[22px] min-h-[22px] rounded-md border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
            <label htmlFor="consent" className="text-sm text-white/60 leading-snug cursor-pointer">
              I agree to the privacy policy. My data will only be used to generate this career report and will never be shared with third parties. *
            </label>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-6 pb-4"
        >
          <Button
            className="w-full min-h-[56px] text-base font-semibold rounded-full gradient-accent text-primary-foreground border-0 gap-2 shadow-lg hover:opacity-95 disabled:opacity-50"
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Begin Assessment <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
