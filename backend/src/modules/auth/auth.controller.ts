import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import * as authService from "./auth.service";

/** Pulls a refresh token from the Authorization or x-refresh-token header. */
function extractRefreshToken(req: Request): string {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  const custom = req.headers["x-refresh-token"];
  if (typeof custom === "string" && custom) {
    return custom;
  }
  throw new AppError(401, "Refresh token missing");
}

export async function signUp(req: Request, res: Response): Promise<void> {
  const result = await authService.signUp(req.body);
  res.status(201).json(result);
}

export async function signIn(req: Request, res: Response): Promise<void> {
  const result = await authService.signIn(req.body);
  res.status(200).json(result);
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  const result = await authService.verifyEmail(token);
  res.status(200).json(result);
}

export async function resendVerification(req: Request, res: Response): Promise<void> {
  const result = await authService.resendVerification(req.body);
  res.status(200).json(result);
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const result = await authService.refresh(extractRefreshToken(req));
  res.status(200).json(result);
}

export async function requestPasswordReset(req: Request, res: Response): Promise<void> {
  const result = await authService.requestPasswordReset(req.body);
  res.status(200).json(result);
}

export async function verifyResetPasswordRequest(req: Request, res: Response): Promise<void> {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  const result = await authService.verifyResetToken(token);
  res.status(200).json(result);
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const result = await authService.resetPassword(req.body);
  res.status(200).json(result);
}
