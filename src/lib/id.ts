export function createId(prefix = "fcq"): string {
  const cryptoId = globalThis.crypto?.randomUUID?.();

  if (cryptoId) {
    return `${prefix}_${cryptoId}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
