import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const adSchema = z.object({
  title: z.string().min(2),
  imageUrl: z.string().url(),
  clickUrl: z.string().url(),
  isActive: z.boolean().default(true),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  targetType: z.string().default("all")
});

export const adRouter = Router();
adRouter.use(requireAuth);

adRouter.get("/", async (_req, res) => {
  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" }
  });

  return res.json({ ads });
});

adRouter.post("/", async (req, res) => {
  const input = adSchema.parse(req.body);
  const ad = await prisma.ad.create({
    data: {
      title: input.title,
      imageUrl: input.imageUrl,
      clickUrl: input.clickUrl,
      isActive: input.isActive,
      startAt: new Date(input.startAt),
      endAt: new Date(input.endAt),
      targetType: input.targetType
    }
  });

  return res.status(201).json({ ad });
});
