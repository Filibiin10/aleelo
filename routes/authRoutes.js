import express from "express";
import { signUp, login, getProfile,checkOrCreateUser, findUserByUserRef, whoAmI ,logout} from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.get("/whoami", whoAmI);
router.post("/logout", logout);
router.get("/user/by-ref/:userRef", findUserByUserRef);
router.post("/check-or-create-user", checkOrCreateUser);


export default router;
