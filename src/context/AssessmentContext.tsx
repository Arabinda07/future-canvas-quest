import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { EntryPath } from "@/domain/types";

export interface StudentData {
  name: string;
  currentClass: string;
  email: string;
  counselorCode: string;
  consent: boolean;
}

export interface AssessmentSessionMetadata {
  sessionId: string | null;
  entryPath: EntryPath | null;
  campaignId: string | null;
  submittedReportId: string | null;
  reportAccessToken: string | null;
  startedAt: number | null;
}

export interface AssessmentState {
  studentData: StudentData;
  answers: Record<string, string>;
  currentPage: number;
  introAccepted: boolean;
  session: AssessmentSessionMetadata;
}

const DEFAULT_SESSION: AssessmentSessionMetadata = {
  sessionId: null,
  entryPath: null,
  campaignId: null,
  submittedReportId: null,
  reportAccessToken: null,
  startedAt: null,
};

const DEFAULT_STATE: AssessmentState = {
  studentData: { name: "", currentClass: "", email: "", counselorCode: "", consent: false },
  answers: {},
  currentPage: 0,
  introAccepted: false,
  session: DEFAULT_SESSION,
};

const STORAGE_KEY = "nextstep-assessment";

function loadState(): AssessmentState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AssessmentState> & {
        session?: Partial<AssessmentSessionMetadata>;
      };
      return {
        ...DEFAULT_STATE,
        ...parsed,
        studentData: {
          ...DEFAULT_STATE.studentData,
          ...parsed.studentData,
        },
        session: {
          ...DEFAULT_SESSION,
          ...parsed.session,
        },
      };
    }
  } catch (error) {
    console.warn("Failed to load assessment state from localStorage.", error);
  }
  return DEFAULT_STATE;
}

interface ContextValue {
  state: AssessmentState;
  setStudentData: (data: StudentData) => void;
  setSessionMetadata: (metadata: Partial<AssessmentSessionMetadata>) => void;
  setAnswer: (questionId: string, value: string) => void;
  setCurrentPage: (page: number) => void;
  setIntroAccepted: (accepted: boolean) => void;
  clearState: () => void;
}

const Ctx = createContext<ContextValue | null>(null);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AssessmentState>(loadState);
  const skipNextPersistRef = useRef(false);

  useEffect(() => {
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setStudentData = useCallback((data: StudentData) => {
    setState((s) => ({ ...s, studentData: data }));
  }, []);

  const setSessionMetadata = useCallback((metadata: Partial<AssessmentSessionMetadata>) => {
    setState((s) => ({ ...s, session: { ...s.session, ...metadata } }));
  }, []);

  const setAnswer = useCallback((questionId: string, value: string) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [questionId]: value } }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState((s) => ({ ...s, currentPage: page }));
  }, []);

  const setIntroAccepted = useCallback((accepted: boolean) => {
    setState((s) => ({ ...s, introAccepted: accepted }));
  }, []);

  const clearState = useCallback(() => {
    skipNextPersistRef.current = true;
    window.localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  }, []);

  return (
    <Ctx.Provider value={{ state, setStudentData, setSessionMetadata, setAnswer, setCurrentPage, setIntroAccepted, clearState }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAssessment = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAssessment must be within AssessmentProvider");
  return ctx;
};
