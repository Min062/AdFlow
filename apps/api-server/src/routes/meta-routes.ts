import { Router } from "express";
import { env } from "../config/env.js";

export const metaRouter = Router();

metaRouter.get("/health", (_req, res) => {
  return res.json({ ok: true, service: "AdStream API" });
});

metaRouter.get("/config", (_req, res) => {
  return res.json({
    sdkPublicUrl: env.SDK_PUBLIC_URL,
    demoVideoUrl: env.DEMO_VIDEO_URL,
    demoPosterUrl: env.DEMO_POSTER_URL
  });
});
