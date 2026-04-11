import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";
import type { Report, StudentClass } from "@/domain/types";
import {
  clearCounselorAccessSession,
  loadCounselorAccessSession,
  saveCounselorAccessSession,
} from "@/features/counselor/accessSession";

const validateCounselorAccess = vi.fn();
const fetchCounselorDashboardData = vi.fn();
const fetchCounselorReport = vi.fn();

vi.mock("@/lib/backend/counselorGateway", () => ({
  validateCounselorAccess: (...args: unknown[]) => validateCounselorAccess(...args),
  fetchCounselorDashboardData: (...args: unknown[]) => fetchCounselorDashboardData(...args),
  fetchCounselorReport: (...args: unknown[]) => fetchCounselorReport(...args),
}));

function buildReport(overrides?: Partial<Report>): Report {
  return {
    id: "report-2",
    sessionId: "session-2",
    studentId: "student-2",
    generatedAt: "2026-04-11",
    cover: {
      title: "CAREER CLARITY REPORT",
      subtitle: "An Analysis of Aptitude, Interests, and Personality for Career Exploration",
      studentName: "Aarav Mehta",
      rollNo: "12",
      class: "XI" as StudentClass,
      section: "B",
      school: "Future Canvas Public School",
      date: "2026-04-11",
    },
    snapshot: {
      topAptitude: { code: "V", label: "Verbal Aptitude", raw: 2, maxRaw: 6, scaled: 33 },
      topInterests: [
        { code: "R", label: "Realistic", raw: 15, maxRaw: 15, scaled: 100 },
        { code: "I", label: "Investigative", raw: 12, maxRaw: 15, scaled: 80 },
      ],
      dominantPersonalityTrait: {
        code: "O",
        label: "Openness",
        score: 75,
        direction: "High",
        distanceFromMidpoint: 25,
      },
      topRecommendedStream: {
        code: "Humanities",
        label: "Humanities",
        score: 88,
        confidence: "High",
      },
      atAGlance: [
        "Top Aptitude: Verbal Aptitude (33%)",
        "Top 2 Interests: Realistic and Investigative",
        "Dominant Personality Trait: Openness (High, 75%)",
        "Top Recommended Stream: Humanities (High confidence)",
      ],
    },
    scoring: {
      aptitude: {
        N: { code: "N", label: "Numerical Aptitude", raw: 1, maxRaw: 7, scaled: 14 },
        L: { code: "L", label: "Logical Aptitude", raw: 1, maxRaw: 7, scaled: 14 },
        V: { code: "V", label: "Verbal Aptitude", raw: 2, maxRaw: 6, scaled: 33 },
      },
      interests: {
        R: { code: "R", label: "Realistic", raw: 15, maxRaw: 15, scaled: 100 },
        I: { code: "I", label: "Investigative", raw: 12, maxRaw: 15, scaled: 80 },
        A: { code: "A", label: "Artistic", raw: 9, maxRaw: 15, scaled: 60 },
        S: { code: "S", label: "Social", raw: 6, maxRaw: 15, scaled: 40 },
        E: { code: "E", label: "Enterprising", raw: 3, maxRaw: 15, scaled: 20 },
        C: { code: "C", label: "Conventional", raw: 3, maxRaw: 15, scaled: 20 },
      },
      personality: {
        O: { code: "O", label: "Openness", raw: 9, maxRaw: 12, scaled: 75 },
        Co: { code: "Co", label: "Conscientiousness", raw: 4, maxRaw: 12, scaled: 33 },
        Ex: { code: "Ex", label: "Extraversion", raw: 5, maxRaw: 12, scaled: 42 },
        Ag: { code: "Ag", label: "Agreeableness", raw: 6, maxRaw: 12, scaled: 50 },
        Ne: { code: "Ne", label: "Neuroticism", raw: 9, maxRaw: 12, scaled: 75 },
      },
      streams: {
        Science: { code: "Science", label: "Science", score: 40 },
        Commerce: { code: "Commerce", label: "Commerce", score: 52 },
        Humanities: { code: "Humanities", label: "Humanities", score: 88 },
      },
      rankedStreams: [
        { code: "Humanities", label: "Humanities", score: 88 },
        { code: "Commerce", label: "Commerce", score: 52 },
        { code: "Science", label: "Science", score: 40 },
      ],
      topStream: { code: "Humanities", label: "Humanities", score: 88 },
      confidence: "High",
      flags: ["HIGH_NEUROTICISM", "LOW_CONSCIENTIOUSNESS"],
      dominantPersonalityTrait: {
        code: "O",
        label: "Openness",
        score: 75,
        direction: "High",
        distanceFromMidpoint: 25,
      },
    },
    aptitudeTable: [],
    interestInsights: [],
    bigFive: [],
    streamTable: [],
    whyBestFit: [
      "Sentence 1.",
      "Sentence 2.",
      "Sentence 3.",
      "Sentence 4.",
      "Sentence 5.",
    ],
    quickActions: [
      "Choose elective combinations that keep Psychology, Sociology, or Political Science open.",
      "Pick a CBSE project using interviews, writing, surveys, or field observation.",
      "Enter debates, MUNs, writing contests, or social innovation challenges.",
    ],
    careerClusters: [],
    counselling: {
      summary: "Supportive follow-up on the flagged areas below can strengthen the student's decision process.",
      flags: [
        {
          flag: "HIGH_NEUROTICISM",
          score: 75,
          empatheticFraming: "This may reflect high emotional sensitivity, especially during pressure or uncertainty.",
          supportiveNextStep: "Use check-ins, stress-management routines, and smaller milestones during important academic decisions.",
        },
      ],
    },
    disclaimer: "Disclaimer text",
    ...overrides,
  };
}

describe("Counselor access flow", () => {
  beforeEach(() => {
    localStorage.clear();
    validateCounselorAccess.mockReset();
    fetchCounselorDashboardData.mockReset();
    fetchCounselorReport.mockReset();
    clearCounselorAccessSession();
  });

  it("redirects dashboard visitors without a counselor access session back to login", async () => {
    window.history.pushState({}, "", "/counselor/dashboard");

    render(<App />);

    expect(await screen.findByRole("heading", { name: /counselor sign-in/i })).toBeInTheDocument();
  });

  it("accepts invite-link tokens, stores access, and opens the counselor dashboard", async () => {
    validateCounselorAccess.mockResolvedValue({
      valid: true,
      batchCode: "KVKGP2025",
      schoolName: "KV No. 2, Kharagpur",
      validUntil: "2026-12-31T00:00:00.000Z",
    });
    fetchCounselorDashboardData.mockResolvedValue({
      schoolName: "KV No. 2, Kharagpur",
      batchCode: "KVKGP2025",
      validUntil: "2026-12-31T00:00:00.000Z",
      metrics: {
        invited: 120,
        started: 94,
        completed: 88,
        reportReady: 88,
      },
      reports: [
        {
          reportId: "report-2",
          studentName: "Aarav Mehta",
          className: "XI",
          section: "B",
          schoolName: "KV No. 2, Kharagpur",
          sessionId: "session-2",
          generatedAt: "2026-04-11",
        },
      ],
    });

    window.history.pushState({}, "", "/counselor/login?batch=KVKGP2025&token=invite-secret");

    render(<App />);

    expect(await screen.findByRole("heading", { name: /counselor dashboard/i })).toBeInTheDocument();
    expect(await screen.findByText("KV No. 2, Kharagpur")).toBeInTheDocument();

    await waitFor(() => {
      expect(loadCounselorAccessSession()).toMatchObject({
        batchCode: "KVKGP2025",
        adminToken: "invite-secret",
      });
    });
  });

  it("renders batch-scoped reports for an already validated counselor session", async () => {
    saveCounselorAccessSession({
      batchCode: "KVKGP2025",
      adminToken: "invite-secret",
      schoolName: "KV No. 2, Kharagpur",
      validUntil: "2026-12-31T00:00:00.000Z",
    });
    fetchCounselorDashboardData.mockResolvedValue({
      schoolName: "KV No. 2, Kharagpur",
      batchCode: "KVKGP2025",
      validUntil: "2026-12-31T00:00:00.000Z",
      metrics: {
        invited: 120,
        started: 94,
        completed: 88,
        reportReady: 88,
      },
      reports: [
        {
          reportId: "report-2",
          studentName: "Aarav Mehta",
          className: "XI",
          section: "B",
          schoolName: "KV No. 2, Kharagpur",
          sessionId: "session-2",
          generatedAt: "2026-04-11",
        },
      ],
    });

    window.history.pushState({}, "", "/counselor/dashboard");

    render(<App />);

    expect(await screen.findByText("Aarav Mehta")).toBeInTheDocument();
    expect(screen.queryByText("Zoya Khan")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open report/i })).toHaveAttribute("href", "/counselor/reports/report-2");
  });

  it("blocks counselor report access when the backend denies the report for that batch", async () => {
    saveCounselorAccessSession({
      batchCode: "KVKGP2025",
      adminToken: "invite-secret",
      schoolName: "KV No. 2, Kharagpur",
      validUntil: "2026-12-31T00:00:00.000Z",
    });
    fetchCounselorReport.mockResolvedValue(null);

    window.history.pushState({}, "", "/counselor/reports/report-3");

    render(<App />);

    expect(await screen.findByRole("heading", { name: /report not available/i })).toBeInTheDocument();
    expect(screen.getByText(/only school-issued student reports can be opened/i)).toBeInTheDocument();
  });

  it("renders a validated batch-scoped counselor report", async () => {
    saveCounselorAccessSession({
      batchCode: "KVKGP2025",
      adminToken: "invite-secret",
      schoolName: "KV No. 2, Kharagpur",
      validUntil: "2026-12-31T00:00:00.000Z",
    });
    fetchCounselorReport.mockResolvedValue(buildReport());

    window.history.pushState({}, "", "/counselor/reports/report-2");

    render(<App />);

    expect(await screen.findByRole("heading", { name: /career clarity report/i })).toBeInTheDocument();
    expect(screen.getByText("Aarav Mehta")).toBeInTheDocument();
    expect(screen.getByText("session-2")).toBeInTheDocument();
  });
});
