export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type JsonValidator<T> = (value: unknown) => value is T;

export function getBrowserStorage(): StorageLike | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readJsonStorage<T>(
  storage: StorageLike | null,
  key: string,
  fallback: T,
  validate?: JsonValidator<T>,
): T {
  if (!storage) return fallback;

  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeJsonStorage(storage: StorageLike | null, key: string, value: unknown): void {
  if (!storage) return;

  storage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(storage: StorageLike | null, key: string): void {
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage errors so the app can continue operating.
  }
}
