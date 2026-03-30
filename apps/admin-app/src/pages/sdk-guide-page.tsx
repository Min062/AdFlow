import React from "react";
import { apiRequest } from "../api/client";

export function SdkGuidePage() {
  const [sampleSiteId, setSampleSiteId] = React.useState("site_demo_adstream");

  React.useEffect(() => {
    apiRequest<{ sites: Array<{ publicSiteId: string }> }>("/api/sites")
      .then((data) => {
        if (data.sites[0]?.publicSiteId) {
          setSampleSiteId(data.sites[0].publicSiteId);
        }
      })
      .catch(console.error);
  }, []);

  const code = `<script src="http://localhost:4000/sdk/adstream-player.js"><\/script>
<div id="adstream-player"></div>
<script>
  AdStreamPlayer.init({
    containerId: "adstream-player",
    siteId: "${sampleSiteId}",
    videoUrl: "https://examplefiles.org/files/video/mp4-example-video-download-640x480.mp4",
    posterUrl: "https://dummyimage.com/640x480/0f172a/ffffff&text=AdStream+Demo+4:3",
    title: "Sample Video"
  });
<\/script>`;

  return (
    <div className="page-shell narrow">
      <div className="page-header">
        <div>
          <h1>SDK 사용법</h1>
          <p className="muted">외부 사이트에서 AdStreamPlayer를 붙이는 가장 빠른 방법입니다.</p>
        </div>
      </div>
      <div className="card stack">
        <pre className="code-block">{code}</pre>
      </div>
    </div>
  );
}
