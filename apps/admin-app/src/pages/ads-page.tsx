import React from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import { formatDate } from "../lib/format";
import type { Ad } from "../types/api";

export function AdsPage() {
  const [ads, setAds] = React.useState<Ad[]>([]);

  React.useEffect(() => {
    apiRequest<{ ads: Ad[] }>("/api/ads").then((data) => setAds(data.ads)).catch(console.error);
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>광고 목록</h1>
          <p className="muted">활성 기간 내 광고 중 하나가 pause 시 노출됩니다.</p>
        </div>
        <Link className="button button-primary" to="/ads/new">광고 등록</Link>
      </div>
      <div className="card table">
        <div className="table-row table-head">
          <div>광고명</div>
          <div>상태</div>
          <div>기간</div>
          <div>생성일</div>
        </div>
        {ads.map((ad) => (
          <div className="table-row" key={ad.id}>
            <div>{ad.title}</div>
            <div>{ad.isActive ? "활성" : "비활성"}</div>
            <div>{formatDate(ad.startAt)} ~ {formatDate(ad.endAt)}</div>
            <div>{formatDate(ad.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
