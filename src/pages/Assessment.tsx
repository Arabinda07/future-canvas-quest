import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/context/AssessmentContext";
import { questions, QUESTIONS_PER_PAGE, TOTAL_PAGES, TOTAL_QUESTIONS } from "@/data/questions";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LIKERT_OPTIONS = [
  { value: "1", label: "1 — Strongly Disagree" },
  { value: "2", label: "2 — Disagree" },
  { value: "3", label: "3 — Neutral" },
  { value: "4", label: "4 — Agree" },
  { value: "5", label: "5 — Strongly Agree" },
];

const Assessment = () => {
  const navigate = useNavigate();
  const { state, setAnswer, setCurrentPage, clearState, setCompleted } = useAssessment();
  const [submitting, setSubmitting] = useState(false);

  // Redirect if no registration data
  useEffect(() => {
    if (!state.studentData.name && !state.completed) {
      navigate("/register");
    }
    if (state.completed) {
      navigate("/success");
    }
  }, [state.studentData.name, state.completed, navigate]);

  const page = state.currentPage;
  const startIdx = page * QUESTIONS_PER_PAGE;
  const pageQuestions = questions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);
  const isLastPage = page === TOTAL_PAGES - 1;

  const allAnswered = pageQuestions.every((q) => state.answers[q.id]);

  const progress = Math.round(
    (Object.keys(state.answers).length / TOTAL_QUESTIONS) * 100
  );

  const goNext = () => {
    if (isLastPage) {
      handleSubmit();
    } else {
      setCurrentPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    if (page > 0) {
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
    <div className="min-h-screen flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-card border-b px-5 py-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-heading font-semibold text-primary">NextStep</span>
          <span className="text-muted-foreground">
            Q {qStart}–{qEnd} of {TOTAL_QUESTIONS}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">{progress}% complete</p>
      </div>

      {/* Questions */}
      <div className="flex-1 px-5 py-6 max-w-lg mx-auto w-full space-y-5">
        {pageQuestions.map((q, idx) => (
          <div key={q.id} className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
            <p className="text-xs font-medium text-accent mb-2">{q.id}</p>
            <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">{q.text}</p>

            {q.type === "aptitude" && q.options ? (
              <div className="space-y-2.5">
                {q.options.map((opt, oi) => {
                  const val = String.fromCharCode(65 + oi);
                  const selected = state.answers[q.id] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setAnswer(q.id, val)}
                      className={cn(
                        "w-full min-h-[48px] text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all",
                        selected
                          ? "bg-teal-light border-primary text-primary ring-1 ring-primary"
                          : "bg-background border-border text-foreground hover:border-accent"
                      )}
                    >
                      <span className="font-semibold mr-2">{val}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2.5">
                {LIKERT_OPTIONS.map((opt) => {
                  const selected = state.answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setAnswer(q.id, opt.value)}
                      className={cn(
                        "w-full min-h-[48px] text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all",
                        selected
                          ? "bg-teal-light border-primary text-primary ring-1 ring-primary"
                          : "bg-background border-border text-foreground hover:border-accent"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-card border-t px-5 py-4">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button variant="outline" className="flex-1 min-h-[48px]" onClick={goPrev} disabled={page === 0}>
            <ChevronLeft size={18} /> Previous
          </Button>
          <Button className="flex-1 min-h-[48px] font-semibold" onClick={goNext} disabled={!allAnswered || submitting}>
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isLastPage ? (
              "Submit & Generate Report"
            ) : (
              <>
                Next <ChevronRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
