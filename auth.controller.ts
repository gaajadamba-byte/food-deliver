import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import * as authService from "./auth.service";
import { verifyAccessToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";

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

/** Pulls an access token from the Authorization header. */
function extractAccessToken(req: Request): string {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  throw new AppError(401, "Access token missing");
}

export const me = asyncHandler(
  async (req: any, res: Response): Promise<void> => {
    const userId = req.user?.userId; // Хэрэв req.user улайсан хэвээр байвал Request-ийг 'any' болгож түр засаж болно
    if (!userId) {
      throw new AppError(401, "User session not found");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(401, "User not found");

    const { password, ttl, ...safe } = user;
    res.status(200).json(safe);
  },
);

export const signUp = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await authService.signUp(req.body);
    res.status(201).json(result);
  },
);

export const signIn = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await authService.signIn(req.body);
    res.status(200).json(result);
  },
);

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    const result = await authService.verifyEmail(token);
    res.status(200).json(result);
  },
);

export const resendVerification = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await authService.resendVerification(req.body);
    res.status(200).json(result);
  },
);

export const refresh = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await authService.refresh(extractRefreshToken(req));
    res.status(200).json(result);
  },
);

export const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await authService.requestPasswordReset(req.body);
    res.status(200).json(result);
  },
);

export const verifyResetPasswordRequest = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    const result = await authService.verifyResetToken(token);
    res.status(200).json(result);
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  },
);
