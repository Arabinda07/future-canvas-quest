import type { AssessmentSession, CreateAssessmentSessionInput } from "@/domain/types";
import { createId } from "@/lib/id";
import { getBrowserStorage, isRecord, readJsonStorage, writeJsonStorage } from "@/lib/storage";
import type { AssessmentRepository } from "@/repositories/contracts";

const STORAGE_KEY = "fcq.assessmentSessions";
const STUDENT_CLASSES = new Set(["IX", "X", "XI", "XII"]);
const ENTRY_PATHS = new Set(["self-serve", "school-issued"]);

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === "string");
}

function isAssessmentSession(value: unknown): value is AssessmentSession {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.studentId === "string" &&
    typeof value.studentClass === "string" &&
    STUDENT_CLASSES.has(value.studentClass) &&
    typeof value.entryPath === "string" &&
    ENTRY_PATHS.has(value.entryPath) &&
    isStringRecord(value.answers) &&
    typeof value.completed === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    (value.counselorId === undefined || typeof value.counselorId === "string")
  );
}

function isAssessmentSessionRecord(value: unknown): value is Record<string, AssessmentSession> {
  return isRecord(value) && Object.entries(value).every(([id, session]) => isAssessmentSession(session) && session.id === id);
}

export function createLocalAssessmentRepository(storage = getBrowserStorage()): AssessmentRepository {
  const loadSessions = () => readJsonStorage<Record<string, AssessmentSession>>(storage, STORAGE_KEY, {}, isAssessmentSessionRecord);
  const persistSessions = (sessions: Record<string, AssessmentSession>) => writeJsonStorage(storage, STORAGE_KEY, sessions);

  return {
    createSession: (input: CreateAssessmentSessionInput) => {
      const now = new Date().toISOString();
      const session: AssessmentSession = {
        id: createId("assessment"),
        studentId: input.studentId,
        counselorId: input.counselorId,
        studentClass: input.studentClass,
        entryPath: input.entryPath,
        answers: {},
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      const sessions = loadSessions();
      sessions[session.id] = session;
      persistSessions(sessions);

      return session;
    },
    getSession: (id) => loadSessions()[id] ?? null,
    saveSession: (session) => {
      const sessions = loadSessions();
      sessions[session.id] = session;
      persistSessions(sessions);
      return session;
    },
    listSessions: () => Object.values(loadSessions()),
  };
}
