import { Router } from "express";
import { getUser, googleAuth, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/google", googleAuth);
router.post("/logout", logout);
router.get("/me", authenticate, getUser);

export default router;