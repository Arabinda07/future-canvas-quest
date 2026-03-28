import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/context/AssessmentContext";
import { questions, QUESTIONS_PER_PAGE, TOTAL_PAGES, TOTAL_QUESTIONS } from "@/data/questions";
import { cn } from "@/lib/utils";

const LIKERT_OPTIONS = [
  { value: "1", label: "Strongly Disagree", emoji: "😟" },
  { value: "2", label: "Disagree", emoji: "🙁" },
  { value: "3", label: "Neutral", emoji: "😐" },
  { value: "4", label: "Agree", emoji: "🙂" },
  { value: "5", label: "Strongly Agree", emoji: "😊" },
];

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
  const allAnswered = pageQuestions.every((q) => state.answers[q.id]);
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
    await new Promise((r) => setTimeout(r, 2000));
    setCompleted();
    clearState();
    navigate("/success");
  };

  const qStart = startIdx + 1;
  const qEnd = Math.min(startIdx + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 glass border-b px-5 py-3 space-y-2">
        <div className="flex items-center justify-between text-sm max-w-xl mx-auto">
          <span className="font-heading font-bold text-foreground">NextStep</span>
          <span className="text-muted-foreground font-medium text-xs bg-muted rounded-full px-3 py-1">
            Q {qStart}–{qEnd} of {TOTAL_QUESTIONS}
          </span>
        </div>
        <div className="max-w-xl mx-auto w-full">
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-accent"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-muted-foreground font-medium">{answeredCount} answered</span>
            <span className="text-[11px] font-semibold text-accent">{progress}%</span>
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
          className="flex-1 px-5 py-6 max-w-xl mx-auto w-full space-y-5"
        >
          {pageQuestions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card rounded-2xl border border-border shadow-card p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-accent-foreground bg-accent/90 rounded-md px-2 py-0.5 uppercase tracking-wide">
                  {q.id}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {q.type === "aptitude" ? "Aptitude" : "Personality"}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-4 leading-relaxed">{q.text}</p>

              {q.type === "aptitude" && q.options ? (
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const val = String.fromCharCode(65 + oi);
                    const selected = state.answers[q.id] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => setAnswer(q.id, val)}
                        className={cn(
                          "w-full min-h-[48px] text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                          selected
                            ? "bg-lavender-light border-primary text-foreground shadow-sm"
                            : "bg-background border-transparent hover:border-border text-foreground"
                        )}
                      >
                        <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold mr-3", selected ? "gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>
                          {val}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {LIKERT_OPTIONS.map((opt) => {
                    const selected = state.answers[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setAnswer(q.id, opt.value)}
                        className={cn(
                          "w-full min-h-[48px] text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-3",
                          selected
                            ? "bg-lavender-light border-primary text-foreground shadow-sm"
                            : "bg-background border-transparent hover:border-border text-foreground"
                        )}
                      >
                        <span className="text-lg">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="sticky bottom-0 z-20 glass border-t px-5 py-4">
        <div className="flex gap-3 max-w-xl mx-auto">
          <Button variant="outline" className="flex-1 min-h-[52px] rounded-full font-semibold" onClick={goPrev} disabled={page === 0}>
            <ChevronLeft size={18} /> Previous
          </Button>
          <Button
            className={cn(
              "flex-1 min-h-[52px] rounded-full font-bold gap-2 border-0 text-accent-foreground",
              isLastPage ? "gradient-hero" : "gradient-accent glow-lavender"
            )}
            onClick={goNext}
            disabled={!allAnswered || submitting}
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isLastPage ? (
              <>Submit & Generate <Send size={16} /></>
            ) : (
              <>Next <ChevronRight size={18} /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
