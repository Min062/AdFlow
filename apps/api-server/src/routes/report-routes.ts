import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getSiteReport, getUserReportOverview } from "../services/report-service.js";
import { prisma } from "../lib/prisma.js";

export const reportRouter = Router();
reportRouter.use(requireAuth);

reportRouter.get("/overview", async (req, res) => {
  const overview = await getUserReportOverview(req.auth!.userId);
  return res.json(overview);
});

reportRouter.get("/site/:siteId", async (req, res) => {
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
  return res.json({ report });
});
