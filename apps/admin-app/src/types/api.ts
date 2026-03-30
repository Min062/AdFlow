export type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type Site = {
  id: string;
  userId: string;
  name: string;
  domain: string;
  description: string | null;
  publicSiteId: string;
  revenueSharePercentForPublisher: number;
  adstreamFeePercent: number;
  createdAt: string;
};

export type Ad = {
  id: string;
  title: string;
  imageUrl: string;
  clickUrl: string;
  isActive: boolean;
  startAt: string;
  endAt: string;
  targetType: string;
  createdAt: string;
};

export type SiteReport = {
  site: Site;
  impressionCount: number;
  clickCount: number;
  ctr: number;
  grossRevenue: number;
  publisherRevenue: number;
  adstreamRevenue: number;
};

export type OverviewReport = {
  totals: {
    impressionCount: number;
    clickCount: number;
    ctr: number;
    grossRevenue: number;
    publisherRevenue: number;
    adstreamRevenue: number;
  };
  siteReports: SiteReport[];
};
