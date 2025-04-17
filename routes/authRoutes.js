import express from "express";
import { signUp, login, getProfile,checkOrCreateUser } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.post("/check-or-create-user", checkOrCreateUser);


export default router;
