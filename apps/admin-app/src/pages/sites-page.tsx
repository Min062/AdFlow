import React from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import { formatDate } from "../lib/format";
import type { Site } from "../types/api";

export function SitesPage() {
  const [sites, setSites] = React.useState<Site[]>([]);

  React.useEffect(() => {
    apiRequest<{ sites: Site[] }>("/api/sites").then((data) => setSites(data.sites)).catch(console.error);
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>사이트 목록</h1>
          <p className="muted">등록된 퍼블리셔 사이트와 공개 siteId를 관리합니다.</p>
        </div>
        <Link className="button button-primary" to="/sites/new">사이트 등록</Link>
      </div>
      <div className="table card">
        <div className="table-row table-head">
          <div>이름</div>
          <div>도메인</div>
          <div>siteId</div>
          <div>생성일</div>
        </div>
        {sites.map((site) => (
          <Link className="table-row" key={site.id} to={`/sites/${site.id}`}>
            <div>{site.name}</div>
            <div>{site.domain}</div>
            <div>{site.publicSiteId}</div>
            <div>{formatDate(site.createdAt)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
