import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitCounselorRegistration } from "@/lib/backend/counselorGateway";

const emptyForm = {
  counselorName: "",
  email: "",
  phone: "",
  schoolName: "",
  schoolCity: "",
  expectedStudentCount: "",
  message: "",
};

const CounselorRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const expectedStudentCount = Number(form.expectedStudentCount);
    if (!Number.isFinite(expectedStudentCount) || expectedStudentCount <= 0) {
      setError("Enter the expected number of students as a positive number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitCounselorRegistration({
        counselorName: form.counselorName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        schoolName: form.schoolName.trim(),
        schoolCity: form.schoolCity.trim(),
        expectedStudentCount,
        message: form.message.trim(),
      });
      setIsSubmitted(true);
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : "We could not submit this counselor registration request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden px-4 py-6 sm:px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-blob w-[28rem] h-[28rem] bg-[hsl(var(--mint-glow)/0.14)] -top-24 -left-24" />
          <div className="glow-blob w-[26rem] h-[26rem] bg-[hsl(var(--lavender-glow)/0.12)] bottom-0 -right-20" style={{ animationDuration: "16s" }} />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
          <Card className="w-full border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-[hsl(var(--mint)/0.35)] bg-[hsl(var(--mint)/0.12)] text-[hsl(var(--mint-glow))]">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <CardTitle className="text-3xl">Your request is pending review.</CardTitle>
                <CardDescription className="mt-3 text-white/55">
                  The Future Canvas team will review the school details and share counselor access once approved.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button className="rounded-full gradient-accent text-primary-foreground border-0" onClick={() => navigate("/")}>
                Back to site
                <ArrowRight size={16} />
              </Button>
              <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white" onClick={() => navigate("/counselor/login")}>
                Counselor login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden px-4 py-6 sm:px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[28rem] h-[28rem] bg-[hsl(var(--lavender-glow)/0.12)] -top-24 -left-24" />
        <div className="glow-blob w-[26rem] h-[26rem] bg-[hsl(var(--mint-glow)/0.1)] bottom-0 -right-20" style={{ animationDuration: "16s" }} />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/65">
            <ShieldCheck size={14} />
            School onboarding
          </div>
          <div className="space-y-4">
            <h1 className="text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.95]">Register for counselor access.</h1>
            <p className="max-w-2xl text-sm sm:text-base leading-7 text-white/55">
              Submit your school details. We review each request before issuing a private batch code and dashboard token.
            </p>
          </div>
          <Link to="/counselor/login" className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
            Already have a code and token? Sign in
            <ArrowRight size={16} />
          </Link>
        </section>

        <Card className="border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Counselor registration</CardTitle>
            <CardDescription className="text-white/55">Access is issued after admin approval, not instantly on form submission.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="counselor-name" className="text-white/70">Counselor name</Label>
                  <Input id="counselor-name" required value={form.counselorName} onChange={(event) => updateField("counselorName", event.target.value)} className="min-h-[48px] rounded-2xl bg-white/[0.04] border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="counselor-email" className="text-white/70">Email</Label>
                  <Input id="counselor-email" type="email" required value={form.email} onChange={(event) => updateField("email", event.target.value)} className="min-h-[48px] rounded-2xl bg-white/[0.04] border-white/10 text-white" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="counselor-phone" className="text-white/70">Phone</Label>
                  <Input id="counselor-phone" required value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="min-h-[48px] rounded-2xl bg-white/[0.04] border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected-students" className="text-white/70">Expected students</Label>
                  <Input id="expected-students" type="number" min="1" required value={form.expectedStudentCount} onChange={(event) => updateField("expectedStudentCount", event.target.value)} className="min-h-[48px] rounded-2xl bg-white/[0.04] border-white/10 text-white" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="school-name" className="text-white/70">School name</Label>
                  <Input id="school-name" required value={form.schoolName} onChange={(event) => updateField("schoolName", event.target.value)} className="min-h-[48px] rounded-2xl bg-white/[0.04] border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-city" className="text-white/70">School city</Label>
                  <Input id="school-city" required value={form.schoolCity} onChange={(event) => updateField("schoolCity", event.target.value)} className="min-h-[48px] rounded-2xl bg-white/[0.04] border-white/10 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration-message" className="text-white/70">Message</Label>
                <Textarea id="registration-message" value={form.message} onChange={(event) => updateField("message", event.target.value)} className="min-h-[110px] rounded-2xl bg-white/[0.04] border-white/10 text-white" />
              </div>

              {error ? (
                <div className="rounded-2xl border border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.08)] px-4 py-3 text-sm text-white/80">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="min-h-[50px] rounded-full gradient-accent text-primary-foreground border-0" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                Submit registration request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CounselorRegister;
