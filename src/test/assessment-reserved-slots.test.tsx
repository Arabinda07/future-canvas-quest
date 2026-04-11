import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AssessmentProvider } from "@/context/AssessmentContext";
import Assessment from "@/pages/Assessment";

const STORAGE_KEY = "nextstep-assessment";

const baseStudentData = {
  name: "Test Student",
  currentClass: "IX",
  email: "test@example.com",
  counselorCode: "ABC123",
  consent: true,
};

const answeredUpToTen = {
  Q1: "A",
  Q2: "B",
  Q3: "C",
  Q4: "D",
  Q5: "A",
  Q6: "B",
  Q7: "C",
  Q8: "D",
  Q9: "A",
  Q10: "B",
};

const seedAssessmentState = (overrides: Record<string, unknown>) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      studentData: baseStudentData,
      answers: {},
      currentPage: 0,
      introAccepted: false,
      ...overrides,
    }),
  );
};

const renderAssessment = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AssessmentProvider>
          <MemoryRouter
            initialEntries={["/assessment"]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/register" element={<div>Register page</div>} />
              <Route path="/success" element={<div>Success page</div>} />
            </Routes>
          </MemoryRouter>
        </AssessmentProvider>
      </TooltipProvider>
    </QueryClientProvider>,
  );
};

describe("Assessment intro and reserved visual slots", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("requires confirming the intro instructions before starting", () => {
    seedAssessmentState({ introAccepted: false });
    renderAssessment();

    const startButton = screen.getByRole("button", { name: /^Start test$/i });
    expect(startButton).toBeDisabled();

    const confirmation = screen.getByLabelText("I have read the instructions.");
    fireEvent.click(confirmation);

    expect(startButton).toBeEnabled();
    expect(screen.getByRole("heading", { name: /Read this once/i })).toBeInTheDocument();
  });

  it("shows a dedicated start screen before any question content", () => {
    seedAssessmentState({ introAccepted: false });
    renderAssessment();

    expect(screen.getByRole("heading", { name: "General Instructions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Section A — Aptitude & Logical Reasoning" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Section B — Interests & Personality" })).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === "Sections: 2 · Questions: 70 · Scored: 20 · Profile: 50 · Time: 60 min"),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === "20 MCQs (Q1–Q20)"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Q1")).not.toBeInTheDocument();
  });

  it("renders reserved slots for an in-progress aptitude page", async () => {
    seedAssessmentState({
      studentData: {
        ...baseStudentData,
        currentClass: "XI",
      },
      answers: answeredUpToTen,
      currentPage: 2,
      introAccepted: true,
    });
    renderAssessment();

    expect(await screen.findByText("Q11")).toBeInTheDocument();
    expect(screen.getByText("Q13")).toBeInTheDocument();
    expect(screen.getByText("Q14")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Reasoning and verbal ability" })).toBeInTheDocument();
    expect(
      screen.getAllByText((_, element) => element?.textContent === "Q 11–15 of 70").length,
    ).toBeGreaterThan(0);

    expect(screen.getByLabelText("Reserved direction diagram slot")).toBeInTheDocument();
    expect(screen.getByLabelText("Reserved mirror-image visual slot")).toBeInTheDocument();
    expect(screen.getByLabelText("Reserved water-image visual slot")).toBeInTheDocument();

    expect(screen.queryByText(/Question image failed to load/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(screen.getByText("A. N")).toBeInTheDocument();
    expect(screen.queryByText("Q21")).not.toBeInTheDocument();
  });

  it("keeps side and below slot intent explicit for responsive layouts", async () => {
    seedAssessmentState({
      studentData: {
        ...baseStudentData,
        currentClass: "XI",
      },
      answers: answeredUpToTen,
      currentPage: 2,
      introAccepted: true,
    });
    renderAssessment();

    const q11Card = await screen.findByTestId("question-card-Q11");
    const q13Card = screen.getByTestId("question-card-Q13");
    const q14Card = screen.getByTestId("question-card-Q14");

    expect(within(q11Card).getByLabelText("Reserved direction diagram slot")).toHaveClass("relative");
    expect(within(q11Card).getByLabelText("Reserved direction diagram slot")).toHaveAttribute("data-placement", "side");
    expect(within(q13Card).getByLabelText("Reserved mirror-image visual slot")).toHaveAttribute("data-placement", "below");
    expect(within(q14Card).getByLabelText("Reserved water-image visual slot")).toHaveAttribute("data-placement", "below");
  });

  it("shows the same first visible assessment page for classes IX and XI with full-flow progress copy", async () => {
    seedAssessmentState({
      studentData: {
        ...baseStudentData,
        currentClass: "IX",
      },
      answers: answeredUpToTen,
      currentPage: 0,
      introAccepted: true,
    });
    renderAssessment();

    expect(await screen.findByTestId("question-card-Q1")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-Q5")).toBeInTheDocument();
    expect(
      screen.getAllByText((_, element) => element?.textContent === "Q 1–5 of 70").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("10 answered")).toBeInTheDocument();

    cleanup();

    seedAssessmentState({
      studentData: {
        ...baseStudentData,
        currentClass: "XI",
      },
      answers: answeredUpToTen,
      currentPage: 0,
      introAccepted: true,
    });
    renderAssessment();

    expect(await screen.findByTestId("question-card-Q1")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-Q5")).toBeInTheDocument();
    expect(screen.queryByTestId("question-card-Q11")).not.toBeInTheDocument();
    expect(
      screen.getAllByText((_, element) => element?.textContent === "Q 1–5 of 70").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("10 answered")).toBeInTheDocument();
  });
});
