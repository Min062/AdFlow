import React from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import { formatCurrency, formatPercent } from "../lib/format";
import type { Site, SiteReport } from "../types/api";

type SiteDetailResponse = {
  site: Site;
  report: SiteReport;
  embedCode: string;
};

export function SiteDetailPage() {
  const params = useParams();
  const [data, setData] = React.useState<SiteDetailResponse | null>(null);

  React.useEffect(() => {
    if (!params.siteId) return;
    apiRequest<SiteDetailResponse>(`/api/sites/${params.siteId}`).then(setData).catch(console.error);
  }, [params.siteId]);

  if (!data) {
    return <div className="page-shell"><p>불러오는 중...</p></div>;
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>{data.site.name}</h1>
          <p className="muted">{data.site.domain}</p>
        </div>
      </div>
      <div className="detail-grid">
        <div className="card stack">
          <h2>사이트 정보</h2>
          <div><strong>siteId</strong>: {data.site.publicSiteId}</div>
          <div><strong>설명</strong>: {data.site.description || "설명 없음"}</div>
          <div><strong>수익 분배</strong>: 퍼블리셔 {data.site.revenueSharePercentForPublisher}% / AdStream {data.site.adstreamFeePercent}%</div>
          <div><strong>최근 노출 수</strong>: {data.report.impressionCount}</div>
          <div><strong>최근 클릭 수</strong>: {data.report.clickCount}</div>
        </div>
        <div className="card stack">
          <h2>임베드 코드</h2>
          <pre className="code-block">{data.embedCode}</pre>
          <div className="muted small">
            테스트 videoUrl 예시: https://examplefiles.org/files/video/mp4-example-video-download-640x480.mp4
          </div>
        </div>
      </div>
      <div className="metric-grid">
        <div className="metric-card"><div className="metric-label">CTR</div><div className="metric-value">{formatPercent(data.report.ctr)}</div></div>
        <div className="metric-card"><div className="metric-label">총매출</div><div className="metric-value">{formatCurrency(data.report.grossRevenue)}</div></div>
        <div className="metric-card"><div className="metric-label">퍼블리셔 몫</div><div className="metric-value">{formatCurrency(data.report.publisherRevenue)}</div></div>
        <div className="metric-card"><div className="metric-label">AdStream 몫</div><div className="metric-value">{formatCurrency(data.report.adstreamRevenue)}</div></div>
      </div>
    </div>
  );
}
