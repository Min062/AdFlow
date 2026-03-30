import { prisma } from "../lib/prisma.js";
import { calculateRevenueSummary } from "../utils/revenue.js";

export async function getSiteReport(siteId: string) {
  const [site, impressionCount, clickCount] = await Promise.all([
    prisma.site.findUnique({ where: { id: siteId } }),
    prisma.impression.count({ where: { siteId } }),
    prisma.click.count({ where: { siteId } })
  ]);

  if (!site) {
    return null;
  }

  return {
    site,
    ...calculateRevenueSummary({
      impressionCount,
      clickCount,
      publisherPercent: site.revenueSharePercentForPublisher,
      adstreamPercent: site.adstreamFeePercent
    })
  };
}

export async function getUserReportOverview(userId: string) {
  const sites = await prisma.site.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  const siteReports = await Promise.all(sites.map((site) => getSiteReport(site.id)));

  const filled = siteReports.filter(
    (report): report is NonNullable<typeof report> => Boolean(report)
  );

  const totals = filled.reduce(
    (acc, current) => {
      acc.impressionCount += current.impressionCount;
      acc.clickCount += current.clickCount;
      acc.grossRevenue += current.grossRevenue;
      acc.publisherRevenue += current.publisherRevenue;
      acc.adstreamRevenue += current.adstreamRevenue;
      return acc;
    },
    {
      impressionCount: 0,
      clickCount: 0,
      grossRevenue: 0,
      publisherRevenue: 0,
      adstreamRevenue: 0
    }
  );

  const ctr = totals.impressionCount === 0 ? 0 : totals.clickCount / totals.impressionCount;

  return {
    totals: {
      ...totals,
      ctr
    },
    siteReports: filled
  };
}
