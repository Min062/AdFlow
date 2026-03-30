import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { getSiteReport } from "../services/report-service.js";
import { generatePublicSiteId } from "../utils/site.js";
import { env } from "../config/env.js";

const siteSchema = z.object({
  name: z.string().min(2),
  domain: z.string().min(3),
  description: z.string().optional().or(z.literal("")),
  revenueSharePercentForPublisher: z.number().int().min(1).max(99),
  adstreamFeePercent: z.number().int().min(1).max(99)
}).refine(
  (value) => value.revenueSharePercentForPublisher + value.adstreamFeePercent === 100,
  { message: "Revenue split must add up to 100" }
);

export const siteRouter = Router();

siteRouter.use(requireAuth);

siteRouter.get("/", async (req, res) => {
  const sites = await prisma.site.findMany({
    where: { userId: req.auth!.userId },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ sites });
});

siteRouter.post("/", async (req, res) => {
  const input = siteSchema.parse(req.body);
  const site = await prisma.site.create({
    data: {
      userId: req.auth!.userId,
      name: input.name,
      domain: input.domain,
      description: input.description || null,
      publicSiteId: generatePublicSiteId(),
      revenueSharePercentForPublisher: input.revenueSharePercentForPublisher,
      adstreamFeePercent: input.adstreamFeePercent
    }
  });

  return res.status(201).json({ site });
});

siteRouter.get("/:siteId", async (req, res) => {
  const site = await prisma.site.findFirst({
    where: {
      id: req.params.siteId,
      userId: req.auth!.userId
    }
  });

  if (!site) {
    return res.status(404).json({ message: "Site not found" });
  }

  const report = await getSiteReport(site.id);
  const embedCode = [
    `<script src="${env.SDK_PUBLIC_URL}"><\/script>`,
    `<div id="adstream-player"></div>`,
    `<script>`,
    `  AdStreamPlayer.init({`,
    `    containerId: "adstream-player",`,
    `    siteId: "${site.publicSiteId}",`,
    `    videoUrl: "${env.DEMO_VIDEO_URL}",`,
    `    posterUrl: "${env.DEMO_POSTER_URL}",`,
    `    title: "Sample Video"`,
    `  });`,
    `<\/script>`
  ].join("\n");

  return res.json({
    site,
    report,
    embedCode
  });
});
