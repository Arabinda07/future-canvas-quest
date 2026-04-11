function toBase64Url(bytes: Uint8Array) {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function generateReportAccessToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toBase64Url(bytes);
}

export async function hashReportAccessToken(token: string) {
  const normalizedToken = token.trim();
  if (!normalizedToken) {
    throw new Error("access_token is required.");
  }

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalizedToken));
  return toHex(new Uint8Array(digest));
}
