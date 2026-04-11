export interface CounselorAccessSession {
  batchCode: string;
  adminToken: string;
  schoolName: string;
  validUntil?: string;
}

const STORAGE_KEY = "fcq.counselorAccess";

function normalizeBatchCode(batchCode: string) {
  return batchCode.trim().toUpperCase();
}

function normalizeAdminToken(adminToken: string) {
  return adminToken.trim();
}

export function getCounselorAccessStorageKey() {
  return STORAGE_KEY;
}

export function saveCounselorAccessSession(session: CounselorAccessSession) {
  if (typeof window === "undefined") return;

  const normalized: CounselorAccessSession = {
    batchCode: normalizeBatchCode(session.batchCode),
    adminToken: normalizeAdminToken(session.adminToken),
    schoolName: session.schoolName.trim(),
    validUntil: session.validUntil,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function loadCounselorAccessSession(): CounselorAccessSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CounselorAccessSession>;
    if (
      typeof parsed.batchCode !== "string" ||
      typeof parsed.adminToken !== "string" ||
      typeof parsed.schoolName !== "string"
    ) {
      return null;
    }

    return {
      batchCode: normalizeBatchCode(parsed.batchCode),
      adminToken: normalizeAdminToken(parsed.adminToken),
      schoolName: parsed.schoolName.trim(),
      validUntil: typeof parsed.validUntil === "string" ? parsed.validUntil : undefined,
    };
  } catch {
    return null;
  }
}

export function clearCounselorAccessSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasValidCounselorAccessSession(session = loadCounselorAccessSession(), now = new Date()) {
  if (!session) return false;
  if (!session.validUntil) return true;

  const validUntil = new Date(session.validUntil);
  if (Number.isNaN(validUntil.valueOf())) return false;

  return validUntil >= now;
}

export function parseCounselorAccessParams(search: string | URLSearchParams) {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(search);
  const batchCode = normalizeBatchCode(params.get("batch") ?? "");
  const adminToken = normalizeAdminToken(params.get("token") ?? "");

  if (!batchCode || !adminToken) {
    return null;
  }

  return { batchCode, adminToken };
}
