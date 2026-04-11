import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "@/App";

const validateCounselorAccess = vi.fn();
const fetchCounselorDashboardData = vi.fn();
const fetchCounselorReport = vi.fn();
const submitCounselorRegistration = vi.fn();
const listCounselorRegistrationRequests = vi.fn();
const approveCounselorRegistration = vi.fn();
const rejectCounselorRegistration = vi.fn();

vi.mock("@/lib/backend/counselorGateway", () => ({
  validateCounselorAccess: (...args: unknown[]) => validateCounselorAccess(...args),
  fetchCounselorDashboardData: (...args: unknown[]) => fetchCounselorDashboardData(...args),
  fetchCounselorReport: (...args: unknown[]) => fetchCounselorReport(...args),
  submitCounselorRegistration: (...args: unknown[]) => submitCounselorRegistration(...args),
  listCounselorRegistrationRequests: (...args: unknown[]) => listCounselorRegistrationRequests(...args),
  approveCounselorRegistration: (...args: unknown[]) => approveCounselorRegistration(...args),
  rejectCounselorRegistration: (...args: unknown[]) => rejectCounselorRegistration(...args),
}));

describe("counselor registration and invite issuance", () => {
  beforeEach(() => {
    localStorage.clear();
    validateCounselorAccess.mockReset();
    fetchCounselorDashboardData.mockReset();
    fetchCounselorReport.mockReset();
    submitCounselorRegistration.mockReset();
    listCounselorRegistrationRequests.mockReset();
    approveCounselorRegistration.mockReset();
    rejectCounselorRegistration.mockReset();

    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("opens counselor login from the landing header", async () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /counselor login/i }));

    expect(await screen.findByRole("heading", { name: /counselor sign-in/i })).toBeInTheDocument();
  });

  it("submits a public counselor registration request without minting an invite token", async () => {
    submitCounselorRegistration.mockResolvedValue({
      requestId: "request-1",
      status: "pending",
    });
    window.history.pushState({}, "", "/counselor/register");

    render(<App />);

    fireEvent.change(await screen.findByLabelText(/counselor name/i), { target: { value: "Nisha Rao" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "nisha@example.com" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByLabelText(/school name/i), { target: { value: "Future Canvas School" } });
    fireEvent.change(screen.getByLabelText(/school city/i), { target: { value: "Kolkata" } });
    fireEvent.change(screen.getByLabelText(/expected students/i), { target: { value: "120" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "We want to run this for Class X." } });
    fireEvent.click(screen.getByRole("button", { name: /submit registration request/i }));

    await waitFor(() => {
      expect(submitCounselorRegistration).toHaveBeenCalledWith({
        counselorName: "Nisha Rao",
        email: "nisha@example.com",
        phone: "9876543210",
        schoolName: "Future Canvas School",
        schoolCity: "Kolkata",
        expectedStudentCount: 120,
        message: "We want to run this for Class X.",
      });
    });
    expect(await screen.findByText(/request is pending review/i)).toBeInTheDocument();
    expect(screen.queryByText(/admin token/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/dashboard\?batch=/i)).not.toBeInTheDocument();
  });

  it("lets an admin approve a pending counselor request and copy the generated invite URL", async () => {
    listCounselorRegistrationRequests.mockResolvedValue({
      requests: [
        {
          id: "request-1",
          counselorName: "Nisha Rao",
          email: "nisha@example.com",
          phone: "9876543210",
          schoolName: "Future Canvas School",
          schoolCity: "Kolkata",
          expectedStudentCount: 120,
          message: "We want to run this for Class X.",
          status: "pending",
          createdAt: "2026-04-11T00:00:00.000Z",
        },
      ],
    });
    approveCounselorRegistration.mockResolvedValue({
      requestId: "request-1",
      status: "approved",
      batchCode: "FCS2026",
      adminToken: "fcq_admin_FCS2026_secret",
      inviteUrl: "http://localhost:8080/counselor/dashboard?batch=FCS2026&token=fcq_admin_FCS2026_secret",
    });
    window.history.pushState({}, "", "/admin/counselor-requests");

    render(<App />);

    fireEvent.change(await screen.findByLabelText(/admin approval token/i), { target: { value: "approval-secret" } });
    fireEvent.click(screen.getByRole("button", { name: /load pending requests/i }));

    expect(await screen.findByText("Future Canvas School")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /approve request/i }));

    await waitFor(() => {
      expect(approveCounselorRegistration).toHaveBeenCalledWith({
        requestId: "request-1",
        approvalToken: "approval-secret",
      });
    });
    expect(await screen.findByText("FCS2026")).toBeInTheDocument();
    expect(screen.getByText(/dashboard\?batch=FCS2026/)).toBeInTheDocument();
  });
});
