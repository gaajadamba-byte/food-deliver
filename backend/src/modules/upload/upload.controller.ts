import type { Request, Response } from "express";
import { isCloudinaryConfigured, uploadImageBuffer } from "../../lib/cloudinary";
import { AppError } from "../../utils/AppError";

export async function uploadImage(req: Request, res: Response): Promise<void> {
  if (!isCloudinaryConfigured) {
    throw new AppError(503, "Image upload is not configured (missing Cloudinary credentials)");
  }
  if (!req.file) {
    throw new AppError(400, "No image file provided (use form field 'image')");
  }

  const result = await uploadImageBuffer(req.file.buffer);
  res.status(201).json(result);
}
