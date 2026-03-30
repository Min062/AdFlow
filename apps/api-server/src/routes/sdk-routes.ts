import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const adRequestSchema = z.object({
  siteId: z.string(),
  videoId: z.string().optional(),
  currentTime: z.number().default(0),
  sessionId: z.string().min(1)
});

const adEventSchema = z.object({
  siteId: z.string(),
  adId: z.string(),
  sessionId: z.string().min(1),
  videoId: z.string().optional(),
  currentTime: z.number().optional(),
  timestamp: z.string().optional()
});

export const sdkRouter = Router();

sdkRouter.post("/ad-request", async (req, res) => {
  const input = adRequestSchema.parse(req.body);
  const site = await prisma.site.findUnique({
    where: { publicSiteId: input.siteId }
  });

  if (!site) {
    return res.status(404).json({ showAd: false, ad: null, reason: "invalid_site" });
  }

  const now = new Date();
  const ads = await prisma.ad.findMany({
    where: {
      isActive: true,
      startAt: { lte: now },
      endAt: { gte: now }
    },
    orderBy: { createdAt: "asc" }
  });

  if (!ads.length) {
    return res.json({ showAd: false, ad: null });
  }

  const ad = ads[Math.floor(Math.random() * ads.length)];
  return res.json({
    showAd: true,
    ad: {
      id: ad.id,
      title: ad.title,
      imageUrl: ad.imageUrl,
      clickUrl: ad.clickUrl
    }
  });
});

sdkRouter.post("/impression", async (req, res) => {
  const input = adEventSchema.parse(req.body);
  const site = await prisma.site.findUnique({ where: { publicSiteId: input.siteId } });

  if (!site) {
    return res.status(404).json({ message: "Invalid siteId" });
  }

  await prisma.impression.create({
    data: {
      siteId: site.id,
      adId: input.adId,
      sessionId: input.sessionId,
      videoId: input.videoId,
      currentTime: input.currentTime
    }
  });

  return res.status(201).json({ ok: true });
});

sdkRouter.post("/click", async (req, res) => {
  const input = adEventSchema.parse(req.body);
  const site = await prisma.site.findUnique({ where: { publicSiteId: input.siteId } });

  if (!site) {
    return res.status(404).json({ message: "Invalid siteId" });
  }

  await prisma.click.create({
    data: {
      siteId: site.id,
      adId: input.adId,
      sessionId: input.sessionId,
      videoId: input.videoId,
      currentTime: input.currentTime
    }
  });

  return res.status(201).json({ ok: true });
});
