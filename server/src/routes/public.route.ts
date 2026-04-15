import { Router } from "express";
import { getDeployedWebsiteBySlug } from "../controllers/websiteBuilder.controller.js";

const router = Router();

router.get("/sites/:slug", getDeployedWebsiteBySlug);

export default router;