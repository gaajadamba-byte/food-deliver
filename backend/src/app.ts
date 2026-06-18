import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { foodCategoryRouter } from "./modules/food-category/food-category.routes.js";
import { foodOrderRouter } from "./modules/food-order/food-order.routes.js";
import { foodRouter } from "./modules/food/food.routes.js";
import { uploadRouter } from "./modules/upload/upload.routes.js";

export const app = express();

const allowedOrigins = [
  env.CLIENT_URL,
  "https://food-namxbauts-gaajadamba-bytes-projects.vercel.app",
  "https://food-fy41lqbyw-gaajadamba-bytes-projects.vercel.app",
  "https://food-l6n932abl-gaajadamba-bytes-projects.vercel.app",
  "https://food-q5k6dlzbg-gaajadamba-bytes-projects.vercel.app",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/food-category", foodCategoryRouter);
app.use("/food-order", foodOrderRouter);
app.use("/food", foodRouter);
app.use("/upload", uploadRouter);

app.use(notFound);
app.use(errorHandler);
