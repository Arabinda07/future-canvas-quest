import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface StudentData {
  name: string;
  currentClass: string;
  email: string;
  counselorCode: string;
  consent: boolean;
}

export interface AssessmentState {
  studentData: StudentData;
  answers: Record<string, string>;
  currentPage: number;
  completed: boolean;
}

const DEFAULT_STATE: AssessmentState = {
  studentData: { name: "", currentClass: "", email: "", counselorCode: "", consent: false },
  answers: {},
  currentPage: 0,
  completed: false,
};

const STORAGE_KEY = "nextstep-assessment";

function loadState(): AssessmentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_STATE;
}

interface ContextValue {
  state: AssessmentState;
  setStudentData: (data: StudentData) => void;
  setAnswer: (questionId: string, value: string) => void;
  setCurrentPage: (page: number) => void;
  clearState: () => void;
  setCompleted: () => void;
}

const Ctx = createContext<ContextValue | null>(null);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AssessmentState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setStudentData = useCallback((data: StudentData) => {
    setState((s) => ({ ...s, studentData: data }));
  }, []);

  const setAnswer = useCallback((questionId: string, value: string) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [questionId]: value } }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState((s) => ({ ...s, currentPage: page }));
  }, []);

  const clearState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  }, []);

  const setCompleted = useCallback(() => {
    setState((s) => ({ ...s, completed: true }));
  }, []);

  return <Ctx.Provider value={{ state, setStudentData, setAnswer, setCurrentPage, clearState, setCompleted }}>{children}</Ctx.Provider>;
};

export const useAssessment = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAssessment must be within AssessmentProvider");
  return ctx;
};
