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

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
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
