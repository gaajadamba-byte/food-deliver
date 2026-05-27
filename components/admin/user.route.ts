import { Router } from "express";
import { getAllUsers, deleteUser } from "../controllers/user.controller";
// Middleware-ууд таны төсөлд өөр нэртэй байж магадгүй тул шалгаарай
// import { verifyToken, isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

export default router;
