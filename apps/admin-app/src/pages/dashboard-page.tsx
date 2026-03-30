import React from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import { MetricCard } from "../components/metric-card";
import { formatCurrency, formatPercent } from "../lib/format";
import type { OverviewReport } from "../types/api";

export function DashboardPage() {
  const [data, setData] = React.useState<OverviewReport | null>(null);

  React.useEffect(() => {
    apiRequest<OverviewReport>("/api/reports/overview").then(setData).catch(console.error);
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>대시보드 홈</h1>
          <p className="muted">광고 노출, 클릭, 매출 흐름을 빠르게 확인합니다.</p>
        </div>
        <div className="header-actions">
          <Link className="button button-primary" to="/sites/new">사이트 등록</Link>
          <Link className="button button-secondary" to="/ads/new">광고 등록</Link>
        </div>
      </div>
      <div className="metric-grid">
        <MetricCard label="총 노출 수" value={String(data?.totals.impressionCount ?? 0)} />
        <MetricCard label="총 클릭 수" value={String(data?.totals.clickCount ?? 0)} />
        <MetricCard label="CTR" value={formatPercent(data?.totals.ctr ?? 0)} />
        <MetricCard label="총 매출 추정" value={formatCurrency(data?.totals.grossRevenue ?? 0)} />
        <MetricCard label="퍼블리셔 몫" value={formatCurrency(data?.totals.publisherRevenue ?? 0)} />
        <MetricCard label="AdStream 몫" value={formatCurrency(data?.totals.adstreamRevenue ?? 0)} />
      </div>
      <div className="card">
        <h2>사이트별 리포트</h2>
        <div className="table">
          <div className="table-row table-head">
            <div>사이트</div>
            <div>노출</div>
            <div>클릭</div>
            <div>CTR</div>
            <div>총매출</div>
          </div>
          {data?.siteReports.map((report) => (
            <Link className="table-row" key={report.site.id} to={`/sites/${report.site.id}`}>
              <div>{report.site.name}</div>
              <div>{report.impressionCount}</div>
              <div>{report.clickCount}</div>
              <div>{formatPercent(report.ctr)}</div>
              <div>{formatCurrency(report.grossRevenue)}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
