import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen flex flex-col px-5 py-4 max-w-lg mx-auto">
      <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-muted-foreground text-sm mb-6 min-h-[44px]">
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="font-heading text-2xl font-bold text-primary mb-1">Let's get started</h1>
      <p className="text-muted-foreground text-sm mb-8">We collect minimal information — just enough to personalize your report.</p>

      <div className="space-y-5 flex-1">
        <div className="space-y-2">
          <Label htmlFor="name">First Name or Nickname *</Label>
          <Input id="name" placeholder="e.g. Priya" value={name} onChange={(e) => setName(e.target.value)} className="min-h-[48px]" />
        </div>

        <div className="space-y-2">
          <Label>Current Class *</Label>
          <Select value={currentClass} onValueChange={setCurrentClass}>
            <SelectTrigger className="min-h-[48px]">
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
          <Label htmlFor="email">Parent or Student Email</Label>
          <Input id="email" type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-[48px]" />
          <p className="text-xs text-muted-foreground">Only used to send a backup of your report.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">School / Counselor Code</Label>
          <Input id="code" placeholder="e.g. SCH-1234" value={counselorCode} onChange={(e) => setCounselorCode(e.target.value)} className="min-h-[48px]" />
          <p className="text-xs text-muted-foreground">Leave blank if you are taking this independently.</p>
        </div>

        <div className="flex items-start gap-3 pt-2">
          <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5 min-w-[22px] min-h-[22px]" />
          <label htmlFor="consent" className="text-sm text-muted-foreground leading-snug cursor-pointer">
            I agree to the privacy policy. My data will only be used to generate this career report and will never be shared with third parties. *
          </label>
        </div>
      </div>

      <div className="pt-6 pb-4">
        <Button className="w-full min-h-[52px] text-base font-semibold" disabled={!isValid} onClick={handleSubmit}>
          Begin Assessment
        </Button>
      </div>
    </div>
  );
};

export default Register;
