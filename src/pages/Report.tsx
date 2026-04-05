import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, FileText, ArrowRight, Star, Compass, Brain, BarChart3, Target, BookOpen, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// ─── Types for the generated report ───
interface ReportData {
  studentName: string;
  studentClass: string;
  date: string;
  intro: string;
  disclaimer: string;
  topStream: string;
  confidence: string;
  sectionA: {
    coreProfile: { aptitudes: string; interests: string; traits: string };
    narrative: string;
    showTieNote: boolean;
  };
  sectionB: Array<{ key: string; label: string; scaled: number; level: string; interpretation: string }>;
  sectionC: {
    riasec: Array<{ key: string; label: string; title: string; score: number; def: string; activities: string[]; careers: string[] }>;
    bigFive: Array<{ key: string; label: string; score: number; level: string; interpretation: string }>;
  };
  sectionD: Array<{ area: string; recommendation: string }>;
  sectionE: Array<{ label: string; careers: string[] }>;
  sectionF: Array<{ flag: string; text: string }>;
}

const paywallSections = [
  { icon: Star, letter: "A", title: "Profile at a Glance", desc: "Your core aptitudes, interests, and personality summary with stream validation." },
  { icon: Compass, letter: "B", title: "Aptitude Profile", desc: "Numerical, Logical, and Verbal reasoning scores with performance bars." },
  { icon: Brain, letter: "C", title: "Interests & Personality", desc: "RIASEC interest map and Big Five personality traits with interpretations." },
  { icon: BarChart3, letter: "D", title: "Next Steps", desc: "Subjects, projects, and competitions tailored to your stream and class." },
  { icon: Target, letter: "E", title: "Career Pathways", desc: "Career clusters matched to your top interest types." },
  { icon: BookOpen, letter: "F", title: "Guidance Notes", desc: "Counselling notes, flags, and supportive recommendations." },
];

const Report = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const isPaid = localStorage.getItem("fc_payment_status") === "paid";

  useEffect(() => {
    if (!isPaid) return;
    const assessmentId = localStorage.getItem("fc_assessment_id");
    if (!assessmentId) return;

    const fetchReport = async () => {
      setReportLoading(true);
      try {
        // Try fetching from DB first
        const { data } = await supabase
          .from("assessments")
          .select("generated_report")
          .eq("id", assessmentId)
          .single();

        if (data?.generated_report) {
          setReportData(data.generated_report as unknown as ReportData);
        } else {
          // Generate if not cached
          const { data: genData, error } = await supabase.functions.invoke("generate-report", {
            body: { assessmentId },
          });
          if (error) throw error;
          if (genData?.report) setReportData(genData.report);
        }
      } catch (err) {
        console.error("Failed to load report:", err);
        toast({ title: "Failed to load report", description: "Please try refreshing the page.", variant: "destructive" });
      } finally {
        setReportLoading(false);
      }
    };
    fetchReport();
  }, [isPaid]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const studentName = localStorage.getItem("fc_student_name") || "Student";
      const studentEmail = localStorage.getItem("fc_student_email") || "";
      const studentPhone = localStorage.getItem("fc_student_phone") || "";
      const callbackUrl = `${window.location.origin}/payment-success`;

      const { data, error } = await supabase.functions.invoke("create-payment-link", {
        body: { studentName, studentEmail, studentPhone, callbackUrl },
      });
      if (error) throw error;
      if (data?.short_url) {
        window.location.href = data.short_url;
      } else {
        throw new Error("No payment link received");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({ title: "Payment failed", description: "Could not create payment link. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ─── PAID: Full Report View ───
  if (isPaid) {
    if (reportLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 size={48} className="animate-spin text-white/40 mx-auto" />
            <p className="text-white/50">Loading your report…</p>
          </div>
        </div>
      );
    }

    if (!reportData) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-5">
          <div className="text-center space-y-4 max-w-sm">
            <AlertTriangle size={48} className="text-yellow-400 mx-auto" />
            <h2 className="text-xl">Report not available</h2>
            <p className="text-white/50 text-sm">We couldn't load your report. Please try again.</p>
            <Button className="rounded-full gradient-accent text-primary-foreground border-0" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background relative overflow-x-clip">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-blob w-[32rem] h-[32rem] bg-[hsl(var(--lavender-glow)/0.12)] top-10 -right-20" />
          <div className="glow-blob w-[26rem] h-[26rem] bg-[hsl(var(--mint-glow)/0.1)] bottom-20 -left-16" style={{ animationDuration: "14s" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-5 py-12">
          {/* Header */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4">
              <Sparkles size={16} className="text-[hsl(var(--mint))]" />
              <span className="text-white/60 text-sm">Future Canvas Career Report</span>
            </div>
            <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] leading-[1] mb-2">{reportData.studentName}</h1>
            <p className="text-white/40 text-sm">Class {reportData.studentClass} &middot; {reportData.date}</p>
            <p className="text-white/45 text-[0.85rem] mt-3 max-w-lg mx-auto leading-relaxed">{reportData.intro}</p>
          </motion.div>

          <div className="space-y-6">
            {/* Section A: Profile at a Glance */}
            <ReportCard title="Profile at a Glance" letter="A" icon={Star} delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white/30 text-xs font-semibold tracking-widest uppercase">Your Core Profile</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li><span className="text-white/40">Core Aptitude(s):</span> {reportData.sectionA.coreProfile.aptitudes}</li>
                    <li><span className="text-white/40">Primary Interests:</span> {reportData.sectionA.coreProfile.interests}</li>
                    <li><span className="text-white/40">Key Personality Trait(s):</span> {reportData.sectionA.coreProfile.traits}</li>
                    <li>
                      <span className="text-white/40">Top Stream:</span>{" "}
                      <span className="text-[hsl(var(--mint))] font-semibold">{reportData.topStream}</span>
                      <span className="text-white/30 text-xs ml-1">({reportData.confidence} confidence)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white/30 text-xs font-semibold tracking-widest uppercase mb-3">Stream Validation</h4>
                  <p className="text-white/55 text-sm leading-relaxed">{reportData.sectionA.narrative}</p>
                  {reportData.sectionA.showTieNote && (
                    <p className="text-white/35 text-xs italic mt-2">Note: Having multiple core strengths is common and indicates a versatile profile.</p>
                  )}
                </div>
              </div>
            </ReportCard>

            {/* Section B: Aptitude Profile */}
            <ReportCard title="Aptitude Profile" letter="B" icon={Compass} delay={0.15}>
              <p className="text-white/40 text-xs mb-4">Aptitude measures your natural potential to learn and excel in specific areas.</p>
              <div className="space-y-5">
                {reportData.sectionB.map((apt) => (
                  <div key={apt.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-white/80 font-medium">{apt.label}</span>
                      <span className="text-sm text-white/50">{apt.scaled.toFixed(1)}%</span>
                    </div>
                    <Progress value={apt.scaled} className="h-2.5 bg-white/[0.06] mb-1.5" />
                    <p className="text-white/45 text-xs leading-relaxed">{apt.interpretation}</p>
                  </div>
                ))}
              </div>
            </ReportCard>

            {/* Section C: Interests & Personality */}
            <ReportCard title="Interests & Personality" letter="C" icon={Brain} delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* RIASEC */}
                <div>
                  <h4 className="text-white/30 text-xs font-semibold tracking-widest uppercase mb-3">Your Interest Profile (RIASEC)</h4>
                  <p className="text-white/40 text-xs mb-4">Your interests highlight the activities and environments you find most motivating.</p>
                  <div className="space-y-4">
                    {reportData.sectionC.riasec.map((r) => (
                      <div key={r.key} className="glass rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[hsl(var(--mint))] text-sm font-semibold">{r.label}</span>
                          <span className="text-white/30 text-xs">- {r.title}</span>
                        </div>
                        <p className="text-white/50 text-xs leading-relaxed mb-2">{r.def}</p>
                        <ul className="text-white/40 text-xs space-y-1">
                          {r.activities.map((a, i) => <li key={i}>\u2022 {a}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Big Five */}
                <div>
                  <h4 className="text-white/30 text-xs font-semibold tracking-widest uppercase mb-3">Personality Style (Big Five)</h4>
                  <p className="text-white/40 text-xs mb-4">Scores are on a scale of 0 to 100.</p>
                  <div className="space-y-4">
                    {reportData.sectionC.bigFive.map((t) => (
                      <div key={t.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/70 font-medium">{t.label}</span>
                          <span className="text-xs text-white/40">{t.score.toFixed(1)}</span>
                        </div>
                        <Progress value={t.score} className="h-2 bg-white/[0.06] mb-1" />
                        <p className="text-white/45 text-xs leading-relaxed">{t.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ReportCard>

            {/* Section D: Next Steps */}
            <ReportCard title="Next Steps" letter="D" icon={BarChart3} delay={0.25}>
              <p className="text-white/40 text-xs mb-4">Based on your profile, here are concrete actions you can take:</p>
              <div className="space-y-3">
                {reportData.sectionD.map((action, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <h5 className="text-sm text-white/70 font-semibold mb-1">{action.area}</h5>
                    <p className="text-white/50 text-xs leading-relaxed">{action.recommendation}</p>
                  </div>
                ))}
              </div>
            </ReportCard>

            {/* Section E: Career Pathways */}
            <ReportCard title="Career Pathways" letter="E" icon={Target} delay={0.3}>
              <p className="text-white/40 text-xs mb-4">Based on your primary interests, explore careers in these areas:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.sectionE.map((cluster) => (
                  <div key={cluster.label} className="glass rounded-xl p-4">
                    <h5 className="text-sm text-[hsl(var(--mint))] font-semibold mb-2">{cluster.label}</h5>
                    <ul className="text-white/50 text-xs space-y-1.5">
                      {cluster.careers.map((c, i) => <li key={i}>\u2022 {c}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </ReportCard>

            {/* Section F: Guidance Notes */}
            <ReportCard title="Guidance Notes" letter="F" icon={BookOpen} delay={0.35}>
              <div className="space-y-3">
                {reportData.sectionF.map((note, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    {note.flag !== "No_Flags" && (
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={14} className="text-yellow-400" />
                        <span className="text-xs text-yellow-400/80 font-semibold">{note.flag.replace(/_/g, " ")}</span>
                      </div>
                    )}
                    <p className="text-white/55 text-xs leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </ReportCard>

            {/* Disclaimer */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-5 text-center">
              <p className="text-white/30 text-xs leading-relaxed">{reportData.disclaimer}</p>
            </motion.div>
          </div>

          <div className="text-center mt-10">
            <Button variant="ghost" className="text-white/40 rounded-full gap-2 hover:text-white/70 hover:bg-white/[0.05]" onClick={() => navigate("/")}>
              \u2190 Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── UNPAID: Paywall View ───
  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[32rem] h-[32rem] bg-[hsl(var(--lavender-glow)/0.12)] top-10 -right-20" />
        <div className="glow-blob w-[26rem] h-[26rem] bg-[hsl(var(--mint-glow)/0.1)] bottom-20 -left-16" style={{ animationDuration: "14s" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-16">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <FileText size={16} className="text-white/60" />
            <span className="text-white/60 text-sm">Your Career Report</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3rem)] leading-[0.96] mb-4">Your Future Canvas Report is Ready</h1>
          <p className="text-white/50 text-[0.95rem] leading-7 max-w-lg mx-auto">
            We've analyzed your 70 responses across three frameworks. Unlock your full personalized report below.
          </p>
        </motion.div>

        <div className="relative">
          <div className="space-y-4">
            {paywallSections.map((s, i) => (
              <motion.div key={s.letter} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.08 }}
                className={`glass rounded-2xl p-5 flex items-start gap-4 ${i >= 2 ? "blur-[6px] select-none pointer-events-none" : ""}`}>
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
                        ? "Your strongest aptitude area: Numerical Reasoning \u2014 top 22% among test takers in your class."
                        : "Primary RIASEC code: Investigative (I) \u2014 you thrive in analytical, research-oriented environments."}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="absolute inset-x-0 bottom-0 top-[45%] flex flex-col items-center justify-end pb-6 bg-gradient-to-t from-background via-background/95 to-transparent">
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
              <Button size="lg" className="w-full min-h-[52px] text-base font-semibold rounded-full gradient-accent text-primary-foreground border-0 gap-2 shadow-lg hover:opacity-95"
                onClick={handlePay} disabled={loading}>
                {loading ? (<><Loader2 size={16} className="animate-spin" />Creating payment link\u2026</>) : (<>Pay & Unlock Report <ArrowRight size={16} /></>)}
              </Button>
              <p className="text-white/30 text-xs mt-3">Secure payment via Razorpay \u00B7 Instant access</p>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <Button variant="ghost" className="text-white/40 rounded-full gap-2 hover:text-white/70 hover:bg-white/[0.05]" onClick={() => navigate("/")}>
            \u2190 Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Reusable Report Card Component ───
function ReportCard({ title, letter, icon: Icon, delay, children }: {
  title: string; letter: string; icon: React.ElementType; delay: number; children: React.ReactNode;
}) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}
      className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon size={18} className="text-[hsl(var(--mint))]" />
        </div>
        <div>
          <span className="text-[0.65rem] font-semibold tracking-widest text-white/30 uppercase">Section {letter}</span>
          <h3 className="font-heading italic text-white/90 text-lg leading-tight">{title}</h3>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default Report;
