import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { buildAssessmentReport } from "@/domain/reportBuilder";
import StudentReport from "@/pages/StudentReport";

const STORAGE_KEY = "fcq.reports";
const fetchStudentReportFromBackend = vi.fn();

vi.mock("@/lib/backend/assessmentGateway", async () => {
  const actual = await vi.importActual<typeof import("@/lib/backend/assessmentGateway")>("@/lib/backend/assessmentGateway");
  return {
    ...actual,
    fetchStudentReportFromBackend: (...args: unknown[]) => fetchStudentReportFromBackend(...args),
  };
});

function buildAnswers() {
  return Object.fromEntries(Array.from({ length: 70 }, (_, index) => [`Q${index + 1}`, "A"]));
}

function seedReport(reportId: string) {
  const report = buildAssessmentReport({
    id: reportId,
    sessionId: "session-1",
    studentId: "student-1",
    generatedAt: "2026-04-09",
    answers: buildAnswers(),
    student: {
      name: "Aarav Mehta",
      rollNo: "12",
      class: "X",
      section: "B",
      school: "Future Canvas Public School",
    },
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify({ [reportId]: report }));

  return report;
}

function renderStudentReport(initialPath: string) {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MemoryRouter initialEntries={[initialPath]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/report/:reportId" element={<StudentReport />} />
          </Routes>
        </MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>,
  );
}

describe("StudentReport", () => {
  beforeEach(() => {
    localStorage.clear();
    fetchStudentReportFromBackend.mockReset();
  });

  it("renders a saved report from localStorage for the requested report id", async () => {
    const report = seedReport("report-1");

    renderStudentReport("/report/report-1");

    expect(await screen.findByRole("heading", { name: report.cover.title })).toBeInTheDocument();
    expect(screen.getByText(report.cover.studentName)).toBeInTheDocument();
    expect(screen.getByText(report.snapshot.topRecommendedStream.label)).toBeInTheDocument();
    expect(screen.getByText(report.quickActions[0])).toBeInTheDocument();
  });

  it("shows a friendly not-found state when the report id is missing", async () => {
    renderStudentReport("/report/missing-report");

    expect(await screen.findByRole("heading", { name: /report not found/i })).toBeInTheDocument();
    expect(screen.getByText(/We couldn't load this report/i)).toBeInTheDocument();
  });

  it("fetches a server-backed report when a private token is present and local cache is empty", async () => {
    const report = buildAssessmentReport({
      id: "report-remote",
      sessionId: "session-remote",
      studentId: "student-remote",
      generatedAt: "2026-04-09",
      answers: buildAnswers(),
      student: {
        name: "Zoya Khan",
        rollNo: "8",
        class: "XI",
        section: "A",
        school: "Future Canvas Public School",
      },
    });
    fetchStudentReportFromBackend.mockResolvedValue(report);

    renderStudentReport("/report/report-remote?token=student-report-token");

    expect(await screen.findByRole("heading", { name: report.cover.title })).toBeInTheDocument();
    expect(fetchStudentReportFromBackend).toHaveBeenCalledWith("report-remote", "student-report-token");
    expect(screen.getByText("Zoya Khan")).toBeInTheDocument();
  });

  it("treats malformed report ids as invalid and offers a restart path", async () => {
    renderStudentReport("/report/%20%20");

    expect(await screen.findByRole("heading", { name: /report not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to registration/i })).toHaveAttribute("href", "/register");
  });
});
