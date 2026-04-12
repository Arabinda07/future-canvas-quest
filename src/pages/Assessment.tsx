import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ClipboardList, Loader2, Play, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAssessment } from "@/context/AssessmentContext";
import type { AssessmentSession, Report, StudentClass } from "@/domain/types";
import { questions, QUESTIONS_PER_PAGE, type Question } from "@/data/questions";
import { getVisibleQuestions } from "@/features/student/assessmentFlow";
import { buildStudentReportPath, submitAssessmentToBackend } from "@/lib/backend/assessmentGateway";
import { isSupabaseConfigured } from "@/lib/backend/supabase";
import { cn } from "@/lib/utils";
import { repositories } from "@/repositories";

const PSYCHOMETRIC_OPTIONS = [
  { value: "A", label: "Strongly Agree" },
  { value: "B", label: "Agree" },
  { value: "C", label: "Disagree" },
  { value: "D", label: "Strongly Disagree" },
];

const sectionMeta = {
  aptitude: {
    eyebrow: "Aptitude assessment",
    title: "Reasoning and verbal ability",
    description: "Choose one answer for each question. Use the A/B/C/D options exactly as shown.",
  },
  psychometric: {
    eyebrow: "Interests and personality",
    title: "Self-report reflection",
    description: "Respond honestly based on what feels most true for you right now.",
  },
} as const;

const generalInfo = [
  "Full marks: 40. Time: 60 Minutes.",
  "This test is divided into two sections: Section A - Aptitude & Logical Reasoning (40 Marks) and Section B - Interests & Personality (No Marks, Profile-Based).",
  "Section A contributes to the score. Section B contributes to your career profile and guidance report. Attempt all visible questions in both sections.",
];

const sectionAInfo = {
  title: "Section A — Aptitude & Logical Reasoning",
  items: [
    ["Questions", "20 MCQs (Q1–Q20)"],
    ["Format", "4 options (A, B, C, D) — choose one"],
    ["Marking", "Equal marks, no negative marking"],
    ["OMR", "Mark one option per question clearly"],
  ],
};

const sectionBInfo = {
  title: "Section B — Interests & Personality",
  items: [
    ["Statements", "50 items (Q21–Q70)"],
    ["Format", "A = Strongly Agree, B = Agree, C = Disagree, D = Strongly Disagree"],
    ["Scoring", "No right or wrong answers — be honest"],
    ["Note", "Items with \"(R)\" are for scoring only — answer as usual"],
  ],
};

const ReservedVisualSlot = ({ question }: { question: Question }) => {
  if (!question.visualSlot) return null;

  return (
    <div
      aria-label={question.visualSlot.alt}
      data-placement={question.visualSlot.placement ?? "below"}
      className="reserved-visual-slot relative min-h-40 sm:min-h-44 rounded-[24px] sm:rounded-[28px] border border-white/10 bg-white/[0.03]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(164,145,255,0.18),transparent_42%),radial-gradient(circle_at_75%_80%,rgba(109,234,203,0.12),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-[10px] rounded-[20px] sm:rounded-[22px] border border-dashed border-white/12" />
    </div>
  );
};

const SectionTable = ({
  title,
  items,
}: {
  title: string;
  items: string[][];
}) => (
  <div className="glass rounded-[20px] sm:rounded-[24px] border border-white/10 overflow-hidden">
    <div className="px-5 py-3 border-b border-white/8 bg-white/[0.02]">
      <h3 className="text-[0.85rem] sm:text-[0.9rem] font-medium text-white/80 font-body not-italic" style={{ lineHeight: '1.4' }}>{title}</h3>
    </div>
    <div className="divide-y divide-white/6">
      {items.map(([label, value]) => (
        <div key={label} className="flex gap-4 px-5 py-3 text-sm">
          <span className="shrink-0 w-24 sm:w-28 font-medium text-[hsl(var(--lavender-light))] text-[0.8rem]">{label}</span>
          <span className="text-white/65 text-[0.82rem] leading-6 font-body">{value}</span>
        </div>
      ))}
    </div>
  </div>
);

const Assessment = () => {
  const navigate = useNavigate();
  const { state, setAnswer, setCurrentPage, setIntroAccepted, setSessionMetadata } = useAssessment();
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const [introConfirmed, setIntroConfirmed] = useState(false);

  useEffect(() => {
    if (!state.studentData.name) navigate("/register");
  }, [state.studentData.name, navigate]);

  useEffect(() => {
    if (state.introAccepted) {
      setIntroConfirmed(true);
    }
  }, [state.introAccepted]);

  const visibleQuestions = getVisibleQuestions(questions);
  const totalQuestions = visibleQuestions.length;
  const visibleAptitudeQuestions = visibleQuestions.filter((question) => question.type === "aptitude").length;
  const visiblePsychometricQuestions = totalQuestions - visibleAptitudeQuestions;
  const introSummary = `Sections: 2 · Questions: ${totalQuestions} · Scored: ${visibleAptitudeQuestions} · Profile: ${visiblePsychometricQuestions} · Time: 60 min`;

  const page = state.currentPage;
  const totalPages = Math.max(Math.ceil(totalQuestions / QUESTIONS_PER_PAGE), 1);
  const safePage = Math.min(page, totalPages - 1);
  const startIdx = safePage * QUESTIONS_PER_PAGE;
  const pageQuestions = visibleQuestions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);
  const isLastPage = safePage === totalPages - 1;
  const allAnswered = pageQuestions.length > 0 && pageQuestions.every((question) => state.answers[question.id]);
  const answeredCount = visibleQuestions.filter((question) => Boolean(state.answers[question.id])).length;
  const progress = totalQuestions === 0 ? 0 : Math.round((answeredCount / totalQuestions) * 100);
  const qStart = totalQuestions === 0 ? 0 : startIdx + 1;
  const qEnd = Math.min(startIdx + QUESTIONS_PER_PAGE, totalQuestions);
  const currentSection = pageQuestions[0]?.type ?? "aptitude";
  const meta = sectionMeta[currentSection];
  const showIntroScreen = !state.introAccepted;

  const startAssessment = () => {
    if (!introConfirmed) return;
    setDirection(1);
    setIntroAccepted(true);
    setCurrentPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    if (isLastPage) return handleSubmit();
    setDirection(1);
    setCurrentPage(safePage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    if (safePage > 0) {
      setDirection(-1);
      setCurrentPage(safePage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const sessionId = state.session.sessionId;
    if (!sessionId) {
      setSubmitting(false);
      navigate("/register");
      return;
    }

    const now = new Date().toISOString();
    const savedSession = repositories.assessment.getSession(sessionId);
    const sessionToSave: AssessmentSession =
      savedSession ?? {
        id: sessionId,
        studentId: "student",
        counselorId: undefined,
        studentClass: (state.studentData.currentClass || "IX") as StudentClass,
        entryPath: state.session.entryPath ?? "self-serve",
        answers: {},
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

    try {
      const entryPath = state.session.entryPath ?? "self-serve";

      if (!isSupabaseConfigured()) {
        toast({
          title: "Submission setup unavailable",
          description:
            "Supabase and Razorpay configuration are required before assessments can be submitted and reports can be unlocked.",
        });
        setSubmitting(false);
        return;
      }

      const backendResult = await submitAssessmentToBackend({
        sessionToken: sessionId,
        answers: state.answers,
        student: {
          name: state.studentData.name || "Student",
          className: (state.studentData.currentClass || "IX") as StudentClass,
          section: undefined,
          rollNumber: undefined,
          schoolName: undefined,
        },
        entryPath,
        batchCode: state.studentData.counselorCode || undefined,
        consentGiven: state.studentData.consent,
        consentAt: now,
      });

      const finalReportId = backendResult.reportId;
      const finalReport: Report | null = entryPath === "school-issued" ? backendResult.report : null;
      const reportAccessToken = backendResult.reportAccessToken;

      repositories.assessment.saveSession({
        ...sessionToSave,
        answers: state.answers,
        completed: true,
        updatedAt: now,
      });

      if (finalReport) {
        repositories.report.saveReport(finalReport);
      }
      setSessionMetadata({ submittedReportId: finalReportId, reportAccessToken: reportAccessToken ?? null });
      setSubmitting(false);
      navigate(buildStudentReportPath(finalReportId, reportAccessToken));
    } catch (submissionError) {
      setSubmitting(false);
      toast({
        title: "Submission failed",
        description:
          submissionError instanceof Error
            ? submissionError.message
            : "We couldn't complete the assessment submission. Please try again.",
      });
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[34rem] h-[34rem] bg-[hsl(var(--lavender-glow)/0.14)] -top-36 -left-28" />
        <div className="glow-blob w-[30rem] h-[30rem] bg-[hsl(var(--mint-glow)/0.1)] top-[28%] -right-20" style={{ animationDuration: "17s" }} />
      </div>

      <div className="relative px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
        {showIntroScreen ? (
          <div className="mx-auto max-w-5xl py-4 sm:py-8">
            <div className="glass-strong rounded-[28px] sm:rounded-[36px] border border-white/10 p-5 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.64rem] sm:text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/70">
                  Start test
                </div>
                <h1 className="mt-4 text-[clamp(2rem,6vw,4.75rem)] leading-[0.96] break-words">
                  Read this once,
                  <br />
                  then begin with confidence.
                </h1>
                <p className="mt-4 max-w-2xl text-[0.95rem] sm:text-[1rem] leading-7 text-white/55">
                  You are about to begin the Future Canvas assessment. Review the complete instructions below before starting.
                </p>
              </div>

              {/* General Instructions — horizontal strip */}
              <div className="glass rounded-[20px] sm:rounded-[24px] border border-white/10 px-5 py-5 sm:px-7 sm:py-6 mb-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--lavender)/0.16)] text-[hsl(var(--lavender-light))]">
                    <ClipboardList size={16} />
                  </span>
                  <h2 className="text-[clamp(1.1rem,2.5vw,1.4rem)] leading-[1.1] not-italic font-body font-medium" style={{ lineHeight: '1.3' }}>General Instructions</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {generalInfo.map((item, i) => (
                    <div key={i} className="flex gap-3 text-[0.85rem] sm:text-[0.88rem] leading-6 text-white/65 font-body">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-white/60">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section A & B — tabular side-by-side */}
              <div className="grid gap-4 sm:grid-cols-2">
                <SectionTable title={sectionAInfo.title} items={sectionAInfo.items} />
                <SectionTable title={sectionBInfo.title} items={sectionBInfo.items} />
              </div>

              {/* Footer with checkbox and start button */}
              <div className="mt-6 sm:mt-8 flex flex-col gap-4 border-t border-white/10 pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-white/45 max-w-2xl font-body">
                    {introSummary}
                  </p>
                  <Button
                    type="button"
                    onClick={startAssessment}
                    disabled={!introConfirmed}
                    className="rounded-full px-6 sm:px-7 gradient-accent text-primary-foreground hover:opacity-95 disabled:opacity-50"
                  >
                    <Play size={18} />
                    Start test
                  </Button>
                </div>

                <label htmlFor="intro-confirmed" className="flex items-start gap-3 text-sm leading-6 text-white/60 cursor-pointer select-none font-body">
                  <Checkbox
                    id="intro-confirmed"
                    checked={introConfirmed}
                    onCheckedChange={(checked) => setIntroConfirmed(checked === true)}
                    className="mt-1 border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                  <span>I have read the instructions.</span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sticky progress header */}
            <div className="sticky top-0 z-20 mx-auto max-w-6xl rounded-[24px] sm:rounded-[28px] border border-white/10 bg-black/35 px-4 py-4 sm:px-5 shadow-card backdrop-blur-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2 min-w-0">
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.64rem] sm:text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/70">
                    {meta.eyebrow}
                  </div>
                  <div>
                    <h1 className="text-[clamp(1.5rem,5.6vw,3rem)] leading-[1.02] break-words">{meta.title}</h1>
                    <p className="mt-2 max-w-2xl text-[0.9rem] sm:text-sm leading-6 text-white/50 font-body">{meta.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:shrink-0">
                  <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 font-body">
                    Q {qStart}–{qEnd} of {totalQuestions}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div className="h-full rounded-full gradient-accent" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
                  </div>
                  <div className="mt-1.5 flex justify-between gap-3 text-[11px] font-medium text-white/40 font-body">
                    <span>{answeredCount} answered</span>
                    <span className="text-white/60">{progress}% complete</span>
                  </div>
                </div>
                <div className="sm:hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 text-center font-body">
                  Q {qStart}–{qEnd} of {totalQuestions}
                </div>
              </div>
            </div>

            {/* Questions */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                initial={{ x: direction * 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -40, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mx-auto mt-5 sm:mt-6 max-w-6xl space-y-4 sm:space-y-5"
              >
                {pageQuestions.map((question, index) => {
                  const options = question.type === "aptitude" ? question.options ?? [] : PSYCHOMETRIC_OPTIONS.map(({ value, label }) => `${value} = ${label}`);
                  const visualFirst = question.visualSlot?.placement === "side";

                  return (
                    <motion.div
                      key={question.id}
                      data-testid={`question-card-${question.id}`}
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-strong rounded-[24px] sm:rounded-[30px] border border-white/10 px-4 py-4 sm:px-7 sm:py-6"
                    >
                      <div className="mb-4 sm:mb-5 flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.64rem] sm:text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/50 font-body">
                          {question.type === "aptitude" ? "Section A" : "Section B"}
                        </span>
                        <span className="inline-flex rounded-full bg-[hsl(var(--lavender)/0.14)] px-3 py-1 text-[0.7rem] sm:text-[0.72rem] font-semibold text-[hsl(var(--lavender-light))] font-body">
                          {question.id}
                        </span>
                      </div>

                      <div className={cn("grid gap-4 sm:gap-6", visualFirst && "xl:grid-cols-[minmax(0,1.35fr)_17rem] xl:items-start")}>
                        <div>
                          <p className="max-w-3xl text-[0.98rem] sm:text-[1.08rem] leading-7 sm:leading-[1.75] text-white/85 break-words font-body">{question.text}</p>
                        </div>
                        {visualFirst && <ReservedVisualSlot question={question} />}
                      </div>

                      {!visualFirst && question.visualSlot && <div className="mt-4 sm:mt-5"><ReservedVisualSlot question={question} /></div>}

                      <div className="mt-5 sm:mt-6 grid gap-3 sm:grid-cols-2">
                        {options.map((option, optionIndex) => {
                          const optionKey = question.type === "aptitude" ? ["A", "B", "C", "D"][optionIndex] : PSYCHOMETRIC_OPTIONS[optionIndex].value;
                          const isSelected = state.answers[question.id] === optionKey;

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setAnswer(question.id, optionKey)}
                              className={cn(
                                "group min-w-0 rounded-[18px] sm:rounded-[22px] border px-4 py-4 text-left transition-all duration-200",
                                "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20",
                                isSelected && "border-[hsl(var(--lavender)/0.5)] bg-[hsl(var(--lavender)/0.14)] shadow-[0_0_0_1px_rgba(160,140,255,0.2)]",
                              )}
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <span
                                  className={cn(
                                    "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold font-body",
                                    isSelected ? "border-[hsl(var(--lavender)/0.6)] bg-[hsl(var(--lavender)/0.18)] text-white" : "border-white/12 bg-white/[0.04] text-white/60",
                                  )}
                                >
                                  {optionKey}
                                </span>
                                <span className="min-w-0 text-sm leading-6 text-white/75 break-words font-body">{option}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Navigation */}
                <div className="glass rounded-[24px] sm:rounded-[28px] border border-white/10 px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-center justify-between gap-3">
                    <Button type="button" variant="outline" onClick={goPrev} disabled={safePage === 0 || submitting}
                      className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white">
                      <ChevronLeft size={18} />
                      Previous
                    </Button>

                    <Button
                      type="button"
                      onClick={goNext}
                      disabled={!allAnswered || submitting}
                      className="rounded-full px-5 sm:px-6 gradient-accent text-primary-foreground hover:opacity-95 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={18} className="animate-spin" /> : isLastPage ? <Send size={18} /> : <ChevronRight size={18} />}
                      {submitting ? "Submitting..." : isLastPage ? "Submit assessment" : "Next page"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default Assessment;
