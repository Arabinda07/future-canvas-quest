import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/context/AssessmentContext";
import { questions, QUESTIONS_PER_PAGE, TOTAL_PAGES, TOTAL_QUESTIONS, type Question } from "@/data/questions";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

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

const ReservedVisualSlot = ({ question }: { question: Question }) => {
  if (!question.visualSlot) return null;

  return (
    <div
      aria-label={question.visualSlot.alt}
      className="reserved-visual-slot min-h-44 rounded-[28px] border border-white/10 bg-white/[0.03]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(164,145,255,0.18),transparent_42%),radial-gradient(circle_at_75%_80%,rgba(109,234,203,0.12),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-[10px] rounded-[22px] border border-dashed border-white/12" />
    </div>
  );
};

const Assessment = () => {
  const navigate = useNavigate();
  const { state, setAnswer, setCurrentPage, clearState, setCompleted } = useAssessment();
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!state.studentData.name && !state.completed) navigate("/register");
    if (state.completed) navigate("/success");
  }, [state.studentData.name, state.completed, navigate]);

  const page = state.currentPage;
  const startIdx = page * QUESTIONS_PER_PAGE;
  const pageQuestions = questions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);
  const isLastPage = page === TOTAL_PAGES - 1;
  const allAnswered = pageQuestions.every((question) => state.answers[question.id]);
  const answeredCount = Object.keys(state.answers).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
  const qStart = startIdx + 1;
  const qEnd = Math.min(startIdx + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);
  const currentSection = pageQuestions[0]?.type ?? "aptitude";
  const meta = sectionMeta[currentSection];

  const goNext = () => {
    if (isLastPage) return handleSubmit();
    setDirection(1);
    setCurrentPage(page + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    if (page > 0) {
      setDirection(-1);
      setCurrentPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCompleted();
    clearState();
    navigate("/success");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow-blob w-[34rem] h-[34rem] bg-[hsl(var(--lavender-glow)/0.14)] -top-36 -left-28" />
        <div className="glow-blob w-[30rem] h-[30rem] bg-[hsl(var(--mint-glow)/0.1)] top-[28%] -right-20" style={{ animationDuration: "17s" }} />
      </div>

      <div className="relative px-4 py-4 md:px-6 md:py-6">
        <div className="sticky top-0 z-20 mx-auto max-w-6xl rounded-[28px] border border-white/10 bg-black/35 px-5 py-4 shadow-card backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/70">
                {meta.eyebrow}
              </div>
              <div>
                <h1 className="text-[clamp(1.9rem,3.6vw,3rem)] leading-[0.96]">{meta.title}</h1>
                <p className="mt-2 max-w-2xl text-sm text-white/58">{meta.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/68">
                Q {qStart}–{qEnd} of {TOTAL_QUESTIONS}
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div className="h-full rounded-full gradient-accent" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] font-medium text-white/45">
                <span>{answeredCount} answered</span>
                <span className="text-white/72">{progress}% complete</span>
              </div>
            </div>
            <div className="sm:hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/68 text-center">
              Q {qStart}–{qEnd} of {TOTAL_QUESTIONS}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            initial={{ x: direction * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-6 max-w-6xl space-y-5"
          >
            {pageQuestions.map((question, index) => {
              const options = question.type === "aptitude" ? question.options ?? [] : PSYCHOMETRIC_OPTIONS.map(({ value, label }) => `${value} = ${label}`);
              const visualFirst = question.visualSlot?.placement === "side";

              return (
                <motion.div
                  key={question.id}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-strong rounded-[30px] border border-white/10 px-5 py-5 sm:px-7 sm:py-6"
                >
                  <div className="mb-5 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/60">
                      {question.type === "aptitude" ? "Section A" : "Section B"}
                    </span>
                    <span className="inline-flex rounded-full bg-[hsl(var(--lavender)/0.14)] px-3 py-1 text-[0.72rem] font-semibold text-[hsl(var(--lavender-light))]">
                      {question.id}
                    </span>
                  </div>

                  <div className={cn("grid gap-6", visualFirst && "xl:grid-cols-[minmax(0,1.35fr)_17rem] xl:items-start")}>
                    <div>
                      <p className="max-w-3xl text-[1.08rem] leading-[1.75] text-white/90">{question.text}</p>
                    </div>
                    {visualFirst && <ReservedVisualSlot question={question} />}
                  </div>

                  {!visualFirst && question.visualSlot && <div className="mt-5"><ReservedVisualSlot question={question} /></div>}

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {options.map((option, optionIndex) => {
                      const optionKey = question.type === "aptitude" ? ["A", "B", "C", "D"][optionIndex] : PSYCHOMETRIC_OPTIONS[optionIndex].value;
                      const isSelected = state.answers[question.id] === optionKey;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setAnswer(question.id, optionKey)}
                          className={cn(
                            "group rounded-[22px] border px-4 py-4 text-left transition-all duration-200",
                            "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20",
                            isSelected && "border-[hsl(var(--lavender)/0.5)] bg-[hsl(var(--lavender)/0.14)] shadow-[0_0_0_1px_rgba(160,140,255,0.2)]",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <span className={cn(
                              "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                              isSelected ? "border-[hsl(var(--lavender)/0.6)] bg-[hsl(var(--lavender)/0.18)] text-white" : "border-white/12 bg-white/[0.04] text-white/70",
                            )}>
                              {optionKey}
                            </span>
                            <span className="text-sm leading-6 text-white/82">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}

            <div className="glass rounded-[28px] border border-white/10 px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center justify-between gap-3">
                <Button type="button" variant="outline" onClick={goPrev} disabled={page === 0 || submitting} className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white">
                  <ChevronLeft size={18} />
                  Previous
                </Button>

                <Button
                  type="button"
                  onClick={goNext}
                  disabled={!allAnswered || submitting}
                  className="rounded-full px-6 gradient-accent text-primary-foreground hover:opacity-95 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : isLastPage ? <Send size={18} /> : <ChevronRight size={18} />}
                  {submitting ? "Submitting..." : isLastPage ? "Submit assessment" : "Next page"}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessment;
