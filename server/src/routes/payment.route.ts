import { Router } from "express";
import { createCheckoutSession } from "../controllers/payments.controller.js";

const router = Router();

router.post("/create-checkout-session", createCheckoutSession);


export default router;