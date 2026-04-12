import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AssessmentProvider } from "@/context/AssessmentContext";
import Assessment from "@/pages/Assessment";

const STORAGE_KEY = "nextstep-assessment";

const completeAnswers = Object.fromEntries(
  Array.from({ length: 70 }, (_, index) => [`Q${index + 1}`, "A"]),
);

function seedCompletedAssessmentPage() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      studentData: {
        name: "Test Student",
        currentClass: "IX",
        email: "test@example.com",
        counselorCode: "",
        consent: true,
      },
      answers: completeAnswers,
      currentPage: 13,
      introAccepted: true,
      session: {
        sessionId: "assessment-session-1",
        entryPath: "self-serve",
        campaignId: null,
        submittedReportId: null,
        reportAccessToken: null,
      },
    }),
  );
}

function renderAssessment() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AssessmentProvider>
          <MemoryRouter initialEntries={["/assessment"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/register" element={<div>Register page</div>} />
              <Route path="/report/:reportId" element={<div>Report page</div>} />
            </Routes>
          </MemoryRouter>
        </AssessmentProvider>
      </TooltipProvider>
    </QueryClientProvider>,
  );
}

describe("Assessment submission configuration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not create a local full report when Supabase is unavailable", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    seedCompletedAssessmentPage();
    renderAssessment();

    fireEvent.click(await screen.findByRole("button", { name: /submit assessment/i }));

    expect(await screen.findByText("Submission setup unavailable")).toBeInTheDocument();
    expect(screen.getByText(/Supabase and Razorpay configuration/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(localStorage.getItem("fcq.reports")).toBeNull();
    });
  });
});
