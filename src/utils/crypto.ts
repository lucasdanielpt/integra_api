import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;

export function hashPassword(plainTextPassword: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(plainTextPassword, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(plainTextPassword: string, storedHash: string): boolean {
  const [salt, storedDerived] = storedHash.split(":");

  if (!salt || !storedDerived) {
    return false;
  }

  const derived = scryptSync(plainTextPassword, salt, SCRYPT_KEY_LENGTH);
  const storedBuffer = Buffer.from(storedDerived, "hex");

  if (storedBuffer.length !== derived.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derived);
}

export function generateOpaqueToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
