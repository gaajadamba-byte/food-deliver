import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { UserRole } from "../generated/prisma/client";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

const accessExpires = env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"];
const refreshExpires = env.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"];

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: accessExpires });

export const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: refreshExpires });

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;

/* ── Single-use action tokens (email verification, password reset) ──
   Stateless JWTs, so no token column is needed on the User table. */

export type ActionPurpose = "verify-email" | "reset-password";

interface ActionPayload {
  userId: string;
  purpose: ActionPurpose;
}

export function signActionToken(
  userId: string,
  purpose: ActionPurpose,
  expiresInMinutes: number,
): string {
  return jwt.sign({ userId, purpose }, env.JWT_ACCESS_SECRET, {
    expiresIn: `${expiresInMinutes}m` as SignOptions["expiresIn"],
  });
}

export function verifyActionToken(token: string, purpose: ActionPurpose): ActionPayload {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as ActionPayload;
  if (payload.purpose !== purpose) {
    throw new Error("Token purpose mismatch");
  }
  return payload;
}
