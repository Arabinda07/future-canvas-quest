import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssessment } from "@/context/AssessmentContext";

const Register = () => {
  const navigate = useNavigate();
  const { setStudentData } = useAssessment();
  const [name, setName] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [email, setEmail] = useState("");
  const [counselorCode, setCounselorCode] = useState("");
  const [consent, setConsent] = useState(false);

  const isValid = name.trim() !== "" && currentClass !== "" && consent;

  const handleSubmit = () => {
    if (!isValid) return;
    setStudentData({ name: name.trim(), currentClass, email: email.trim(), counselorCode: counselorCode.trim(), consent });
    navigate("/assessment");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-lavender/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-mint/6 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1 px-5 py-4 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-muted-foreground text-sm min-h-[44px] hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </motion.button>
          <ThemeToggle />
        </div>

        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg gradient-accent flex items-center justify-center">
              <Sparkles size={14} className="text-accent-foreground" />
            </div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Step 1 of 2</span>
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground mb-1">Let's get started</h1>
          <p className="text-muted-foreground text-sm mb-8">Minimal info — just enough to personalize your career report.</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-5 flex-1"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">First Name or Nickname *</Label>
            <Input id="name" placeholder="e.g. Priya" value={name} onChange={(e) => setName(e.target.value)} className="min-h-[50px] rounded-xl bg-card shadow-sm border-border focus:ring-2 focus:ring-ring" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Current Class *</Label>
            <Select value={currentClass} onValueChange={setCurrentClass}>
              <SelectTrigger className="min-h-[50px] rounded-xl bg-card shadow-sm border-border">
                <SelectValue placeholder="Select your class" />
              </SelectTrigger>
              <SelectContent>
                {["IX", "X", "XI", "XII"].map((c) => (
                  <SelectItem key={c} value={c}>Class {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">Parent or Student Email</Label>
            <Input id="email" type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-[50px] rounded-xl bg-card shadow-sm border-border" />
            <p className="text-xs text-muted-foreground pl-1">Only used to send a backup of your report.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-semibold">School / Counselor Code</Label>
            <Input id="code" placeholder="e.g. SCH-1234" value={counselorCode} onChange={(e) => setCounselorCode(e.target.value)} className="min-h-[50px] rounded-xl bg-card shadow-sm border-border" />
            <p className="text-xs text-muted-foreground pl-1">Leave blank if you are taking this independently.</p>
          </div>

          <div className="flex items-start gap-3 pt-2 p-4 rounded-xl bg-muted/50 border border-border">
            <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5 min-w-[22px] min-h-[22px] rounded-md" />
            <label htmlFor="consent" className="text-sm text-muted-foreground leading-snug cursor-pointer">
              I agree to the privacy policy. My data will only be used to generate this career report and will never be shared with third parties. *
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-6 pb-4"
        >
          <Button
            className="w-full min-h-[56px] text-base font-bold rounded-full gradient-cta border-0 text-foreground gap-2 shadow-lg"
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
