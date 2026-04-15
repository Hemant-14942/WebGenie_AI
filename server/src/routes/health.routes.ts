import { Router } from "express";

const healthRoute = Router();

healthRoute.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ai-website-builder-server",
    timestamp: new Date().toISOString(),
  });
});

export default healthRoute;

