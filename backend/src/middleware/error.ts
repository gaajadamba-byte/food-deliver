import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { AppError } from "../utils/AppError.js";

export function notFound(req: Request, res: Response): void {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  if (err instanceof MulterError) {
    res.status(400).json({ message: err.message });
    return;
  }

  console.error("[unhandled error]", err);
  res.status(500).json({ message: "Internal server error" });
}
