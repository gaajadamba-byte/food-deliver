import multer from "multer";
import { AppError } from "../../utils/AppError";

/** Accepts a single image file in the `image` form field, kept in memory. */
export const uploadSingleImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError(400, "Only image files are allowed"));
    }
  },
}).single("image");
