import { Router } from "express";
import authRoute from "./auth.route.js";
import websiteBuilderRoute from "./websiteBuilder.route.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import publicRoute from "./public.route.js";
import healthRoute from "./health.routes.js";
import paymentRoute from "./payment.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/", healthRoute);
router.use("/", publicRoute);
router.use("/", authenticate, websiteBuilderRoute);
router.use("/", authenticate, paymentRoute);
export default router;
