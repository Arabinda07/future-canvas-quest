import type { AssessmentAnswers } from "../../../src/domain/types.ts";

export interface EncryptedAnswerEnvelope {
  v: 1;
  alg: "AES-256-GCM";
  iv: string;
  ciphertext: string;
}

function toBase64Url(bytes: Uint8Array) {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function deriveAesKey(secret: string) {
  const trimmedSecret = secret.trim();
  if (!trimmedSecret) {
    throw new Error("ASSESSMENT_ANSWER_ENCRYPTION_KEY is required.");
  }

  const encodedSecret = new TextEncoder().encode(trimmedSecret);
  const keyMaterial = encodedSecret.byteLength === 32
    ? encodedSecret
    : new Uint8Array(await crypto.subtle.digest("SHA-256", encodedSecret));

  return crypto.subtle.importKey("raw", keyMaterial, { name: "AES-GCM" }, false, ["encrypt"]);
}

export function getAnswerEncryptionSecret() {
  return Deno.env.get("ASSESSMENT_ANSWER_ENCRYPTION_KEY") ?? "";
}

export async function encryptAnswersForStorage(answers: AssessmentAnswers, secret = getAnswerEncryptionSecret()) {
  const key = await deriveAesKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(answers));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext));

  const envelope: EncryptedAnswerEnvelope = {
    v: 1,
    alg: "AES-256-GCM",
    iv: toBase64Url(iv),
    ciphertext: toBase64Url(ciphertext),
  };

  return JSON.stringify(envelope);
}
