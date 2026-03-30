import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/context/AssessmentContext";
import { questions, QUESTIONS_PER_PAGE, TOTAL_PAGES, TOTAL_QUESTIONS } from "@/data/questions";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const PSYCHOMETRIC_OPTIONS = [
  { value: "A", label: "Strongly Agree" },
  { value: "B", label: "Agree" },
  { value: "C", label: "Disagree" },
  { value: "D", label: "Strongly Disagree" },
];

const QuestionImage = ({ src, alt }: { src: string; alt: string }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-dashed border-amber-400/50 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
        <AlertCircle size={14} className="shrink-0" />
        Question image failed to load. Check the local asset reference.
      </div>
    );
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-border bg-muted/30">
      <img src={src} alt={alt} loading="lazy" className="max-h-[340px] w-full object-contain" onError={() => setFailed(true)} />
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

  const qStart = startIdx + 1;
  const qEnd = Math.min(startIdx + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="sticky top-0 z-20 glass border-b px-5 py-3 space-y-2">
        <div className="flex items-center justify-between text-sm max-w-xl mx-auto">
          <span className="font-heading font-bold text-foreground">Future Canvas</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium text-xs bg-muted rounded-full px-3 py-1">
              Q {qStart}–{qEnd} of {TOTAL_QUESTIONS}
            </span>
            <ThemeToggle />
          </div>
        </div>
        <div className="max-w-xl mx-auto w-full">
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full gradient-accent" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-muted-foreground font-medium">{answeredCount} answered</span>
            <span className="text-[11px] font-semibold text-accent">{progress}%</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={page} custom={direction} initial={{ x: direction * 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: direction * -40, opacity: 0 }} transition={{ duration: 0.25 }} className="flex-1 px-5 py-6 max-w-xl mx-auto w-full space-y-5">
          {pageQuestions.map((question, index) => (
            <motion.div key={question.id} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.05 }} className="bg-card rounded-2xl border border-border shadow-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-accent-foreground bg-accent/90 rounded-md px-2 py-0.5 uppercase tracking-wide">{question.id}</span>
                <span className="text-[11px] text-muted-foreground font-medium">{question.type === "aptitude" ? "Aptitude" : "Interests & Personality"}</span>
              </div>

              <p className="text-sm font-semibold text-foreground mb-4 leading-relaxed">{question.text}</p>

              {question.image ? <QuestionImage src={question.image} alt={question.imageAlt ?? `Question visual for ${question.id}`} /> : null}

              {question.type === "aptitude" && question.options ? (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const value = String.fromCharCode(65 + optionIndex);
                    const selected = state.answers[question.id] === value;

                    return (
                      <button key={value} onClick={() => setAnswer(question.id, value)} className={cn("w-full min-h-[48px] text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200", selected ? "bg-lavender-light border-primary text-foreground shadow-sm" : "bg-background border-transparent hover:border-border text-foreground")}>
                        <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold mr-3", selected ? "gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>{value}</span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {PSYCHOMETRIC_OPTIONS.map((option) => {
                    const selected = state.answers[question.id] === option.value;

                    return (
                      <button key={option.value} onClick={() => setAnswer(question.id, option.value)} className={cn("w-full min-h-[48px] text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-3", selected ? "bg-lavender-light border-primary text-foreground shadow-sm" : "bg-background border-transparent hover:border-border text-foreground")}>
                        <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold", selected ? "gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>{option.value}</span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="sticky bottom-0 z-20 glass border-t px-5 py-4">
        <div className="flex gap-3 max-w-xl mx-auto">
          <Button variant="outline" className="flex-1 min-h-[52px] rounded-full font-semibold" onClick={goPrev} disabled={page === 0}>
            <ChevronLeft size={18} /> Previous
          </Button>
          <Button className={cn("flex-1 min-h-[52px] rounded-full font-bold gap-2 border-0 text-accent-foreground", isLastPage ? "gradient-hero" : "gradient-accent glow-lavender")} onClick={goNext} disabled={!allAnswered || submitting}>
            {submitting ? <Loader2 size={18} className="animate-spin" /> : isLastPage ? <>Submit & Generate <Send size={16} /></> : <>Next <ChevronRight size={18} /></>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
