type AdData = {
  id: string;
  title: string;
  imageUrl: string;
  clickUrl: string;
};

type InitOptions = {
  containerId: string;
  siteId: string;
  videoUrl: string;
  posterUrl?: string;
  title?: string;
  apiBaseUrl?: string;
  videoId?: string;
};

type AdRequestResponse = {
  showAd: boolean;
  ad: AdData | null;
};

type PlayerInstance = {
  destroy: () => void;
};

const STYLE_ID = "adstream-player-style";
const FALLBACK_AD: AdData = {
  id: "adstream-fallback-ad",
  title: "AdStream 데모 광고",
  imageUrl: "https://dummyimage.com/640x360/0f172a/ffffff&text=AdStream+Demo+Ad",
  clickUrl: "https://example.com/adstream-demo"
};

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .adstream-shell{position:relative;width:100%;max-width:1100px;border-radius:0;overflow:hidden;background:#0f172a;color:#fff;box-shadow:0 24px 60px rgba(15,23,42,.28)}
    .adstream-shell:fullscreen{max-width:none;width:100vw;height:100vh;border-radius:0}
    .adstream-shell:fullscreen .adstream-layout{aspect-ratio:auto;height:100vh}
    .adstream-shell.adstream-shell-expanded{position:fixed;inset:0;z-index:9999;max-width:none;width:100vw;height:100vh;border-radius:0}
    .adstream-shell.adstream-shell-expanded .adstream-layout{aspect-ratio:auto;height:100vh}
    .adstream-body-locked{overflow:hidden}
    .adstream-shell:focus,.adstream-shell:focus-visible,.adstream-video:focus,.adstream-video:focus-visible,.adstream-btn:focus,.adstream-btn:focus-visible,.adstream-control-btn:focus,.adstream-control-btn:focus-visible,.adstream-range:focus,.adstream-range:focus-visible{outline:none}
    .adstream-layout{display:grid;grid-template-columns:minmax(0,1fr) 0;aspect-ratio:16 / 9;width:100%;background:#020617;transition:grid-template-columns .22s ease}
    .adstream-shell.adstream-ad-visible .adstream-layout{grid-template-columns:minmax(0,62%) minmax(280px,38%)}
    .adstream-stage{position:relative;min-width:0;height:100%;overflow:hidden;background:#000}
    .adstream-video{display:block;position:absolute;inset:0;width:100%;height:100%;background:#000;object-fit:contain;object-position:center center;outline:none}
    .adstream-controls{position:absolute;left:0;right:0;bottom:0;padding:10px 14px 12px;background:rgba(2,6,23,.82);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,.08);border-radius:0;opacity:1;transform:translateY(0);transition:opacity .22s ease,transform .22s ease}
    .adstream-controls.adstream-controls-hidden{opacity:0;transform:translateY(18px);pointer-events:none}
    .adstream-progress{width:100%;margin:0 0 10px}
    .adstream-controls-row{display:flex;align-items:center;justify-content:space-between;gap:14px}
    .adstream-pause-bar{display:none;align-items:center;justify-content:center;position:relative;min-height:44px}
    .adstream-pause-actions{position:absolute;right:0;display:flex;align-items:center;height:44px}
    .adstream-shell.adstream-paused .adstream-controls{background:transparent;backdrop-filter:none;border-top:0;padding-bottom:28px}
    .adstream-shell.adstream-paused .adstream-progress,.adstream-shell.adstream-paused .adstream-controls-row{display:none}
    .adstream-shell.adstream-paused .adstream-pause-bar{display:flex}
    .adstream-controls-group{display:flex;align-items:center;gap:14px;min-width:0}
    .adstream-control-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:0;background:transparent;color:#fff;cursor:pointer;transition:opacity .16s ease,transform .16s ease}
    .adstream-control-btn:hover{opacity:.78;transform:translateY(-1px)}
    .adstream-control-btn svg{width:19px;height:19px;display:block;stroke:currentColor}
    .adstream-control-btn.adstream-control-wide{width:auto;padding:0;gap:5px}
    .adstream-pause-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-width:180px;height:44px;padding:0 18px;border:0;border-radius:999px;background:#fff;color:#020617;cursor:pointer;font:700 14px/1 Inter,system-ui,sans-serif}
    .adstream-pause-button svg{width:18px;height:18px;display:block}
    .adstream-pause-actions .adstream-control-btn{width:44px;height:44px}
    .adstream-pause-actions .adstream-control-btn svg{width:22px;height:22px;stroke-width:2.8px;filter:drop-shadow(0 1px 1px rgba(2,6,23,.35))}
    .adstream-range{appearance:none;-webkit-appearance:none;width:100%;border:0;padding:0;border-radius:0;background:transparent;box-shadow:none;cursor:pointer}
    .adstream-range::-webkit-slider-runnable-track{border-radius:999px;transition:height .16s ease,background-color .16s ease}
    .adstream-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;border-radius:999px;transition:transform .16s ease}
    .adstream-range::-moz-range-track{border:none;border-radius:999px;transition:height .16s ease,background-color .16s ease}
    .adstream-range::-moz-range-thumb{border:none;border-radius:999px;transition:transform .16s ease}
    .adstream-progress input{width:100%}
    .adstream-progress .adstream-range::-webkit-slider-runnable-track{height:4px;background:linear-gradient(to right,#456ad9 0%,#456ad9 var(--range-progress,0%),rgba(148,163,184,.34) var(--range-progress,0%),rgba(148,163,184,.34) 100%)}
    .adstream-progress .adstream-range::-webkit-slider-thumb{width:12px;height:12px;margin-top:-4px;background:#ffffff}
    .adstream-progress .adstream-range::-moz-range-track{height:4px;background:linear-gradient(to right,#456ad9 0%,#456ad9 var(--range-progress,0%),rgba(148,163,184,.34) var(--range-progress,0%),rgba(148,163,184,.34) 100%)}
    .adstream-progress .adstream-range::-moz-range-thumb{width:12px;height:12px;background:#ffffff}
    .adstream-progress:hover .adstream-range::-webkit-slider-runnable-track{height:7px}
    .adstream-progress:hover .adstream-range::-webkit-slider-thumb{margin-top:-2.5px}
    .adstream-progress:hover .adstream-range::-moz-range-track{height:7px}
    .adstream-volume-wrap{display:flex;align-items:center;gap:8px}
    .adstream-volume{width:92px}
    .adstream-volume::-webkit-slider-runnable-track{height:2px;background:linear-gradient(to right,#ffffff 0%,#ffffff var(--range-progress,0%),rgba(148,163,184,.34) var(--range-progress,0%),rgba(148,163,184,.34) 100%)}
    .adstream-volume::-webkit-slider-thumb{width:10px;height:10px;margin-top:-4px;background:#ffffff}
    .adstream-volume::-moz-range-track{height:2px;background:linear-gradient(to right,#ffffff 0%,#ffffff var(--range-progress,0%),rgba(148,163,184,.34) var(--range-progress,0%),rgba(148,163,184,.34) 100%)}
    .adstream-volume::-moz-range-thumb{width:10px;height:10px;background:#ffffff}
    .adstream-volume-wrap:hover .adstream-volume::-webkit-slider-runnable-track{height:4px}
    .adstream-volume-wrap:hover .adstream-volume::-webkit-slider-thumb{margin-top:-3px}
    .adstream-volume-wrap:hover .adstream-volume::-moz-range-track{height:4px}
    .adstream-time{font:500 12px/1 Inter,system-ui,sans-serif;color:rgba(255,255,255,.82);min-width:88px;margin-left:2px}
    .adstream-settings{position:relative}
    .adstream-speed-control{display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.08)}
    .adstream-speed-button{display:inline-flex;align-items:center;justify-content:center;min-width:0;height:30px;padding:0 8px;border:0;border-radius:999px;background:transparent;color:#fff;cursor:pointer;font:600 12px/1 Inter,system-ui,sans-serif}
    .adstream-speed-button:hover{background:rgba(255,255,255,.08)}
    .adstream-speed-button svg{width:16px;height:16px;display:block;stroke:currentColor}
    .adstream-speed-value{min-width:42px}
    .adstream-settings-menu{position:absolute;right:0;bottom:48px;display:flex;flex-direction:column;gap:6px;min-width:108px;padding:8px;background:rgba(15,23,42,.96);border:1px solid rgba(148,163,184,.18);border-radius:14px;box-shadow:0 20px 40px rgba(2,6,23,.32);opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .16s ease,transform .16s ease}
    .adstream-settings.open .adstream-settings-menu{opacity:1;pointer-events:auto;transform:translateY(0)}
    .adstream-settings-item{border:0;background:transparent;color:#fff;padding:8px 10px;border-radius:10px;text-align:left;cursor:pointer;font:600 12px/1.2 Inter,system-ui,sans-serif}
    .adstream-settings-item:hover,.adstream-settings-item.active{background:rgba(59,130,246,.18)}
    .adstream-overlay{display:none;flex-direction:column;justify-content:space-between;min-width:0;width:100%;opacity:0;pointer-events:none;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(241,245,249,.98));color:#0f172a;padding:0;transition:opacity .18s ease,padding .18s ease}
    .adstream-shell.adstream-ad-visible .adstream-overlay{display:flex;opacity:1;pointer-events:auto;padding:18px}
    .adstream-overlay img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:16px;background:#e2e8f0}
    .adstream-overlay-body{padding:14px 4px 0}
    .adstream-overlay-title{font:700 15px/1.4 Inter,system-ui,sans-serif;margin:0 0 10px}
    .adstream-overlay-copy{margin:0 0 14px;color:#475569;font:500 13px/1.55 Inter,system-ui,sans-serif}
    .adstream-overlay-actions{display:flex;gap:8px}
    .adstream-btn{border:0;border-radius:999px;padding:10px 14px;cursor:pointer;font:600 13px/1 Inter,system-ui,sans-serif}
    .adstream-btn-primary{background:#0f172a;color:#fff}
    .adstream-btn-secondary{background:#e5e7eb;color:#0f172a}
    .adstream-badge{display:inline-flex;align-items:center;gap:6px;background:#eff6ff;color:#1d4ed8;border-radius:999px;padding:6px 10px;font:700 11px/1 Inter,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.04em}
    .adstream-meta{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .adstream-hint{font:500 12px/1.4 Inter,system-ui,sans-serif;color:#64748b}
    @media (max-width: 840px){
      .adstream-layout{grid-template-columns:minmax(0,1fr);position:relative}
      .adstream-shell.adstream-ad-visible .adstream-layout{grid-template-columns:minmax(0,1fr)}
      .adstream-shell.adstream-ad-visible .adstream-overlay{position:absolute;inset:0;z-index:3;width:100%;height:100%;padding:12px;overflow:auto}
      .adstream-shell:fullscreen .adstream-layout,.adstream-shell.adstream-shell-expanded .adstream-layout{aspect-ratio:auto;height:100vh}
      .adstream-controls-row{flex-wrap:wrap}
      .adstream-volume{width:76px}
    }
  `;
  document.head.appendChild(style);
}

function getApiBaseUrl(options: InitOptions) {
  if (options.apiBaseUrl) return options.apiBaseUrl;
  const script = document.currentScript as HTMLScriptElement | null;
  if (script?.src) {
    const url = new URL(script.src);
    return `${url.protocol}//${url.host}`;
  }
  return window.location.origin;
}

function getSessionId(siteId: string) {
  const key = `adstream_session_${siteId}`;
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const next = `sess_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  sessionStorage.setItem(key, next);
  return next;
}

async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function buildPlayer(options: InitOptions): PlayerInstance {
  ensureStyles();

  const container = document.getElementById(options.containerId);
  if (!container) {
    throw new Error(`AdStreamPlayer container not found: ${options.containerId}`);
  }

  const apiBaseUrl = getApiBaseUrl(options);
  const sessionId = getSessionId(options.siteId);
  let pauseTimer: number | null = null;
  let isSeeking = false;
  let dismissedForCurrentPause = false;
  let currentAd: AdData | null = null;
  let destroyed = false;
  let ignoreNextPauseAd = false;
  let expanded = false;
  let controlsHideTimer: number | null = null;

  const shell = document.createElement("div");
  shell.className = "adstream-shell";

  const layout = document.createElement("div");
  layout.className = "adstream-layout";

  const stage = document.createElement("div");
  stage.className = "adstream-stage";

  const video = document.createElement("video");
  video.className = "adstream-video";
  video.src = options.videoUrl;
  video.poster = options.posterUrl ?? "";
  video.controls = false;
  video.playsInline = true;
  video.setAttribute("tabindex", "-1");
  stage.appendChild(video);

  const controls = document.createElement("div");
  controls.className = "adstream-controls";
  const progress = document.createElement("div");
  progress.className = "adstream-progress";
  const progressRange = document.createElement("input");
  progressRange.className = "adstream-range";
  progressRange.type = "range";
  progressRange.min = "0";
  progressRange.max = "100";
  progressRange.step = "0.1";
  progressRange.value = "0";
  progress.appendChild(progressRange);

  const controlsRow = document.createElement("div");
  controlsRow.className = "adstream-controls-row";
  const pauseBar = document.createElement("div");
  pauseBar.className = "adstream-pause-bar";
  const pauseResumeButton = document.createElement("button");
  pauseResumeButton.type = "button";
  pauseResumeButton.className = "adstream-pause-button";
  pauseResumeButton.setAttribute("aria-label", "다시 재생");
  const pauseActions = document.createElement("div");
  pauseActions.className = "adstream-pause-actions";
  pauseBar.appendChild(pauseResumeButton);
  const leftControls = document.createElement("div");
  leftControls.className = "adstream-controls-group";
  const rightControls = document.createElement("div");
  rightControls.className = "adstream-controls-group";

  const playButton = document.createElement("button");
  playButton.type = "button";
  playButton.className = "adstream-control-btn";
  playButton.setAttribute("aria-label", "재생");

  const timeText = document.createElement("div");
  timeText.className = "adstream-time";

  const volumeRange = document.createElement("input");
  volumeRange.type = "range";
  volumeRange.min = "0";
  volumeRange.max = "1";
  volumeRange.step = "0.01";
  volumeRange.value = "1";
  volumeRange.className = "adstream-range adstream-volume";
  volumeRange.setAttribute("aria-label", "볼륨");
  const volumeWrap = document.createElement("div");
  volumeWrap.className = "adstream-volume-wrap";
  const volumeButton = document.createElement("button");
  volumeButton.type = "button";
  volumeButton.className = "adstream-control-btn";
  volumeButton.setAttribute("aria-label", "음소거");
  volumeWrap.append(volumeButton, volumeRange);

  const settingsWrap = document.createElement("div");
  settingsWrap.className = "adstream-settings";
  const speedControl = document.createElement("div");
  speedControl.className = "adstream-speed-control";
  const speedDownButton = document.createElement("button");
  speedDownButton.type = "button";
  speedDownButton.className = "adstream-speed-button";
  speedDownButton.setAttribute("aria-label", "배속 감소");
  speedDownButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <path d="M12 17 6 9h12z"></path>
    </svg>
  `;
  const speedValueButton = document.createElement("button");
  speedValueButton.type = "button";
  speedValueButton.className = "adstream-speed-button adstream-speed-value";
  speedValueButton.setAttribute("aria-label", "배속 선택");
  const speedUpButton = document.createElement("button");
  speedUpButton.type = "button";
  speedUpButton.className = "adstream-speed-button";
  speedUpButton.setAttribute("aria-label", "배속 증가");
  speedUpButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <path d="M12 7 18 15H6z"></path>
    </svg>
  `;
  speedControl.append(speedDownButton, speedValueButton, speedUpButton);
  const settingsMenu = document.createElement("div");
  settingsMenu.className = "adstream-settings-menu";
  const speedOptions = ["0.75", "1", "1.25", "1.5"];
  const speedButtons = speedOptions.map((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "adstream-settings-item";
    button.dataset.speed = value;
    button.textContent = `${value}x`;
    settingsMenu.appendChild(button);
    return button;
  });
  settingsWrap.append(speedControl, settingsMenu);

  const fullscreenButton = document.createElement("button");
  fullscreenButton.type = "button";
  fullscreenButton.className = "adstream-control-btn";
  fullscreenButton.setAttribute("aria-label", "전체화면 전환");
  fullscreenButton.tabIndex = -1;
  const pauseFullscreenButton = document.createElement("button");
  pauseFullscreenButton.type = "button";
  pauseFullscreenButton.className = "adstream-control-btn";
  pauseFullscreenButton.setAttribute("aria-label", "전체화면 전환");
  pauseFullscreenButton.tabIndex = -1;

  leftControls.append(playButton, timeText);
  rightControls.append(settingsWrap, volumeWrap, fullscreenButton);
  pauseActions.append(pauseFullscreenButton);
  pauseBar.append(pauseActions);
  controlsRow.append(leftControls, rightControls);
  controls.append(progress, controlsRow, pauseBar);
  stage.appendChild(controls);

  const overlay = document.createElement("div");
  overlay.className = "adstream-overlay";

  const meta = document.createElement("div");
  meta.className = "adstream-meta";
  const overlayImage = document.createElement("img");
  const overlayBody = document.createElement("div");
  overlayBody.className = "adstream-overlay-body";
  const overlayCopy = document.createElement("p");
  overlayCopy.className = "adstream-overlay-copy";
  overlayCopy.textContent = "영상이 잠시 멈춘 동안 확인해볼 만한 광고입니다.";
  const overlayTitle = document.createElement("p");
  overlayTitle.className = "adstream-overlay-title";
  const actions = document.createElement("div");
  actions.className = "adstream-overlay-actions";
  const openButton = document.createElement("button");
  openButton.className = "adstream-btn adstream-btn-primary";
  openButton.textContent = "자세히 보기";
  const closeButton = document.createElement("button");
  closeButton.className = "adstream-btn adstream-btn-secondary";
  closeButton.textContent = "닫기";
  const badge = document.createElement("div");
  badge.className = "adstream-badge";
  badge.textContent = "Pause Ad";
  const hint = document.createElement("div");
  hint.className = "adstream-hint";
  hint.textContent = "재생을 누르면 광고가 닫힙니다.";

  actions.append(openButton, closeButton);
  meta.append(badge, hint);
  overlayBody.append(overlayTitle, overlayCopy, actions);
  overlay.append(meta, overlayImage, overlayBody);
  layout.append(stage, overlay);
  shell.append(layout);
  container.innerHTML = "";
  container.appendChild(shell);

  function showControls() {
    controls.classList.remove("adstream-controls-hidden");
  }

  function clearControlsHideTimer() {
    if (controlsHideTimer) {
      window.clearTimeout(controlsHideTimer);
      controlsHideTimer = null;
    }
  }

  function scheduleHideControls() {
    clearControlsHideTimer();
    if (video.paused || settingsWrap.classList.contains("open")) {
      showControls();
      return;
    }

    controlsHideTimer = window.setTimeout(() => {
      controls.classList.add("adstream-controls-hidden");
    }, 1800);
  }

  function formatTime(totalSeconds: number) {
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function syncPlayButton() {
    playButton.setAttribute("aria-label", video.paused || video.ended ? "재생" : "일시정지");
    playButton.innerHTML = video.paused || video.ended
      ? `
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
          <path d="M9 6.5v11l8.5-5.5z"></path>
        </svg>
      `
      : `
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
          <path d="M7 5h2.5v14H7zM14.5 5H17v14h-2.5z"></path>
        </svg>
      `;
  }

  function syncPauseState() {
    const isPaused = video.paused && !video.ended;
    shell.classList.toggle("adstream-paused", isPaused);
    pauseResumeButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
        <path d="M9 6.5v11l8.5-5.5z"></path>
      </svg>
      <span>재생 하기</span>
    `;
  }

  function togglePlayback() {
    showControls();
    scheduleHideControls();
    if (video.paused || video.ended) {
      dismissedForCurrentPause = false;
      void video.play().catch(() => undefined);
      return;
    }

    ignoreNextPauseAd = false;
    video.pause();
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement === shell) {
      await document.exitFullscreen().catch(() => undefined);
    } else if (shell.requestFullscreen) {
      try {
        await shell.requestFullscreen();
      } catch {
        expanded = !expanded;
        shell.classList.toggle("adstream-shell-expanded", expanded);
        document.body.classList.toggle("adstream-body-locked", expanded);
      }
    } else {
      expanded = !expanded;
      shell.classList.toggle("adstream-shell-expanded", expanded);
      document.body.classList.toggle("adstream-body-locked", expanded);
    }

    showControls();
    scheduleHideControls();
  }

  function syncFullscreenButton() {
    const isFullscreen = document.fullscreenElement === shell || expanded;
    const iconMarkup = isFullscreen
      ? `
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 4v5H4"></path>
            <path d="M15 4v5h5"></path>
            <path d="M20 15h-5v5"></path>
            <path d="M4 15h5v5"></path>
          </svg>
        `
      : `
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M8 3H3v5"></path>
            <path d="M16 3h5v5"></path>
            <path d="M21 16v5h-5"></path>
            <path d="M3 16v5h5"></path>
          </svg>
        `;

    fullscreenButton.setAttribute("aria-label", isFullscreen ? "전체화면 종료" : "전체화면 전환");
    pauseFullscreenButton.setAttribute("aria-label", isFullscreen ? "전체화면 종료" : "전체화면 전환");
    fullscreenButton.innerHTML = iconMarkup;
    pauseFullscreenButton.innerHTML = iconMarkup;
  }

  function syncProgress() {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    const ratio = duration > 0 ? (currentTime / duration) * 100 : 0;
    progressRange.value = String(ratio);
    progressRange.style.setProperty("--range-progress", `${ratio}%`);
    timeText.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  }

  function syncVolume() {
    const volume = video.muted ? 0 : video.volume;
    volumeRange.value = String(volume);
    volumeRange.style.setProperty("--range-progress", `${volume * 100}%`);
    volumeButton.setAttribute("aria-label", video.muted || video.volume === 0 ? "음소거 해제" : "음소거");
    volumeButton.innerHTML = video.muted || video.volume === 0
      ? `
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4z"></path>
          <path d="m23 9-6 6"></path>
          <path d="m17 9 6 6"></path>
        </svg>
      `
      : `
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4z"></path>
          <path d="M15.5 8.5a5 5 0 0 1 0 7"></path>
          <path d="M18.5 5.5a9 9 0 0 1 0 13"></path>
        </svg>
      `;
  }

  function syncSpeedMenu() {
    speedButtons.forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.speed) === video.playbackRate);
    });
    speedValueButton.textContent = `${Number(video.playbackRate.toFixed(2))}x`;
  }

  function setPlaybackRate(nextRate: number) {
    const roundedRate = Math.round(nextRate * 4) / 4;
    video.playbackRate = Math.min(2, Math.max(0.5, roundedRate));
    syncSpeedMenu();
    scheduleHideControls();
  }

  function hideOverlay() {
    shell.classList.remove("adstream-ad-visible");
    currentAd = null;
  }

  async function logImpression(ad: AdData) {
    await postJson(`${apiBaseUrl}/sdk/impression`, {
      siteId: options.siteId,
      adId: ad.id,
      sessionId,
      videoId: options.videoId,
      currentTime: Number(video.currentTime.toFixed(2)),
      timestamp: new Date().toISOString()
    });
  }

  async function requestAd() {
    if (destroyed) return;
    if (video.ended) return;
    if (dismissedForCurrentPause) return;
    if (video.seeking || isSeeking) return;

    const response = await postJson<AdRequestResponse>(`${apiBaseUrl}/sdk/ad-request`, {
      siteId: options.siteId,
      videoId: options.videoId,
      currentTime: Number(video.currentTime.toFixed(2)),
      sessionId
    });

    const adToShow = response?.showAd && response.ad ? response.ad : FALLBACK_AD;

    currentAd = adToShow;
    overlayTitle.textContent = adToShow.title;
    overlayImage.src = adToShow.imageUrl;
    overlayImage.alt = adToShow.title;
    shell.classList.add("adstream-ad-visible");
    await logImpression(adToShow);
  }

  function schedulePauseAd() {
    if (pauseTimer) {
      window.clearTimeout(pauseTimer);
    }

    pauseTimer = window.setTimeout(() => {
      requestAd().catch(() => undefined);
    }, 800);
  }

  function clearPauseTimer() {
    if (pauseTimer) {
      window.clearTimeout(pauseTimer);
      pauseTimer = null;
    }
  }

  video.addEventListener("pause", () => {
    if (ignoreNextPauseAd) {
      ignoreNextPauseAd = false;
      return;
    }
    if (!video.ended) {
      schedulePauseAd();
    }
  });

  video.addEventListener("play", () => {
    dismissedForCurrentPause = false;
    clearPauseTimer();
    hideOverlay();
    syncPlayButton();
    syncPauseState();
    showControls();
    scheduleHideControls();
  });

  video.addEventListener("seeking", () => {
    isSeeking = true;
    clearPauseTimer();
  });

  video.addEventListener("seeked", () => {
    window.setTimeout(() => {
      isSeeking = false;
    }, 250);
  });

  video.addEventListener("ended", () => {
    hideOverlay();
    clearPauseTimer();
    syncPlayButton();
    syncPauseState();
    showControls();
  });

  video.addEventListener("pause", () => {
    syncPlayButton();
    syncPauseState();
    showControls();
    clearControlsHideTimer();
  });
  video.addEventListener("loadedmetadata", syncProgress);
  video.addEventListener("timeupdate", syncProgress);
  video.addEventListener("durationchange", syncProgress);
  video.addEventListener("volumechange", syncVolume);

  video.addEventListener("click", (event) => {
    event.preventDefault();
    togglePlayback();
  });

  video.addEventListener("dblclick", (event) => {
    event.preventDefault();
    void toggleFullscreen().then(syncFullscreenButton);
  });

  fullscreenButton.addEventListener("click", () => {
    fullscreenButton.blur();
    void toggleFullscreen().then(syncFullscreenButton);
  });

  fullscreenButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  pauseFullscreenButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  playButton.addEventListener("click", () => {
    togglePlayback();
  });

  pauseResumeButton.addEventListener("click", () => {
    togglePlayback();
  });

  progressRange.addEventListener("input", () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!duration) return;
    video.currentTime = (Number(progressRange.value) / 100) * duration;
    syncProgress();
  });

  volumeRange.addEventListener("input", () => {
    const nextVolume = Number(volumeRange.value);
    video.muted = nextVolume === 0;
    video.volume = nextVolume;
    syncVolume();
  });

  volumeButton.addEventListener("click", () => {
    if (video.muted || video.volume === 0) {
      video.muted = false;
      video.volume = video.volume === 0 ? 1 : video.volume;
    } else {
      video.muted = true;
    }
    syncVolume();
  });

  speedValueButton.addEventListener("click", () => {
    settingsWrap.classList.toggle("open");
    showControls();
    scheduleHideControls();
  });

  speedDownButton.addEventListener("click", () => {
    setPlaybackRate(video.playbackRate - 0.25);
  });

  speedUpButton.addEventListener("click", () => {
    setPlaybackRate(video.playbackRate + 0.25);
  });

  speedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setPlaybackRate(Number(button.dataset.speed));
      settingsWrap.classList.remove("open");
    });
  });

  pauseFullscreenButton.addEventListener("click", () => {
    pauseFullscreenButton.blur();
    void toggleFullscreen().then(syncFullscreenButton);
  });

  function handleEscape(event: KeyboardEvent) {
    if (destroyed) return;
    if (event.key !== "Escape") return;
    if (document.fullscreenElement === shell) return;
    if (!expanded) return;
    expanded = false;
    shell.classList.remove("adstream-shell-expanded");
    document.body.classList.remove("adstream-body-locked");
    syncFullscreenButton();
    settingsWrap.classList.remove("open");
    showControls();
    clearControlsHideTimer();
  }

  window.addEventListener("keydown", handleEscape, true);

  function isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    return (
      target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    );
  }

  function handleKeydown(event: KeyboardEvent) {
    if (destroyed) return;
    if (isEditableTarget(event.target)) return;

    if (event.code === "KeyF" || event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      void toggleFullscreen().then(syncFullscreenButton);
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      event.stopPropagation();
      togglePlayback();
      return;
    }

    if (event.code === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      video.currentTime = Math.max(0, video.currentTime - 10);
      syncProgress();
      showControls();
      scheduleHideControls();
      return;
    }

    if (event.code === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      const duration = Number.isFinite(video.duration) ? video.duration : video.currentTime + 10;
      video.currentTime = Math.min(duration, video.currentTime + 10);
      syncProgress();
      showControls();
      scheduleHideControls();
      return;
    }

    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
      const delta = event.code === "ArrowUp" ? 0.1 : -0.1;
      const nextVolume = Math.min(1, Math.max(0, (video.muted ? 0 : video.volume) + delta));
      video.muted = nextVolume === 0;
      video.volume = nextVolume;
      syncVolume();
      showControls();
      scheduleHideControls();
    }
  }

  function handleKeyup(event: KeyboardEvent) {
    if (destroyed) return;
    if (event.code !== "Space") return;
    if (isEditableTarget(event.target)) return;

    event.preventDefault();
    event.stopPropagation();
  }

  window.addEventListener("keydown", handleKeydown, true);
  window.addEventListener("keyup", handleKeyup, true);

  function handleDocumentClick(event: MouseEvent) {
    if (!(event.target instanceof Node)) return;
    if (settingsWrap.contains(event.target)) return;
    settingsWrap.classList.remove("open");
    scheduleHideControls();
  }

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("fullscreenchange", () => {
    expanded = false;
    shell.classList.remove("adstream-shell-expanded");
    document.body.classList.remove("adstream-body-locked");
    syncFullscreenButton();
  });

  stage.addEventListener("mousemove", () => {
    showControls();
    scheduleHideControls();
  });

  stage.addEventListener("mouseleave", () => {
    scheduleHideControls();
  });

  stage.addEventListener("touchstart", () => {
    showControls();
    scheduleHideControls();
  }, { passive: true });

  closeButton.addEventListener("click", () => {
    dismissedForCurrentPause = true;
    hideOverlay();
  });

  openButton.addEventListener("click", async () => {
    if (!currentAd) return;

    await postJson(`${apiBaseUrl}/sdk/click`, {
      siteId: options.siteId,
      adId: currentAd.id,
      sessionId,
      videoId: options.videoId,
      currentTime: Number(video.currentTime.toFixed(2)),
      timestamp: new Date().toISOString()
    });

    window.open(currentAd.clickUrl, "_blank", "noopener,noreferrer");
  });

  syncPlayButton();
  syncPauseState();
  syncProgress();
  syncVolume();
  syncSpeedMenu();
  syncFullscreenButton();
  showControls();
  scheduleHideControls();

  return {
    destroy() {
      destroyed = true;
      clearPauseTimer();
      clearControlsHideTimer();
      window.removeEventListener("keydown", handleKeydown, true);
      window.removeEventListener("keyup", handleKeyup, true);
      window.removeEventListener("keydown", handleEscape, true);
      document.removeEventListener("click", handleDocumentClick);
      document.body.classList.remove("adstream-body-locked");
      shell.remove();
    }
  };
}

const AdStreamPlayer = {
  init(options: InitOptions) {
    return buildPlayer(options);
  }
};

declare global {
  interface Window {
    AdStreamPlayer: typeof AdStreamPlayer;
  }
}

window.AdStreamPlayer = AdStreamPlayer;

export { AdStreamPlayer };
