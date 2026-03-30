import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AssessmentProvider } from "@/context/AssessmentContext";
import Assessment from "@/pages/Assessment";

const STORAGE_KEY = "nextstep-assessment";

const renderAssessment = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AssessmentProvider>
          <MemoryRouter initialEntries={["/assessment"]}>
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

describe("Assessment reserved visual slots", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        studentData: {
          name: "Test Student",
          currentClass: "10",
          email: "test@example.com",
          counselorCode: "ABC123",
          consent: true,
        },
        answers: {
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
        },
        currentPage: 2,
        completed: false,
      }),
    );
  });

  it("renders reserved slots for Q11, Q13, and Q14 without error copy", async () => {
    renderAssessment();

    expect(await screen.findByText("Q11")).toBeInTheDocument();
    expect(screen.getByText("Q13")).toBeInTheDocument();
    expect(screen.getByText("Q14")).toBeInTheDocument();

    expect(screen.getByLabelText("Reserved direction diagram slot")).toBeInTheDocument();
    expect(screen.getByLabelText("Reserved mirror-image visual slot")).toBeInTheDocument();
    expect(screen.getByLabelText("Reserved water-image visual slot")).toBeInTheDocument();

    expect(screen.queryByText(/Question image failed to load/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(screen.getByText("A. N")).toBeInTheDocument();
    expect(screen.queryByText("Q21")).not.toBeInTheDocument();
  });
});
