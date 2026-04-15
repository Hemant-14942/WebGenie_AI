import { buildWebsite, getWebsite, updateWebsiteChat, getAllWebsites, deployWebsite} from "../controllers/websiteBuilder.controller.js";
import { Router } from "express";

const router = Router();


router.post("/build-website", buildWebsite);
router.get("/website/getAll", getAllWebsites);
router.get("/websites", getAllWebsites);
router.get("/website/:id", getWebsite);
router.post("/website/:id/chat", updateWebsiteChat);
router.post("/website/:id/deploy", deployWebsite);

export default router;