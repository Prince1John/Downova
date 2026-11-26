(() => {
  // src/extension/content.js
  (() => {
    if (window.__downovaHover) return;
    window.__downovaHover = true;
    const STREAM = /\.(m3u8|mpd|ism|f4m)(\?|#|$)/i;
    let host = null, btn = null, label = null, current = null, hideTimer = 0, busy = false, last = 0;
    const directSrc = (v) => {
      const s = v.currentSrc || v.src;
      if (!s) return null;
      try {
        const u = new URL(s, location.href);
        if (!/^https?:$/.test(u.protocol) || STREAM.test(u.pathname)) return null;
        return u.href;
      } catch {
        return null;
      }
    };
    function build() {
      host = document.createElement("div");
      host.setAttribute("data-downova", "");
      host.style.cssText = "all:initial;position:fixed;z-index:2147483647;top:0;left:0;width:0;height:0;pointer-events:none;";
      const root = host.attachShadow({ mode: "closed" });
      root.innerHTML = `<style>
      button{all:initial;position:fixed;display:none;align-items:center;gap:7px;box-sizing:border-box;padding:7px 11px 7px 8px;border-radius:10px;
        background:rgba(6,12,10,.82);backdrop-filter:blur(8px);border:1px solid rgba(46,229,157,.55);color:#e9fff5;font:600 12px/1 system-ui,sans-serif;cursor:pointer;pointer-events:auto;box-shadow:0 6px 22px rgba(0,0,0,.45)}
      button:hover{border-color:#2ee59d;background:rgba(10,24,19,.92)} button:focus-visible{outline:2px solid #2ee59d;outline-offset:2px}
      svg{width:16px;height:16px;stroke:#2ee59d;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
      button[data-s=loading] svg{animation:s 1s linear infinite} button[data-s=ok]{border-color:#2ee59d} button[data-s=err]{border-color:#ff7a7a} button[data-s=err] svg{stroke:#ff7a7a}
      @keyframes s{to{transform:rotate(360deg)}} @media (prefers-reduced-motion:reduce){button[data-s=loading] svg{animation:none}}
    </style><button type="button" title="Download with DOWNOVA" aria-label="Download with DOWNOVA"><svg viewBox="0 0 24 24"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"/></svg><span>Download</span></button>`;
      btn = root.querySelector("button");
      label = root.querySelector("span");
      btn.addEventListener("click", onClick);
      btn.addEventListener("mouseenter", () => clearTimeout(hideTimer));
      (document.body || document.documentElement).appendChild(host);
    }
    function place(v) {
      const r = v.getBoundingClientRect();
      if (r.width < 160 || r.height < 90 || r.bottom < 0 || r.top > innerHeight) return hide();
      if (!host || !host.isConnected) build();
      btn.style.display = "flex";
      const w = btn.offsetWidth || 100;
      btn.style.left = Math.max(4, Math.min(innerWidth - w - 4, r.right - w - 10)) + "px";
      btn.style.top = Math.max(4, Math.min(innerHeight - 40, r.top + 10)) + "px";
    }
    function hide() {
      if (btn) btn.style.display = "none";
      current = null;
    }
    function setState(s, text) {
      if (!btn) return;
      btn.dataset.s = s;
      label.textContent = text;
    }
    async function onClick(e) {
      e.preventDefault();
      e.stopPropagation();
      if (busy || !current) return;
      const url = directSrc(current);
      if (!url) return setState("err", "No direct file");
      busy = true;
      setState("loading", "Starting\u2026");
      try {
        const res = await chrome.runtime.sendMessage({ type: "dn:hover:download", url, pageUrl: location.href });
        if (res?.ok) setState("ok", res.duplicate ? "Already queued" : "Added to queue");
        else setState("err", "Unavailable");
        if (res && !res.ok && res.error) btn.title = res.error;
      } catch {
        setState("err", "Unavailable");
      }
      setTimeout(() => {
        busy = false;
        if (btn) {
          setState("", "Download");
          btn.title = "Download with DOWNOVA";
        }
      }, 2200);
    }
    document.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - last < 120) return;
      last = now;
      const els = document.elementsFromPoint(e.clientX, e.clientY);
      if (host && els.includes(host)) return;
      const v = els.find((el) => el instanceof HTMLVideoElement);
      if (v && directSrc(v)) {
        clearTimeout(hideTimer);
        if (v !== current || !btn || btn.style.display === "none") {
          current = v;
          if (!busy) setState("", "Download");
        }
        place(v);
      } else if (current) {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          if (!busy) hide();
        }, 700);
      }
    }, { passive: true });
    addEventListener("scroll", () => {
      if (current) place(current);
    }, { passive: true, capture: true });
    addEventListener("resize", () => {
      if (current) place(current);
    }, { passive: true });
    addEventListener("pagehide", () => {
      host?.remove();
      host = null;
      btn = null;
      current = null;
    });
    new MutationObserver(() => {
      if (current && !current.isConnected) hide();
    }).observe(document.documentElement, { childList: true, subtree: true });
  })();
})();
