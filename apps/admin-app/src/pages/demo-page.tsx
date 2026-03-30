import React from "react";
import { apiRequest } from "../api/client";
import { SDK_BASE_URL } from "../lib/config";
import type { Site } from "../types/api";

declare global {
  interface Window {
    AdStreamPlayer?: {
      init?: (options: Record<string, unknown>) => { destroy?: () => void };
      AdStreamPlayer?: AdStreamSdkGlobal;
    };
  }
}

type AdStreamSdkGlobal = {
  init: (options: Record<string, unknown>) => { destroy?: () => void };
};

export function DemoPage() {
  const [sites, setSites] = React.useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = React.useState("site_demo_adstream");
  const playerRef = React.useRef<{ destroy?: () => void } | null>(null);

  React.useEffect(() => {
    apiRequest<{ sites: Site[] }>("/api/sites")
      .then((data) => {
        setSites(data.sites);
        if (data.sites[0]?.publicSiteId) {
          setSelectedSiteId(data.sites[0].publicSiteId);
        }
      })
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = `${SDK_BASE_URL}/adstream-player.js`;
    script.async = true;
    script.onload = () => {
      const candidate = window.AdStreamPlayer;
      const sdk: AdStreamSdkGlobal | undefined = candidate?.init
        ? (candidate as AdStreamSdkGlobal)
        : candidate?.AdStreamPlayer;

      playerRef.current?.destroy?.();
      playerRef.current = sdk?.init({
        containerId: "demo-adstream-player",
        siteId: selectedSiteId,
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        posterUrl: "https://dummyimage.com/1280x720/0f172a/ffffff&text=AdStream+Demo+Sample",
        title: "AdStream Demo Lecture",
        apiBaseUrl: "http://localhost:4000"
      }) ?? null;
    };
    document.body.appendChild(script);

    return () => {
      playerRef.current?.destroy?.();
      script.remove();
    };
  }, [selectedSiteId]);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Demo Page</h1>
          <p className="muted">실제 강의 사이트가 AdStream 플레이어를 붙인 것처럼 동작하는 데모입니다.</p>
        </div>
      </div>
      <div className="card stack">
        <label className="field">
          <span className="field-label">테스트 siteId</span>
          <select value={selectedSiteId} onChange={(event) => setSelectedSiteId(event.target.value)}>
            {sites.map((site) => (
              <option key={site.id} value={site.publicSiteId}>{site.name} ({site.publicSiteId})</option>
            ))}
            {!sites.length ? <option value="site_demo_adstream">site_demo_adstream</option> : null}
          </select>
        </label>
        <h2>광고 수익화 강의 데모</h2>
        <p className="muted">영상을 10초 이상 본 뒤 pause 하면 광고 오버레이가 나타납니다.</p>
        <div id="demo-adstream-player" />
      </div>
    </div>
  );
}
