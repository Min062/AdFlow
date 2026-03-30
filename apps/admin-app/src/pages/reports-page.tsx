import React from "react";
import { apiRequest } from "../api/client";
import { formatCurrency, formatPercent } from "../lib/format";
import type { OverviewReport } from "../types/api";

export function ReportsPage() {
  const [data, setData] = React.useState<OverviewReport | null>(null);

  React.useEffect(() => {
    apiRequest<OverviewReport>("/api/reports/overview").then(setData).catch(console.error);
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>리포트</h1>
          <p className="muted">사이트별 노출, 클릭, CTR, 예상 수익을 확인합니다.</p>
        </div>
      </div>
      <div className="card table">
        <div className="table-row table-head">
          <div>사이트</div>
          <div>노출 수</div>
          <div>클릭 수</div>
          <div>CTR</div>
          <div>총매출</div>
          <div>퍼블리셔 몫</div>
          <div>AdStream 몫</div>
        </div>
        {data?.siteReports.map((report) => (
          <div className="table-row" key={report.site.id}>
            <div>{report.site.name}</div>
            <div>{report.impressionCount}</div>
            <div>{report.clickCount}</div>
            <div>{formatPercent(report.ctr)}</div>
            <div>{formatCurrency(report.grossRevenue)}</div>
            <div>{formatCurrency(report.publisherRevenue)}</div>
            <div>{formatCurrency(report.adstreamRevenue)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
