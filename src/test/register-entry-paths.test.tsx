import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AssessmentProvider } from "@/context/AssessmentContext";
import Register from "@/pages/Register";

const STORAGE_KEY = "fcq.assessmentSessions";

const renderRegister = () =>
  render(
    <AssessmentProvider>
      <MemoryRouter initialEntries={["/register"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/assessment" element={<div>Assessment page</div>} />
        </Routes>
      </MemoryRouter>
    </AssessmentProvider>,
  );

describe("register entry paths", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("lets a self-serve student continue without a counselor code", async () => {
    renderRegister();

    fireEvent.change(screen.getByLabelText(/first name or nickname/i), { target: { value: "Asha" } });
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByText("Class X"));
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /begin assessment/i }));

    expect(await screen.findByText("Assessment page")).toBeInTheDocument();

    await waitFor(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();

      const sessions = JSON.parse(raw ?? "{}") as Record<string, { studentClass: string; entryPath: string; counselorId?: string }>;
      const session = Object.values(sessions)[0];

      expect(session).toMatchObject({
        studentClass: "X",
        entryPath: "self-serve",
      });
      expect(session.counselorId).toBeUndefined();
    });
  });

  it("maps a counselor code to the school-issued entry path", async () => {
    renderRegister();

    fireEvent.change(screen.getByLabelText(/first name or nickname/i), { target: { value: "Asha" } });
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByText("Class X"));
    fireEvent.change(screen.getByLabelText(/school \/ counselor code/i), { target: { value: "SCH-1234" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /begin assessment/i }));

    expect(await screen.findByText("Assessment page")).toBeInTheDocument();

    await waitFor(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();

      const sessions = JSON.parse(raw ?? "{}") as Record<string, { studentClass: string; entryPath: string }>;
      const session = Object.values(sessions)[0];

      expect(session).toMatchObject({
        studentClass: "X",
        entryPath: "school-issued",
      });
    });
  });
});
