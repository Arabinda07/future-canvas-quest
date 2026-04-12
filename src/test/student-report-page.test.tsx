import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { buildAssessmentReport } from "@/domain/reportBuilder";
import StudentReport from "@/pages/StudentReport";

const STORAGE_KEY = "fcq.reports";
const fetchStudentReportFromBackend = vi.fn();
const createReportPaymentLink = vi.fn();
const redirectToPaymentUrl = vi.fn();

vi.mock("@/lib/backend/assessmentGateway", async () => {
  const actual = await vi.importActual<typeof import("@/lib/backend/assessmentGateway")>("@/lib/backend/assessmentGateway");
  return {
    ...actual,
    fetchStudentReportFromBackend: (...args: unknown[]) => fetchStudentReportFromBackend(...args),
    createReportPaymentLink: (...args: unknown[]) => createReportPaymentLink(...args),
    redirectToPaymentUrl: (...args: unknown[]) => redirectToPaymentUrl(...args),
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
    createReportPaymentLink.mockReset();
    redirectToPaymentUrl.mockReset();
  });

  it("does not expose a cached full report when the private access token is missing", async () => {
    const report = seedReport("report-1");

    renderStudentReport("/report/report-1");

    expect(await screen.findByRole("heading", { name: /report link incomplete/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: report.cover.title })).not.toBeInTheDocument();
    expect(screen.queryByText(report.cover.studentName)).not.toBeInTheDocument();
  });

  it("shows a friendly not-found state when the report id is missing", async () => {
    renderStudentReport("/report/missing-report");

    expect(await screen.findByRole("heading", { name: /report link incomplete/i })).toBeInTheDocument();
    expect(screen.getByText(/private access token/i)).toBeInTheDocument();
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
    fetchStudentReportFromBackend.mockResolvedValue({ reportLocked: false, report });

    renderStudentReport("/report/report-remote?token=student-report-token");

    expect(await screen.findByRole("heading", { name: report.cover.title })).toBeInTheDocument();
    expect(fetchStudentReportFromBackend).toHaveBeenCalledWith("report-remote", "student-report-token");
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");
    expect(screen.getByText("Zoya Khan")).toBeInTheDocument();
  });

  it("shows the Rs 99 paywall for locked self-serve reports and starts Razorpay checkout", async () => {
    fetchStudentReportFromBackend.mockResolvedValue({
      reportId: "report-locked",
      reportLocked: true,
      payment: {
        amountInPaise: 9900,
        currency: "INR",
        displayAmount: "Rs 99",
      },
    });
    createReportPaymentLink.mockResolvedValue({ paymentUrl: "https://rzp.io/i/report-lock" });

    renderStudentReport("/report/report-locked?token=student-report-token");

    expect(await screen.findByRole("heading", { name: /unlock your full career clarity report/i })).toBeInTheDocument();
    expect(screen.getByText("Rs 99")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");

    fireEvent.click(screen.getByRole("button", { name: /pay rs 99 and unlock/i }));

    await waitFor(() => {
      expect(createReportPaymentLink).toHaveBeenCalledWith("report-locked", "student-report-token", expect.any(String));
      expect(redirectToPaymentUrl).toHaveBeenCalledWith("https://rzp.io/i/report-lock");
    });
  });

  it("treats malformed report ids as invalid and offers a restart path", async () => {
    renderStudentReport("/report/%20%20");

    expect(await screen.findByRole("heading", { name: /report link incomplete/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to registration/i })).toHaveAttribute("href", "/register");
  });
});
