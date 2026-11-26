(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link2 of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link2);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link2) {
    const fetchOpts = {};
    if (link2.integrity) fetchOpts.integrity = link2.integrity;
    if (link2.referrerPolicy) fetchOpts.referrerPolicy = link2.referrerPolicy;
    if (link2.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link2.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link2) {
    if (link2.ep)
      return;
    link2.ep = true;
    const fetchOpts = getFetchOpts(link2);
    fetch(link2.href, fetchOpts);
  }
})();
const SVG_NS = "http://www.w3.org/2000/svg";
const PROP = /* @__PURE__ */ new Set(["value", "checked", "disabled", "selected", "textContent", "indeterminate"]);
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (PROP.has(k)) el[k] = v;
    else el.setAttribute(k, v === true ? "" : String(v));
  }
  append(el, kids);
  return el;
}
function append(el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  }
  return el;
}
const clear = (el) => {
  while (el.firstChild) el.firstChild.remove();
  return el;
};
const P = {
  scan: "M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16",
  queue: "M12 4v10m0 0 4-4m-4 4-4-4M5 19h14",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  library: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  play: "M8 5v14l11-7z",
  pause: "M8 5v14M16 5v14",
  pdf: "M7 3h7l5 5v13H7zM14 3v5h5M9.5 14h5M9.5 17h5",
  zip: "M4 5h16v4H4zM5 9v10h14V9M10 13h4",
  convert: "M4 8h13l-3-3M20 16H7l3 3",
  dup: "M8 8h11v11H8zM5 16V5h11",
  chart: "M5 20V10M12 20V4M19 20v-7",
  phone: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
  clock: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4",
  external: "M14 4h6v6M20 4l-9 9M18 14v5H5V6h5",
  trash: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
  x: "M6 6l12 12M18 6L6 18",
  check: "M5 12l5 5 9-11",
  star: "M12 4l2.5 5 5.5.8-4 3.9.9 5.5L12 16.6 7.1 19.2 8 13.7 4 9.8l5.5-.8z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  retry: "M4 12a8 8 0 1 1 3 6.2M4 19v-5h5",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  list: "M4 6h16M4 12h16M4 18h16",
  shield: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z",
  plus: "M12 5v14M5 12h14",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4",
  video: "M4 5h16v14H4zM9 5v14M15 5v14",
  audio: "M9 18V6l10-2v12M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM19 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
  document: "M7 3h7l5 5v13H7zM14 3v5h5M9.5 14h5M9.5 17h5",
  archive: "M4 5h16v4H4zM5 9v10h14V9M10 13h4",
  other: "M6 3h8l4 4v14H6z",
  prev: "M7 5v14M19 5l-9 7 9 7z",
  next: "M17 5v14M5 5l9 7-9 7z",
  repeat: "M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4",
  shuffle: "M4 17h3l10-10h3M17 4l3 3-3 3M4 7h3l3 3M14 14l3 3h3M17 14l3 3-3 3",
  full: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  save: "M12 4v11m0 0 4-4m-4 4-4-4M5 19h14",
  share: "M12 3v12M8 7l4-4 4 4M5 13v7h14v-7",
  edit: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4",
  tag: "M4 4h8l8 8-8 8-8-8zM8 8h.01",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01",
  minus: "M5 12h14",
  print: "M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z",
  up: "M6 14l6-6 6 6",
  down: "M6 10l6 6 6-6",
  lock: "M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3"
};
function icon(name, size = 18) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", P[name] || P.other);
  svg.append(path);
  return svg;
}
function button(label, { icon: ic, kind = "", onClick, title, disabled, type = "button" } = {}) {
  return h("button", { class: `btn ${kind}`.trim(), type, title: title || (ic && !label ? label : null), "aria-label": title || label || null, disabled, onClick }, ic ? icon(ic, 16) : null, label ? h("span", null, label) : null);
}
let toastHost;
function toast(message, kind = "info") {
  if (!toastHost || !toastHost.isConnected) {
    toastHost = h("div", { class: "toasts", role: "status", "aria-live": "polite" });
    document.body.append(toastHost);
  }
  const t = h("div", { class: `toast ${kind}` }, String(message));
  toastHost.append(t);
  setTimeout(() => t.remove(), kind === "error" ? 6500 : 3200);
}
function modal({ title, body, actions = (close) => [button("Close", { onClick: () => close(null) })], wide = false }) {
  return new Promise((resolve) => {
    const dlg = h("dialog", { class: `modal ${wide ? "wide" : ""}`.trim(), "aria-label": title });
    let done2 = false;
    const close = (v) => {
      if (done2) return;
      done2 = true;
      try {
        dlg.close?.();
      } catch {
      }
      dlg.remove();
      resolve(v);
    };
    dlg.append(
      h("header", { class: "modal-head" }, h("h2", null, title), button("", { icon: "x", kind: "ghost", title: "Close", onClick: () => close(null) })),
      h("div", { class: "modal-body" }, typeof body === "function" ? body(close) : body),
      h("footer", { class: "modal-foot" }, actions(close))
    );
    dlg.addEventListener("cancel", (e) => {
      e.preventDefault();
      close(null);
    });
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) close(null);
    });
    document.body.append(dlg);
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
  });
}
const confirmDialog = (message, { okLabel = "Confirm", danger = false, title = "Please confirm" } = {}) => modal({ title, body: h("p", null, message), actions: (close) => [button("Cancel", { onClick: () => close(false) }), button(okLabel, { kind: danger ? "danger" : "primary", onClick: () => close(true) })] }).then((v) => v === true);
function promptDialog(title, { value = "", label = "", okLabel = "Save" } = {}) {
  const input = h("input", { class: "field", value, "aria-label": label || title });
  return modal({
    title,
    body: (close) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") close(input.value);
      });
      setTimeout(() => input.focus(), 30);
      return h("label", { class: "stack" }, label ? h("span", { class: "muted" }, label) : null, input);
    },
    actions: (close) => [button("Cancel", { onClick: () => close(null) }), button(okLabel, { kind: "primary", onClick: () => close(input.value) })]
  });
}
function saveBlobAsFile(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = h("a", { href: url, download: name, rel: "noopener" });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3e4);
}
const emptyState = (title, hint, action) => h("div", { class: "empty" }, h("strong", null, title), hint ? h("p", null, hint) : null, action || null);
const badge = (text, kind = "") => h("span", { class: `badge ${kind}`.trim() }, text);
const field = (label, control, hint) => h("label", { class: "stack" }, h("span", { class: "lbl" }, label), control, null);
function toggle(checked, onChange, label) {
  const input = h("input", { type: "checkbox", checked: Boolean(checked), role: "switch", "aria-label": label || null });
  input.addEventListener("change", () => onChange(input.checked));
  return h("span", { class: "switch" }, input, h("i", { "aria-hidden": "true" }));
}
const debounce = (fn, ms = 200) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};
const INVALID_FS = /[<>:"/\\|?*\u0000-\u001f]/g;
const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
function sanitizeFilename(name, fallback = "download") {
  let n = String(name ?? "").normalize("NFKC").replace(INVALID_FS, "_").replace(/\s+/g, " ").trim();
  n = n.replace(/^\.+/, "").replace(/[. ]+$/, "");
  if (RESERVED.test(n)) n = "_" + n;
  if (!n) n = fallback;
  if (n.length > 180) {
    const dot = n.lastIndexOf(".");
    const ext = dot > 0 && n.length - dot <= 10 ? n.slice(dot) : "";
    n = n.slice(0, 180 - ext.length) + ext;
  }
  return n;
}
function parseUrl(input, base) {
  try {
    return new URL(String(input ?? "").trim(), base);
  } catch {
    return null;
  }
}
function validateDownloadUrl(input, { allowData = false } = {}) {
  const u = parseUrl(input);
  if (!u) return { ok: false, error: "That is not a valid URL." };
  if (u.protocol === "http:" || u.protocol === "https:") {
    if (u.username || u.password) return { ok: false, error: "URLs with embedded credentials are not accepted." };
    return { ok: true, url: u.href };
  }
  if (u.protocol === "data:" && allowData) return { ok: true, url: u.href };
  if (u.protocol === "blob:") return { ok: false, code: "blob", error: "Blob links only work inside the page that created them." };
  return { ok: false, error: `${u.protocol} links cannot be downloaded.` };
}
function fileNameFromUrl(url, fallback = "download") {
  const u = parseUrl(url);
  if (!u) return fallback;
  if (u.protocol === "data:") return fallback;
  const last = u.pathname.split("/").filter(Boolean).pop() || "";
  let decoded = last;
  try {
    decoded = decodeURIComponent(last);
  } catch {
  }
  return sanitizeFilename(decoded, fallback);
}
function splitName(name) {
  const dot = name.lastIndexOf(".");
  return dot > 0 && name.length - dot <= 10 ? { base: name.slice(0, dot), ext: name.slice(dot + 1) } : { base: name, ext: "" };
}
function hostOf(url) {
  const u = parseUrl(url);
  return u ? u.hostname : "";
}
function formatBytes(n) {
  if (!Number.isFinite(n) || n < 0) return "–";
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = n / 1024, i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 100 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
}
function formatDuration(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "–";
  const s = Math.round(sec), h2 = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60;
  const p = (x) => String(x).padStart(2, "0");
  return h2 ? `${h2}:${p(m)}:${p(r)}` : `${m}:${p(r)}`;
}
function uid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}
function bytesToBase64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 32768) s += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return btoa(s);
}
function base64ToBytes(b64) {
  const s = atob(b64), out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}
const T = {};
const add = (category, list) => {
  for (const [ext, mime] of list) T[ext] = { mime, category };
};
add("image", [["png", "image/png"], ["jpg", "image/jpeg"], ["jpeg", "image/jpeg"], ["gif", "image/gif"], ["svg", "image/svg+xml"], ["webp", "image/webp"], ["bmp", "image/bmp"], ["ico", "image/x-icon"], ["tif", "image/tiff"], ["tiff", "image/tiff"], ["avif", "image/avif"]]);
add("audio", [["mp3", "audio/mpeg"], ["wav", "audio/wav"], ["ogg", "audio/ogg"], ["oga", "audio/ogg"], ["m4a", "audio/mp4"], ["aac", "audio/aac"], ["flac", "audio/flac"], ["opus", "audio/opus"]]);
add("video", [["mp4", "video/mp4"], ["m4v", "video/mp4"], ["webm", "video/webm"], ["mov", "video/quicktime"], ["avi", "video/x-msvideo"], ["mkv", "video/x-matroska"], ["ogv", "video/ogg"]]);
add("document", [["pdf", "application/pdf"], ["doc", "application/msword"], ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], ["xls", "application/vnd.ms-excel"], ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], ["ppt", "application/vnd.ms-powerpoint"], ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"], ["csv", "text/csv"], ["txt", "text/plain"], ["rtf", "application/rtf"], ["odt", "application/vnd.oasis.opendocument.text"], ["ods", "application/vnd.oasis.opendocument.spreadsheet"], ["odp", "application/vnd.oasis.opendocument.presentation"], ["md", "text/markdown"], ["json", "application/json"], ["xml", "application/xml"]]);
add("archive", [["zip", "application/zip"], ["rar", "application/vnd.rar"], ["7z", "application/x-7z-compressed"], ["tar", "application/x-tar"], ["gz", "application/gzip"], ["tgz", "application/gzip"], ["bz2", "application/x-bzip2"], ["xz", "application/x-xz"]]);
const CATEGORIES = ["image", "video", "audio", "document", "archive", "other"];
const CATEGORY_LABELS = { image: "Images", video: "Videos", audio: "Audio", document: "Documents", archive: "Archives", other: "Other files" };
const STREAM_EXT = /* @__PURE__ */ new Set(["m3u8", "mpd", "ism", "f4m"]);
const STREAM_MIME = /mpegurl|dash\+xml|vnd\.ms-sstr/i;
const GENERIC_MIME = /^(application\/octet-stream|binary\/octet-stream|application\/force-download|text\/html|application\/xhtml\+xml)$/i;
const MIME_TO_EXT = {};
for (const [ext, v] of Object.entries(T)) if (!(v.mime in MIME_TO_EXT)) MIME_TO_EXT[v.mime] = ext;
Object.assign(MIME_TO_EXT, { "image/jpeg": "jpg", "audio/mpeg": "mp3", "audio/x-wav": "wav", "audio/wave": "wav", "image/jpg": "jpg", "application/x-zip-compressed": "zip", "image/vnd.microsoft.icon": "ico", "audio/x-m4a": "m4a", "video/mp4": "mp4", "text/csv": "csv" });
function cleanMime(m) {
  return String(m || "").split(";")[0].trim().toLowerCase();
}
function extFromPath(pathOrUrl) {
  let p = String(pathOrUrl || "");
  try {
    if (/^[a-z][a-z0-9+.-]*:/i.test(p)) p = new URL(p).pathname;
  } catch {
  }
  p = p.split(/[?#]/)[0];
  const m = /\.([a-z0-9]{1,5})$/i.exec(p);
  return m ? m[1].toLowerCase() : "";
}
function categoryForMime(mime) {
  const m = cleanMime(mime);
  if (!m) return null;
  if (MIME_TO_EXT[m] && T[MIME_TO_EXT[m]]) return T[MIME_TO_EXT[m]].category;
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("video/")) return "video";
  if (m.startsWith("audio/")) return "audio";
  if (m.startsWith("text/")) return "document";
  return null;
}
const extForMime = (mime) => MIME_TO_EXT[cleanMime(mime)] || "";
function sniff(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const at = (i, s) => s.every((v, k) => b[i + k] === v);
  const asc = (i, str) => [...str].every((c, k) => b[i + k] === c.charCodeAt(0));
  if (b.length < 4) return null;
  if (at(0, [137, 80, 78, 71])) return { mime: "image/png", ext: "png" };
  if (at(0, [255, 216, 255])) return { mime: "image/jpeg", ext: "jpg" };
  if (asc(0, "GIF8")) return { mime: "image/gif", ext: "gif" };
  if (asc(0, "RIFF") && asc(8, "WEBP")) return { mime: "image/webp", ext: "webp" };
  if (asc(0, "RIFF") && asc(8, "WAVE")) return { mime: "audio/wav", ext: "wav" };
  if (asc(0, "RIFF") && asc(8, "AVI ")) return { mime: "video/x-msvideo", ext: "avi" };
  if (asc(0, "BM") && b.length > 14) return { mime: "image/bmp", ext: "bmp" };
  if (at(0, [0, 0, 1, 0])) return { mime: "image/x-icon", ext: "ico" };
  if (at(0, [73, 73, 42, 0]) || at(0, [77, 77, 0, 42])) return { mime: "image/tiff", ext: "tiff" };
  if (asc(4, "ftyp")) {
    const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
    if (brand === "qt  ") return { mime: "video/quicktime", ext: "mov" };
    if (brand === "M4A ") return { mime: "audio/mp4", ext: "m4a" };
    if (/^avi[fs]$/.test(brand)) return { mime: "image/avif", ext: "avif" };
    return { mime: "video/mp4", ext: "mp4" };
  }
  if (at(0, [26, 69, 223, 163])) return { mime: "video/webm", ext: "webm" };
  if (asc(0, "OggS")) return { mime: "audio/ogg", ext: "ogg" };
  if (asc(0, "fLaC")) return { mime: "audio/flac", ext: "flac" };
  if (asc(0, "ID3") || b[0] === 255 && (b[1] & 224) === 224) return { mime: "audio/mpeg", ext: "mp3" };
  if (asc(0, "%PDF")) return { mime: "application/pdf", ext: "pdf" };
  if (at(0, [80, 75, 3, 4]) || at(0, [80, 75, 5, 6])) return { mime: "application/zip", ext: "zip" };
  if (asc(0, "Rar!")) return { mime: "application/vnd.rar", ext: "rar" };
  if (at(0, [55, 122, 188, 175, 39, 28])) return { mime: "application/x-7z-compressed", ext: "7z" };
  if (at(0, [31, 139])) return { mime: "application/gzip", ext: "gz" };
  if (asc(0, "{\\rtf")) return { mime: "application/rtf", ext: "rtf" };
  const head = new TextDecoder().decode(b.subarray(0, Math.min(b.length, 600))).replace(/^\uFEFF/, "").trimStart();
  if (/^<svg[\s>]/i.test(head) || /^<\?xml/i.test(head) && /<svg[\s>]/i.test(head)) return { mime: "image/svg+xml", ext: "svg" };
  return null;
}
function classify({ url = "", mime = "", tag = "", download = null } = {}) {
  const signals = [];
  const m = cleanMime(mime);
  let ext = extFromPath(download || "") || extFromPath(url);
  if (url.startsWith("data:")) {
    const dm = /^data:([^;,]+)/i.exec(url);
    if (dm) {
      signals.push("data-uri");
      ext = extForMime(dm[1]) || ext;
      if (!m) mime = dm[1];
    }
  }
  const mm = cleanMime(mime);
  const specificMime = mm && !GENERIC_MIME.test(mm);
  let category = null, outMime = "";
  if (specificMime) {
    category = categoryForMime(mm);
    outMime = mm;
    signals.push("mime");
    if (!ext || !T[ext]) ext = extForMime(mm) || ext;
  }
  if (T[ext]) {
    signals.push("extension");
    if (!category) {
      category = T[ext].category;
      outMime = outMime || T[ext].mime;
    }
  }
  if (!category) {
    const tagCat = { img: "image", video: "video", audio: "audio", source: null }[tag];
    if (tagCat) {
      category = tagCat;
      signals.push("element");
    }
  } else if (["img", "video", "audio"].includes(tag)) signals.push("element");
  if (download !== null && download !== void 0) signals.push("download-attribute");
  const agree = signals.filter((s) => s === "mime" || s === "extension" || s === "element" || s === "data-uri").length;
  return { category: category || "other", ext: T[ext] ? ext : ext || "", mime: outMime, signals, known: Boolean(category), confidence: agree >= 2 ? "high" : agree === 1 ? "medium" : "low" };
}
function isStreamingManifest(url, mime) {
  return STREAM_EXT.has(extFromPath(url)) || STREAM_MIME.test(mime || "");
}
const DB = "downova", VERSION = 1;
let dbp = null;
function openDb(factory = globalThis.indexedDB) {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    const req = factory.open(DB, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("files")) db.createObjectStore("files", { keyPath: "id" });
      if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbp = null;
      reject(req.error);
    };
  });
  return dbp;
}
const wrap = (req) => new Promise((res, rej) => {
  req.onsuccess = () => res(req.result);
  req.onerror = () => rej(req.error);
});
const done = (tx) => new Promise((res, rej) => {
  tx.oncomplete = () => res();
  tx.onerror = () => rej(tx.error);
  tx.onabort = () => rej(tx.error);
});
async function detectCategory(file) {
  let cls = classify({ url: file.name || "", mime: file.type || "" });
  if (!cls.known) {
    const sn = sniff(new Uint8Array(await file.slice(0, 600).arrayBuffer()));
    if (sn) cls = classify({ url: `x.${sn.ext}`, mime: sn.mime });
  }
  return { category: cls.category, mime: cls.mime || file.type || "" };
}
const Library = {
  async put(meta, blob) {
    const db = await openDb();
    const tx = db.transaction(["files", "blobs"], "readwrite");
    tx.objectStore("files").put(meta);
    tx.objectStore("blobs").put({ id: meta.id, blob });
    await done(tx);
    return meta;
  },
  async update(id, patch) {
    const db = await openDb();
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    const cur = await wrap(store.get(id));
    if (!cur) {
      tx.abort();
      return null;
    }
    const next = { ...cur, ...patch, id };
    store.put(next);
    await done(tx);
    return next;
  },
  async all() {
    const db = await openDb();
    return wrap(db.transaction("files").objectStore("files").getAll());
  },
  async get(id) {
    const db = await openDb();
    return wrap(db.transaction("files").objectStore("files").get(id));
  },
  async blob(id) {
    const db = await openDb();
    const r = await wrap(db.transaction("blobs").objectStore("blobs").get(id));
    return r?.blob || null;
  },
  async remove(ids) {
    const db = await openDb();
    const tx = db.transaction(["files", "blobs"], "readwrite");
    for (const id of [].concat(ids)) {
      tx.objectStore("files").delete(id);
      tx.objectStore("blobs").delete(id);
    }
    await done(tx);
  },
  async clear() {
    const db = await openDb();
    const tx = db.transaction(["files", "blobs"], "readwrite");
    tx.objectStore("files").clear();
    tx.objectStore("blobs").clear();
    await done(tx);
  },
  newId: uid
};
async function importFiles(files, { tags = [], extract, onProgress, nameOf } = {}) {
  const out = [];
  let i = 0;
  for (const file of files) {
    onProgress?.(i++, files.length, file.name);
    if (!file || file.size === 0) continue;
    const { category, mime } = await detectCategory(file);
    const meta = { id: uid(), name: nameOf ? nameOf(file) : file.name, size: file.size, type: mime, category, addedAt: Date.now(), lastOpened: null, favorite: false, tags: [...tags], origin: file.lastModified || null };
    if (extract) Object.assign(meta, await extract(file, category).catch(() => ({})));
    await Library.put(meta, file);
    out.push(meta);
  }
  onProgress?.(files.length, files.length, "");
  return out;
}
const MENU_ACTIONS = [
  ["saveImage", "Save Image with DOWNOVA"],
  ["savePreferred", "Save in preferred format"],
  ["savePng", "Save Image As PNG"],
  ["saveJpeg", "Save Image As JPEG"],
  ["saveJpg", "Save Image As JPG"],
  ["saveWebp", "Save Image As WebP"],
  ["saveOriginal", "Save Original Image"],
  ["saveSvg", "Save as SVG"],
  ["copyImageUrl", "Copy Image URL"],
  ["copyImage", "Copy Image"],
  ["imageInfo", "View Image Information"],
  ["openImage", "Open Image in DOWNOVA"],
  ["linkDownload", "Download Link with DOWNOVA"],
  ["linkQueue", "Add Link to Download Queue"],
  ["linkCopy", "Copy Link Address"],
  ["linkOpen", "Open Link in DOWNOVA"],
  ["linkDetect", "Detect File Type"],
  ["linkInfo", "View Link Information"],
  ["videoDownload", "Download Video with DOWNOVA"],
  ["videoQueue", "Add Video to Queue"],
  ["videoInfo", "View Video Information"],
  ["videoCopy", "Copy Media URL"],
  ["audioDownload", "Download Audio with DOWNOVA"],
  ["audioQueue", "Add Audio to Queue"],
  ["audioInfo", "View Audio Information"],
  ["audioCopy", "Copy Audio URL"],
  ["pageScan", "Scan Page for Media"],
  ["pageDownloadAll", "Download All Eligible Media"],
  ["pageDashboard", "Open DOWNOVA Dashboard"],
  ["pageCount", "View Detected File Count"],
  ["selectionDetect", "Detect Supported Media URL"]
];
const DEFAULT_SETTINGS = {
  theme: "dark",
  accent: "emerald",
  hoverEnabled: false,
  askWhereToSave: false,
  keepHistory: true,
  concurrency: 3,
  imageFormat: "png",
  imageQuality: 0.92,
  imageMaxWidth: 0,
  menu: Object.fromEntries(MENU_ACTIONS.map(([id]) => [id, true])),
  notifications: { started: false, completed: true, failed: true, conversion: true, scheduled: true, extraction: true }
};
const THEMES = ["dark", "light", "system"];
const ACCENTS = { emerald: "#2ee59d", cyan: "#35d0e6", amber: "#f5b83d", violet: "#a98bff" };
const IMAGE_FORMATS = ["png", "jpeg", "jpg", "webp"];
const bool = (v, d) => typeof v === "boolean" ? v : d;
const objOf = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : {};
function normalizeSettings(input) {
  const s = objOf(input), d = DEFAULT_SETTINGS;
  const menu = objOf(s.menu), notif = objOf(s.notifications), pl = objOf(s.player), lib = objOf(s.library);
  const n = Number(s.concurrency), q = Number(s.imageQuality), w = Number(s.imageMaxWidth), rate = Number(pl.rate), vol = Number(pl.volume);
  return {
    theme: THEMES.includes(s.theme) ? s.theme : d.theme,
    accent: s.accent in ACCENTS ? s.accent : d.accent,
    hoverEnabled: bool(s.hoverEnabled, d.hoverEnabled),
    askWhereToSave: bool(s.askWhereToSave, d.askWhereToSave),
    keepHistory: bool(s.keepHistory, d.keepHistory),
    concurrency: Number.isFinite(n) ? clamp(Math.round(n), 1, 6) : d.concurrency,
    imageFormat: IMAGE_FORMATS.includes(s.imageFormat) ? s.imageFormat : d.imageFormat,
    imageQuality: Number.isFinite(q) ? clamp(q, 0.1, 1) : d.imageQuality,
    imageMaxWidth: Number.isFinite(w) ? clamp(Math.round(w), 0, 16e3) : d.imageMaxWidth,
    menu: Object.fromEntries(MENU_ACTIONS.map(([id]) => [id, bool(menu[id], true)])),
    notifications: Object.fromEntries(Object.keys(d.notifications).map((k) => [k, bool(notif[k], d.notifications[k])])),
    player: { rate: Number.isFinite(rate) ? clamp(rate, 0.25, 4) : 1, volume: Number.isFinite(vol) ? clamp(vol, 0, 1) : 1, repeat: ["off", "one", "all"].includes(pl.repeat) ? pl.repeat : "off", shuffle: bool(pl.shuffle, false) },
    library: { view: lib.view === "list" ? "list" : "grid", sort: ["added", "name", "size", "type"].includes(lib.sort) ? lib.sort : "added" }
  };
}
function mergeSettings(current, patch) {
  const base = normalizeSettings(current), p = objOf(patch);
  return normalizeSettings({ ...base, ...p, menu: { ...base.menu, ...objOf(p.menu) }, notifications: { ...base.notifications, ...objOf(p.notifications) }, player: { ...base.player, ...objOf(p.player) }, library: { ...base.library, ...objOf(p.library) } });
}
const ELIGIBLE = /* @__PURE__ */ new Set(["downloadable", "unknown"]);
const isEligible = (item) => ELIGIBLE.has(item.status);
const SKIP_SCHEMES = /* @__PURE__ */ new Set(["javascript:", "mailto:", "tel:", "about:", "chrome:", "chrome-extension:", "file:", "ftp:", "sms:"]);
function analyzeCandidates(candidates, { pageUrl = "" } = {}) {
  const map = /* @__PURE__ */ new Map();
  for (const c of candidates || []) {
    if (!c || !c.url) continue;
    const u = parseUrl(c.url, pageUrl || void 0);
    if (!u || SKIP_SCHEMES.has(u.protocol)) continue;
    const isAnchor = c.tag === "a";
    const cls = classify({ url: u.href, mime: c.mime, tag: c.tag, download: c.download });
    if (isAnchor && c.download == null && !cls.known) continue;
    if (isAnchor && c.download == null && u.protocol === "data:" && !cls.known) continue;
    const key = u.protocol === "data:" ? u.href.slice(0, 200) + ":" + u.href.length : (u.hash = "", u.href);
    let status2 = "downloadable", reason = "";
    if (u.protocol === "blob:") {
      status2 = "restricted";
      reason = "Blob URL: it only exists inside the page that created it and cannot be fetched from outside.";
    } else if (isStreamingManifest(u.href, c.mime)) {
      status2 = "unsupported";
      reason = "Streaming manifest. DOWNOVA does not reconstruct segmented or protected streams.";
    } else if (c.kind === "poster") {
      status2 = "preview-only";
      reason = "Poster frame for a video, not the video itself.";
    } else if (u.protocol !== "http:" && u.protocol !== "https:" && u.protocol !== "data:") {
      status2 = "unsupported";
      reason = `${u.protocol} resources cannot be downloaded.`;
    } else if (!cls.known) {
      status2 = "unknown";
      reason = "File type could not be determined from the link. It will be identified when downloaded.";
    }
    const existing = map.get(key);
    const name = c.download && c.download.trim() || (u.protocol === "data:" ? `inline-${cls.category}` : fileNameFromUrl(u.href, "download"));
    const item = {
      id: uid(),
      key,
      url: u.href,
      name,
      category: cls.category,
      ext: cls.ext,
      mime: cleanMime(c.mime) || cls.mime,
      confidence: cls.confidence,
      signals: cls.signals,
      tags: [c.tag],
      status: status2,
      reason,
      size: null,
      source: hostOf(u.href) || (u.protocol === "data:" ? "inline data" : ""),
      width: c.width || 0,
      height: c.height || 0
    };
    if (!existing) {
      map.set(key, item);
      continue;
    }
    existing.tags = [.../* @__PURE__ */ new Set([...existing.tags, c.tag])];
    if (existing.status === "preview-only" && status2 !== "preview-only") Object.assign(existing, { status: status2, reason });
    if (!existing.width && item.width) {
      existing.width = item.width;
      existing.height = item.height;
    }
    if (rank(item.confidence) > rank(existing.confidence)) Object.assign(existing, { category: item.category, ext: item.ext, mime: item.mime, confidence: item.confidence, signals: item.signals });
  }
  return [...map.values()];
}
const rank = (c) => ({ low: 0, medium: 1, high: 2 })[c] ?? 0;
function applyProbe(item, probe) {
  const out = { ...item, probed: true };
  if (!probe || !probe.ok) {
    out.probeNote = probe?.error || "Headers could not be read (blocked by the site or network).";
    return out;
  }
  if (probe.status === 401 || probe.status === 403) return { ...out, status: "restricted", reason: `Access denied (HTTP ${probe.status}). It likely needs a login or special permission.` };
  if (probe.status === 404 || probe.status === 410) return { ...out, status: "unsupported", reason: `Not found (HTTP ${probe.status}).` };
  if (probe.status >= 400) return { ...out, status: "unsupported", reason: `Server error (HTTP ${probe.status}).` };
  if (probe.size != null) out.size = probe.size;
  const mime = cleanMime(probe.mime);
  if (/^text\/html|application\/xhtml/.test(mime) && item.tags.includes("a")) return { ...out, status: "unsupported", reason: "The server returned a web page, not a file." };
  if (mime && !/octet-stream|force-download/.test(mime)) {
    const cls = classify({ url: item.url, mime, tag: item.tags[0] });
    Object.assign(out, { mime, category: cls.category, ext: cls.ext || item.ext, confidence: cls.confidence });
    if (item.status === "unknown" && cls.known) {
      out.status = "downloadable";
      out.reason = "";
    }
  }
  return out;
}
function filterItems(items, { q = "", category = "all" } = {}) {
  const needle = q.trim().toLowerCase();
  return items.filter((it) => (category === "all" || it.category === category) && (!needle || `${it.name} ${it.ext} ${it.mime} ${it.source}`.toLowerCase().includes(needle)));
}
function sortItems(items, by = "page") {
  const a = [...items];
  if (by === "size") a.sort((x, y) => (y.size ?? -1) - (x.size ?? -1));
  else if (by === "name") a.sort((x, y) => x.name.localeCompare(y.name));
  else if (by === "type") a.sort((x, y) => x.category.localeCompare(y.category) || x.ext.localeCompare(y.ext));
  return a;
}
async function probeUrl(url, { fetchFn = globalThis.fetch, timeoutMs = 8e3 } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  const read = (res) => {
    const len = res.headers.get("content-length");
    let size = len != null && /^\d+$/.test(len) ? Number(len) : null;
    const cr = /\/(\d+)$/.exec(res.headers.get("content-range") || "");
    if (cr) size = Number(cr[1]);
    return { ok: true, status: res.status, mime: res.headers.get("content-type") || "", size: size === 0 ? null : size };
  };
  try {
    let res = await fetchFn(url, { method: "HEAD", credentials: "omit", redirect: "follow", signal: ctl.signal });
    if (res.status === 405 || res.status === 501) res = await fetchFn(url, { method: "GET", headers: { Range: "bytes=0-0" }, credentials: "omit", redirect: "follow", signal: ctl.signal });
    return read(res);
  } catch (e) {
    return { ok: false, error: e?.name === "AbortError" ? "Timed out reading headers." : "Headers could not be read. The site may block cross-origin requests, which DOWNOVA does not work around." };
  } finally {
    clearTimeout(t);
  }
}
const pageHead = (title, sub, ...actions) => h("div", { class: "head" }, h("div", { class: "grow" }, h("h1", null, title), sub ? h("p", null, sub) : null), ...actions);
const catIcon = (c) => icon(CATEGORY_LABELS[c] ? c : "other", 20);
function thumbBox(category, src) {
  const box = h("div", { class: "thumb" }, catIcon(category));
  if (src) {
    const img = h("img", { src, alt: "", loading: "lazy", referrerpolicy: "no-referrer" });
    img.addEventListener("load", () => {
      box.replaceChildren(img);
    });
  }
  return box;
}
function urlBag() {
  const urls = /* @__PURE__ */ new Set();
  return { make(blob) {
    const u = URL.createObjectURL(blob);
    urls.add(u);
    return u;
  }, free(u) {
    if (urls.delete(u)) URL.revokeObjectURL(u);
  }, freeAll() {
    urls.forEach((u) => URL.revokeObjectURL(u));
    urls.clear();
  } };
}
const fileInput = ({ accept = "", multiple = true, onFiles }) => {
  const input = h("input", { type: "file", accept, multiple, class: "hidden" });
  input.addEventListener("change", () => {
    const f = [...input.files];
    input.value = "";
    if (f.length) onFiles(f);
  });
  return input;
};
function dropZone(el, onFiles) {
  el.addEventListener("dragover", (e) => {
    e.preventDefault();
    el.classList.add("over");
  });
  el.addEventListener("dragleave", () => el.classList.remove("over"));
  el.addEventListener("drop", (e) => {
    e.preventDefault();
    el.classList.remove("over");
    const f = [...e.dataTransfer?.files || []];
    if (f.length) onFiles(f);
  });
}
const dateLabel = (t) => new Date(t).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
const timeLabel = (t) => new Date(t).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
const toLocalInput = (t) => {
  const d = new Date(t - new Date(t).getTimezoneOffset() * 6e4);
  return d.toISOString().slice(0, 16);
};
async function mount$c(root, ctx, params) {
  const S = { items: [], meta: null, q: "", cat: "all", sort: "page", sel: /* @__PURE__ */ new Set(), loading: false, error: "", showOut: false, probing: false };
  let alive = true;
  const list = h("div", { class: "list" }), out = h("div"), chips = h("div", { class: "chips" }), summary = h("div", { class: "muted small" });
  const q = h("input", { class: "field", type: "search", placeholder: "Search files", "aria-label": "Search results" });
  const sort = h("select", { class: "field", "aria-label": "Sort results", style: "flex:0 0 auto;min-width:120px" }, ...[["page", "Page order"], ["size", "Size"], ["name", "Name"], ["type", "Type"]].map(([v, l]) => h("option", { value: v }, l)));
  const bulk = button("Download selected", { icon: "queue", kind: "primary", disabled: true, onClick: () => download([...S.items].filter((i) => S.sel.has(i.id))) });
  const rescan = button("Rescan", { icon: "retry", onClick: () => scan() });
  const sizes = button("Check sizes", { icon: "info", title: "Read file sizes and types from the servers (only works where the site allows it)", onClick: () => probeAll() });
  const selAll = button("Select all", { onClick: () => {
    const el = visible().filter(isEligible);
    const all = el.every((i) => S.sel.has(i.id));
    el.forEach((i) => all ? S.sel.delete(i.id) : S.sel.add(i.id));
    paint();
  } });
  q.addEventListener("input", debounce(() => {
    S.q = q.value;
    paint();
  }, 150));
  sort.addEventListener("change", () => {
    S.sort = sort.value;
    paint();
  });
  const visible = () => sortItems(filterItems(S.items, { q: S.q, category: S.cat }), S.sort);
  async function download(items) {
    const el = items.filter(isEligible);
    if (!el.length) return ctx.toast("Select at least one downloadable file.", "error");
    const web = el.filter((i) => !i.url.startsWith("data:")), inline = el.filter((i) => i.url.startsWith("data:"));
    let msg = [];
    if (web.length) {
      const r = await ctx.platform.enqueue(web.map((i) => ({ url: i.url, priority: "normal" })));
      if (r?.ok === false) return ctx.toast(r.error || "Could not add to the queue.", "error");
      msg.push(`${r.added} queued`);
      if (r.duplicates) msg.push(`${r.duplicates} already queued`);
      if (r.rejected?.length) msg.push(`${r.rejected.length} rejected`);
    }
    for (const i of inline) {
      try {
        const b = await (await fetch(i.url)).blob();
        ctx.platform.saveBlob(b, `${i.name}${i.ext && !i.name.endsWith("." + i.ext) ? "." + i.ext : ""}`);
        msg.push("1 inline image saved");
      } catch {
        msg.push("1 inline image failed");
      }
    }
    ctx.toast(msg.join(", ") + ".", "ok");
    S.sel.clear();
    paint();
  }
  function row(it) {
    const ok = isEligible(it);
    const dims = it.width && it.height ? `${it.width}×${it.height}` : "";
    const meta = [it.ext ? `.${it.ext}` : "type unknown", it.mime, it.size != null ? formatBytes(it.size) : "", dims, it.source].filter(Boolean);
    const st = it.status === "downloadable" ? badge("Direct file", "ok") : it.status === "unknown" ? badge("Type unknown", "warn") : badge({ "preview-only": "Preview only", unsupported: "Unsupported", restricted: "Restricted" }[it.status], "bad");
    const cb = h("input", { type: "checkbox", checked: S.sel.has(it.id), "aria-label": `Select ${it.name}` });
    cb.addEventListener("change", () => {
      cb.checked ? S.sel.add(it.id) : S.sel.delete(it.id);
      bulk.disabled = S.sel.size === 0;
      bulk.lastChild.textContent = S.sel.size ? `Download ${S.sel.size}` : "Download selected";
    });
    return h(
      "div",
      { class: `item cat-${it.category} ${ok ? "" : "noselect dim"}` },
      ok ? cb : null,
      thumbBox(it.category, it.category === "image" && ok ? it.url : null),
      h("div", { class: "grow" }, h("div", { class: "name trunc", title: it.url }, it.name), h("div", { class: "meta" }, ...meta.map((m) => h("span", null, m))), !ok && it.reason ? h("div", { class: "meta" }, it.reason) : null, it.probeNote && ok ? h("div", { class: "meta" }, it.probeNote) : null),
      h("div", { class: "row gap-s" }, st, ok ? button("", { icon: "save", kind: "ghost", title: `Download ${it.name}`, onClick: () => download([it]) }) : null)
    );
  }
  function paint() {
    const base = S.items;
    const counts2 = Object.fromEntries(CATEGORIES.map((c) => [c, base.filter((i) => i.category === c && isEligible(i)).length]));
    clear(chips).append(...[["all", "All", base.filter(isEligible).length], ...CATEGORIES.map((c) => [c, CATEGORY_LABELS[c], counts2[c]])].filter(([id, , n]) => id === "all" || n > 0 || S.cat === id).map(([id, label, n]) => h("button", { class: `chip ${S.cat === id ? "on" : ""}`, type: "button", "aria-pressed": S.cat === id, onClick: () => {
      S.cat = id;
      paint();
    } }, `${label} ${n}`)));
    const vis = visible(), ok = vis.filter(isEligible), no = vis.filter((i) => !isEligible(i));
    clear(list);
    if (S.loading) list.append(h("div", { class: "bar indet", role: "progressbar", "aria-label": "Scanning" }, h("i")));
    else if (S.error) list.append(emptyState("Could not scan this page", S.error));
    else if (!S.meta) list.append(emptyState("Nothing scanned yet", "Open DOWNOVA from the toolbar on the page you want to scan."));
    else if (!ok.length) list.append(emptyState("No downloadable files found", S.items.length ? "Everything detected is unavailable. See the list below." : "This page does not expose direct files. Images, audio, video and linked documents appear here when they do."));
    else list.append(...ok.slice(0, 400).map(row));
    if (ok.length > 400) list.append(h("div", { class: "muted small" }, `Showing the first 400 of ${ok.length}. Use search or filters to narrow down.`));
    clear(out);
    if (no.length) out.append(h("div", { class: "row", style: "margin:14px 0 6px" }, h("h3", { class: "grow" }, `Unavailable (${no.length})`), button(S.showOut ? "Hide" : "Show", { kind: "sm", onClick: () => {
      S.showOut = !S.showOut;
      paint();
    } })), S.showOut ? h("div", { class: "list" }, ...no.slice(0, 200).map(row)) : null);
    summary.textContent = S.meta ? `${S.meta.title || S.meta.pageUrl} · ${base.filter(isEligible).length} downloadable, ${base.length - base.filter(isEligible).length} unavailable` : "";
    bulk.disabled = S.sel.size === 0;
    bulk.lastChild.textContent = S.sel.size ? `Download ${S.sel.size}` : "Download selected";
    sizes.disabled = S.probing || !ok.length;
    rescan.disabled = S.loading;
  }
  async function probeAll() {
    S.probing = true;
    paint();
    const todo = S.items.filter((i2) => isEligible(i2) && !i2.probed && !i2.url.startsWith("data:")).slice(0, 150);
    let i = 0;
    const worker = async () => {
      while (alive && i < todo.length) {
        const it = todo[i++];
        const r = await ctx.platform.probe(it.url);
        const idx = S.items.findIndex((x) => x.id === it.id);
        if (idx >= 0) S.items[idx] = applyProbe(S.items[idx], r);
        if (i % 5 === 0) paint();
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    S.probing = false;
    if (alive) paint();
  }
  async function scan() {
    S.loading = true;
    S.error = "";
    S.sel.clear();
    paint();
    try {
      const r = await ctx.platform.scanTab(params.tabId ? Number(params.tabId) : void 0);
      S.meta = r;
      S.items = analyzeCandidates(r.candidates, { pageUrl: r.pageUrl });
    } catch (e) {
      S.error = e.message;
      S.meta = null;
      S.items = [];
    }
    S.loading = false;
    if (alive) paint();
  }
  root.append(
    pageHead("Scan this page", "Finds direct, permitted files: links, images, audio and video. Protected or login-only items are listed as unavailable."),
    h("div", { class: "toolbar" }, q, sort),
    h("div", { class: "toolbar" }, rescan, sizes, selAll, bulk),
    chips,
    summary,
    h("div", { style: "margin-top:10px" }, list, out)
  );
  paint();
  scan();
  return () => {
    alive = false;
  };
}
const scanner = { id: "scanner", label: "Scan", icon: "scan", popup: true, needs: (c) => c.scan, mount: mount$c };
const STATUS = { ACTIVE: "active", PAUSED: "paused" };
function counts(items) {
  const c = { queued: 0, active: 0, paused: 0, completed: 0, failed: 0, cancelled: 0, handed_off: 0, total: items.length };
  for (const i of items) c[i.status] = (c[i.status] || 0) + 1;
  return c;
}
function measureSpeed(prev, cur) {
  if (!prev || !cur || cur.t <= prev.t || cur.bytes < prev.bytes) return null;
  const bps = (cur.bytes - prev.bytes) / (cur.t - prev.t) * 1e3;
  if (!(bps > 0)) return { bps: 0, eta: null };
  const eta = cur.total > 0 ? Math.max(0, (cur.total - cur.bytes) / bps) : null;
  return { bps, eta };
}
const LABEL = { queued: "Queued", active: "Downloading", paused: "Paused", completed: "Done", failed: "Failed", cancelled: "Cancelled", handed_off: "Sent to browser" };
const KIND = { completed: "ok", failed: "bad", cancelled: "", active: "ok", paused: "warn", queued: "", handed_off: "warn" };
async function mount$b(root, ctx) {
  let items = await ctx.platform.getQueue();
  let prog = {}, samples = {}, timer = 0, alive = true;
  const body = h("div"), stats = h("div", { class: "muted small" });
  const act = (action, id, value) => ctx.platform.queueAction(action, id, value);
  function row(it) {
    const p = prog[it.id], s = samples[it.id]?.speed;
    const pct = p && p.total > 0 ? Math.min(100, p.bytes / p.total * 100) : null;
    const meta = [it.category && it.category !== "other" ? it.category : "", it.fileSize ? formatBytes(it.fileSize) : "", it.source, it.finishedAt ? timeLabel(it.finishedAt) : timeLabel(it.addedAt)].filter(Boolean);
    const live = [];
    if (p) live.push(p.total > 0 ? `${formatBytes(p.bytes)} of ${formatBytes(p.total)}` : `${formatBytes(p.bytes)} (total size not reported)`);
    if (s?.bps > 0) live.push(`${formatBytes(s.bps)}/s`);
    if (s?.eta != null) live.push(`${formatDuration(s.eta)} left`);
    const buttons = [];
    if (it.status === "active") buttons.push(button("", { icon: "pause", kind: "ghost", title: "Pause", onClick: () => act("pause", it.id) }));
    if (it.status === "paused") buttons.push(button("", { icon: "play", kind: "ghost", title: "Resume", onClick: () => act("resume", it.id) }));
    if (["queued", "active", "paused"].includes(it.status)) buttons.push(button("", { icon: "x", kind: "ghost", title: "Cancel", onClick: () => act("cancel", it.id) }));
    if (["failed", "cancelled"].includes(it.status) && !it.noRetry) buttons.push(button("", { icon: "retry", kind: "ghost", title: "Retry", onClick: () => act("retry", it.id) }));
    if (it.status === "completed" && it.downloadId != null && ctx.platform.id === "chrome") buttons.push(button("", { icon: "library", kind: "ghost", title: "Show in folder", onClick: () => act("show", it.id) }));
    if (!["active", "paused"].includes(it.status)) buttons.push(button("", { icon: "trash", kind: "ghost", title: "Remove from list", onClick: () => act("remove", it.id) }));
    const prio = it.status === "queued" ? h("select", { class: "field", "aria-label": "Priority", style: "min-width:0;padding:3px 6px;font-size:12px", onChange: (e) => act("priority", it.id, e.target.value) }, ...["high", "normal", "low"].map((v) => h("option", { value: v, selected: it.priority === v }, v))) : null;
    return h(
      "div",
      { class: `item noselect cat-${it.category || "other"}` },
      thumbBox(it.category || "other"),
      h(
        "div",
        { class: "grow" },
        h("div", { class: "name trunc", title: it.url }, it.name),
        it.status === "active" || it.status === "paused" ? h("div", { class: "bar" + (pct == null ? " indet" : ""), role: "progressbar", "aria-valuenow": pct == null ? null : Math.round(pct) }, h("i", { style: `width:${pct ?? 35}%` })) : null,
        h("div", { class: "meta" }, ...(live.length ? live : meta).map((m) => h("span", null, m))),
        it.error ? h("div", { class: "meta", style: "color:var(--danger)" }, it.error) : null
      ),
      h("div", { class: "row gap-s" }, prio, badge(LABEL[it.status] || it.status, KIND[it.status]), ...buttons)
    );
  }
  function paint() {
    const c = counts(items);
    stats.textContent = `${c.active + c.paused} active · ${c.queued} waiting · ${c.completed} done · ${c.failed + c.cancelled} failed or cancelled`;
    clear(body);
    if (!items.length) return body.append(emptyState("No downloads yet", "Add files from the scanner, the Link tab, or the right-click menu."));
    const groups = [["Active", (i) => i.status === "active" || i.status === "paused"], ["Waiting", (i) => i.status === "queued"], ["Finished", (i) => ["completed", "handed_off"].includes(i.status)], ["Failed or cancelled", (i) => ["failed", "cancelled"].includes(i.status)]];
    for (const [title, fn] of groups) {
      const g = items.filter(fn);
      if (g.length) body.append(h("h3", { style: "margin:14px 0 6px" }, `${title} (${g.length})`), h("div", { class: "list" }, ...g.slice(0, 150).map(row)));
    }
  }
  async function poll() {
    if (!alive) return;
    const live = items.filter((i) => i.status === STATUS.ACTIVE || i.status === STATUS.PAUSED);
    if (live.length) {
      const now = Date.now();
      const next = await ctx.platform.progress(live);
      for (const [id, v] of Object.entries(next)) {
        const prev = samples[id];
        const cur = { t: now, bytes: v.bytes, total: v.total };
        samples[id] = { ...cur, speed: measureSpeed(prev, cur) ?? prev?.speed };
      }
      prog = next;
      if (alive) paint();
    }
    timer = setTimeout(poll, 1e3);
  }
  const off = ctx.platform.onQueue((q) => {
    items = q;
    paint();
  });
  const web = ctx.platform.id !== "chrome";
  root.append(pageHead(
    "Downloads",
    web ? "Browsers do not let web apps track downloads, so files are only marked as sent. Use the Chrome extension for live progress." : null,
    button("Clear finished", { onClick: () => act("clear-finished") })
  ), stats, body);
  paint();
  poll();
  return () => {
    alive = false;
    clearTimeout(timer);
    off();
  };
}
const queue = { id: "queue", label: "Downloads", icon: "queue", popup: true, needs: (c) => c.queue, mount: mount$b };
const PLATFORMS = [
  { name: "YouTube", domains: ["youtube.com", "youtu.be", "googlevideo.com"], media: ["video", "audio"], detection: "Page links only", download: "None", status: "unsupported", limitations: "Videos are delivered as segmented, protected streams. DOWNOVA does not extract them." },
  { name: "Facebook", domains: ["facebook.com", "fb.com", "fbcdn.net"], media: ["image", "video"], detection: "Direct <video>/<img> sources when exposed", download: "Only when the page exposes a plain file URL", status: "partial", limitations: "Most videos use blob or streaming sources and private content needs a login. Those are reported as restricted." },
  { name: "Instagram", domains: ["instagram.com", "cdninstagram.com"], media: ["image", "video"], detection: "Direct <video>/<img> sources when exposed", download: "Only when the page exposes a plain file URL", status: "partial", limitations: "Many items need a login or use short-lived signed URLs that can expire." },
  { name: "X", domains: ["x.com", "twitter.com", "twimg.com"], media: ["image", "video"], detection: "Images and direct sources", download: "Images yes; video usually streamed", status: "partial", limitations: "Video is usually HLS. Streaming manifests are not reconstructed." },
  { name: "LinkedIn", domains: ["linkedin.com", "licdn.com"], media: ["image", "document"], detection: "Images and direct links", download: "Direct files only", status: "direct", limitations: "Posts and documents often need a login." },
  { name: "Pinterest", domains: ["pinterest.com", "pinimg.com", "pin.it"], media: ["image"], detection: "Images", download: "Images served as plain files", status: "partial", limitations: "Video pins use streaming." },
  { name: "Google-hosted media", domains: ["googleusercontent.com", "drive.google.com", "gstatic.com"], media: ["image", "document"], detection: "Direct file URLs", download: "Direct files only", status: "direct", limitations: "Private Drive files need your sign-in and are not accessed by DOWNOVA." },
  { name: "Other websites", domains: [], media: ["image", "video", "audio", "document", "archive"], detection: "Links, <img>, <video>, <audio>, <source>, download attributes", download: "Direct file URLs", status: "direct", limitations: "Pages without plain file URLs, or that require authentication, cannot be downloaded." }
];
const STATUS_LABELS = { supported: "Supported", partial: "Partially supported", direct: "Direct files only", unsupported: "Unsupported", restricted: "Restricted" };
function lookupPlatform(url) {
  const host = hostOf(url);
  if (!host) return null;
  return PLATFORMS.find((p) => p.domains.some((d) => host === d || host.endsWith("." + d))) || PLATFORMS[PLATFORMS.length - 1];
}
async function mount$a(root, ctx, params) {
  const input = h("input", { class: "field", type: "url", placeholder: "https://example.com/file.pdf", "aria-label": "Link to a file", spellcheck: "false", autocomplete: "off" });
  const out = h("div", { style: "margin-top:14px" });
  let item = null, alive = true;
  async function check(raw) {
    clear(out);
    const v = validateDownloadUrl(raw, { allowData: false });
    if (!v.ok) {
      item = null;
      return out.append(emptyState("This link cannot be used", v.error));
    }
    out.append(h("div", { class: "bar indet" }, h("i")));
    const [base] = analyzeCandidates([{ url: v.url, tag: "a", download: "" }]);
    const probe = await ctx.platform.probe(v.url);
    if (!alive) return;
    item = applyProbe(base, probe);
    const plat = lookupPlatform(v.url);
    const ok = isEligible(item);
    const kv = [
      ["Name", item.name],
      ["Type", `${CATEGORY_LABELS[item.category]}${item.ext ? " · ." + item.ext : ""}${item.mime ? " · " + item.mime : ""}`],
      ["Size", item.size != null ? formatBytes(item.size) : "Not reported"],
      ["Source", hostOf(v.url)],
      ["Detected by", item.signals.length ? item.signals.join(", ") : "No strong signal"],
      ["Site support", `${plat.name}: ${STATUS_LABELS[plat.status]}`]
    ];
    const preview = ok && item.status === "downloadable" ? item.category === "image" ? h("img", { src: v.url, alt: "", referrerpolicy: "no-referrer", style: "max-width:100%;max-height:240px;border-radius:8px" }) : item.category === "video" ? h("video", { src: v.url, controls: true, preload: "metadata", style: "max-width:100%;max-height:240px;border-radius:8px" }) : item.category === "audio" ? h("audio", { src: v.url, controls: true, preload: "metadata" }) : null : null;
    const when = h("input", { class: "field", type: "datetime-local", min: toLocalInput(Date.now()), value: toLocalInput(Date.now() + 36e5), "aria-label": "Download at", style: "width:auto" });
    clear(out).append(h(
      "div",
      { class: "panel" },
      h("div", { class: "row wrap" }, h("h2", { class: "grow" }, "Link details"), ok ? badge(item.status === "unknown" ? "Type unknown" : "Direct file", item.status === "unknown" ? "warn" : "ok") : badge("Not downloadable", "bad")),
      h("dl", { class: "kv" }, ...kv.flatMap(([k, val]) => [h("dt", null, k), h("dd", null, val)])),
      !ok ? h("p", { style: "color:var(--danger)" }, item.reason) : null,
      item.probeNote ? h("p", { class: "muted small" }, item.probeNote) : null,
      plat.limitations ? h("p", { class: "muted small" }, plat.limitations) : null,
      preview ? h("div", { style: "margin:10px 0" }, preview) : null,
      ok ? h(
        "div",
        { class: "toolbar", style: "margin:12px 0 0" },
        button("Download now", { icon: "save", kind: "primary", onClick: () => send2("high") }),
        button("Add to queue", { icon: "queue", onClick: () => send2("normal") }),
        ctx.platform.caps.schedule ? [when, button("Schedule", { icon: "clock", onClick: async () => {
          const t = new Date(when.value).getTime();
          const r = await ctx.platform.scheduleAdd(item.url, t);
          r?.ok ? ctx.toast("Scheduled.", "ok") : ctx.toast(r?.error || "Could not schedule.", "error");
        } })] : null
      ) : null
    ));
  }
  async function send2(priority) {
    const r = await ctx.platform.enqueue([{ url: item.url, priority }]);
    if (r?.ok === false || r?.rejected?.length) return ctx.toast(r.error || r.rejected[0].error, "error");
    ctx.toast(r.duplicates ? "Already in the queue." : priority === "high" ? "Download started." : "Added to the queue.", "ok");
  }
  const go = button("Check link", { icon: "search", kind: "primary", onClick: () => check(input.value) });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") check(input.value);
  });
  const paste = button("Paste", { onClick: async () => {
    try {
      input.value = (await navigator.clipboard.readText()).trim();
      check(input.value);
    } catch {
      ctx.toast("Clipboard access was not allowed. Paste with Ctrl+V instead.", "error");
    }
  } });
  const table = h(
    "details",
    { class: "panel", style: "margin-top:16px" },
    h("summary", null, "Which sites does DOWNOVA work with?"),
    h(
      "table",
      { class: "t", style: "margin-top:10px" },
      h("thead", null, h("tr", null, ...["Site", "Status", "What to expect"].map((t) => h("th", null, t)))),
      h("tbody", null, ...PLATFORMS.map((p) => h("tr", null, h("td", null, p.name), h("td", null, badge(STATUS_LABELS[p.status], p.status === "unsupported" ? "bad" : p.status === "direct" ? "ok" : "warn")), h("td", { class: "muted" }, p.limitations))))
    ),
    h("p", { class: "muted small" }, "DOWNOVA never bypasses DRM, logins, CORS or protected streams.")
  );
  root.append(pageHead("Link assistant", "Paste a direct link to see what it is and whether it can be downloaded. Nothing is read from your clipboard until you press Paste."), h("div", { class: "toolbar" }, input, go, paste), out, table);
  if (params.url) {
    input.value = params.url;
    check(params.url);
  } else out.append(emptyState("Paste a link to begin", "Direct file URLs work best, such as .pdf, .zip, .mp4 or image links."));
  return () => {
    alive = false;
  };
}
const link = { id: "link", label: "Link", icon: "link", popup: true, needs: () => true, mount: mount$a };
async function mount$9(root, ctx) {
  let items = await ctx.platform.getSchedule();
  const url = h("input", { class: "field", type: "url", placeholder: "https://example.com/file.zip", "aria-label": "File link" });
  const when = h("input", { class: "field", type: "datetime-local", min: toLocalInput(Date.now()), value: toLocalInput(Date.now() + 36e5), "aria-label": "Start time", style: "flex:0 0 auto;width:auto" });
  const list = h("div", { class: "list" });
  const paint = () => {
    clear(list);
    if (!items.length) return list.append(emptyState("Nothing scheduled", "Pick a link and a time. Scheduled downloads start while Chrome is running."));
    for (const s of items) {
      const edit = h("input", { class: "field", type: "datetime-local", value: toLocalInput(s.runAt), min: toLocalInput(Date.now()), "aria-label": "Change time", style: "width:auto" });
      list.append(h(
        "div",
        { class: "item noselect" },
        h("div", { class: "thumb" }, icon("clock", 20)),
        h("div", { class: "grow" }, h("div", { class: "name trunc", title: s.url }, s.filename || fileNameFromUrl(s.url)), h("div", { class: "meta" }, h("span", null, `Starts ${timeLabel(s.runAt)}`))),
        h(
          "div",
          { class: "row gap-s" },
          edit,
          button("Update", { kind: "sm", onClick: async () => {
            const r = await ctx.platform.scheduleUpdate(s.id, new Date(edit.value).getTime());
            r?.ok ? ctx.toast("Time updated.", "ok") : ctx.toast(r?.error || "Could not update.", "error");
          } }),
          button("", { icon: "trash", kind: "ghost", title: "Cancel this schedule", onClick: () => ctx.platform.scheduleRemove(s.id) })
        )
      ));
    }
  };
  const off = ctx.platform.onSchedule((v) => {
    items = v;
    paint();
  });
  root.append(
    pageHead("Scheduled downloads", "Chrome checks schedules about once a minute while it is open. Starts can be a minute late; nothing runs while Chrome is closed."),
    h("div", { class: "toolbar" }, url, when, button("Schedule", { icon: "clock", kind: "primary", onClick: async () => {
      const v = validateDownloadUrl(url.value);
      if (!v.ok) return ctx.toast(v.error, "error");
      const r = await ctx.platform.scheduleAdd(v.url, new Date(when.value).getTime());
      if (r?.ok) {
        url.value = "";
        ctx.toast("Scheduled.", "ok");
      } else ctx.toast(r?.error || "Could not schedule.", "error");
    } })),
    list
  );
  paint();
  return off;
}
const schedule = { id: "schedule", label: "Schedule", icon: "clock", popup: false, needs: (c) => c.schedule, mount: mount$9 };
const withTimeout = (p, ms, msg) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms))]);
function loadMedia(blob, tag) {
  const url = URL.createObjectURL(blob);
  const el = document.createElement(tag);
  el.preload = "metadata";
  el.muted = true;
  el.playsInline = true;
  const ready = new Promise((res, rej) => {
    el.onloadedmetadata = () => res();
    el.onerror = () => rej(new Error("Cannot read this media."));
  });
  el.src = url;
  return { el, url, ready: withTimeout(ready, 1e4, "Timed out reading media."), free: () => {
    el.removeAttribute("src");
    el.load();
    URL.revokeObjectURL(url);
  } };
}
async function readMediaInfo(blob, kind) {
  const m = loadMedia(blob, kind === "audio" ? "audio" : "video");
  try {
    await m.ready;
    const d = m.el.duration;
    const info = {};
    if (Number.isFinite(d) && d > 0) {
      info.duration = d;
      info.avgBitrate = Math.round(blob.size * 8 / d);
    }
    if (kind === "video" && m.el.videoWidth) {
      info.width = m.el.videoWidth;
      info.height = m.el.videoHeight;
    }
    return info;
  } finally {
    m.free();
  }
}
const toBlob = (canvas, type, q) => new Promise((res) => canvas.convertToBlob ? canvas.convertToBlob({ type, quality: q }).then(res, () => res(null)) : canvas.toBlob(res, type, q));
async function makeThumb(blob, category, width = 240) {
  if (category === "image") {
    if (blob.type === "image/svg+xml") return null;
    const bmp = await createImageBitmap(blob);
    const scale = Math.min(1, width / bmp.width);
    const c = new OffscreenCanvas(Math.max(1, Math.round(bmp.width * scale)), Math.max(1, Math.round(bmp.height * scale)));
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close?.();
    return toBlob(c, "image/jpeg", 0.75);
  }
  if (category === "video") {
    const m = loadMedia(blob, "video");
    try {
      await m.ready;
      const target = Math.min(1, (m.el.duration || 2) / 4);
      await withTimeout(new Promise((res, rej) => {
        m.el.onseeked = () => res();
        m.el.onerror = () => rej(new Error("seek failed"));
        m.el.currentTime = target;
      }), 8e3, "Timed out making a preview.");
      if (!m.el.videoWidth) return null;
      const scale = Math.min(1, width / m.el.videoWidth);
      const c = new OffscreenCanvas(Math.round(m.el.videoWidth * scale), Math.round(m.el.videoHeight * scale));
      c.getContext("2d").drawImage(m.el, 0, 0, c.width, c.height);
      return toBlob(c, "image/jpeg", 0.75);
    } finally {
      m.free();
    }
  }
  return null;
}
async function extractForLibrary(file, category) {
  const out = {};
  if (category === "video" || category === "audio") Object.assign(out, await readMediaInfo(file, category).catch(() => ({})));
  if (category === "image" || category === "video") {
    const t = await makeThumb(file, category).catch(() => null);
    if (t) out.thumb = t;
  }
  if (category === "image" && file.type !== "image/svg+xml") {
    try {
      const b = await createImageBitmap(file);
      out.width = b.width;
      out.height = b.height;
      b.close?.();
    } catch {
    }
  }
  return out;
}
function parseCsv(text, maxRows = 100) {
  const rows = [];
  let row = [], cell = "", q = false;
  const s = String(text).replace(/^\uFEFF/, "");
  for (let i = 0; i < s.length && rows.length < maxRows; i++) {
    const c = s[i];
    if (q) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          cell += '"';
          i++;
        } else q = false;
      } else cell += c;
    } else if (c === '"' && cell === "") q = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if ((cell !== "" || row.length) && rows.length < maxRows) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}
const FILTERS = [["all", "All"], ...CATEGORIES.filter((c) => c !== "other").map((c) => [c, CATEGORY_LABELS[c]]), ["favorites", "Favorites"], ["recent", "Recent"]];
const TEXT_EXT = /* @__PURE__ */ new Set(["txt", "md", "json", "xml", "csv", "log"]);
async function previewBody(ctx, rec, blob, bag, close) {
  const url = bag.make(blob);
  const ext = extFromPath(rec.name);
  if (rec.category === "image") return h("img", { src: url, alt: rec.name, style: "max-width:100%;max-height:50vh;display:block;margin:auto;border-radius:8px" });
  if (rec.category === "video") return h("video", { src: url, controls: true, preload: "metadata", style: "width:100%;max-height:50vh;border-radius:8px;background:#000" });
  if (rec.category === "audio") return h("audio", { src: url, controls: true, style: "width:100%" });
  if (TEXT_EXT.has(ext) || rec.type.startsWith("text/")) {
    const text = await blob.slice(0, 200 * 1024).text();
    if (ext === "csv") {
      const rows = parseCsv(text, 60);
      return h("div", { style: "overflow:auto;max-height:50vh" }, h("table", { class: "t" }, h("tbody", null, ...rows.map((r, i) => h("tr", null, ...r.map((c) => h(i === 0 ? "th" : "td", null, c)))))));
    }
    return h("pre", { style: "white-space:pre-wrap;max-height:50vh;overflow:auto;margin:0" }, text);
  }
  if (ext === "pdf") return h("div", null, h("p", { class: "muted" }, "PDF file."), button("Open in PDF reader", { icon: "pdf", kind: "primary", onClick: () => {
    close();
    ctx.go("pdf", { id: rec.id });
  } }));
  if (rec.category === "archive" && ext === "zip") return h("div", null, h("p", { class: "muted" }, "ZIP archive."), button("Open in ZIP manager", { icon: "zip", kind: "primary", onClick: () => {
    close();
    ctx.go("zip", { id: rec.id });
  } }));
  return h("p", { class: "muted" }, "No in-app preview for this format. Download or share the file to open it elsewhere. Office documents are never modified or rendered unreliably here.");
}
function metaList(rec) {
  const rows = [["Name", rec.name], ["Type", `${CATEGORY_LABELS[rec.category] || "File"}${rec.type ? " · " + rec.type : ""}`], ["Size", formatBytes(rec.size)], ["Added", timeLabel(rec.addedAt)]];
  if (rec.origin) rows.push(["File dated", timeLabel(rec.origin)]);
  if (rec.width) rows.push(["Dimensions", `${rec.width}×${rec.height}`]);
  if (rec.duration) rows.push(["Duration", formatDuration(rec.duration)]);
  if (rec.avgBitrate) rows.push(["Average bitrate", `${Math.round(rec.avgBitrate / 1e3)} kbps (size ÷ duration)`]);
  if (rec.tags?.length) rows.push(["Tags", rec.tags.join(", ")]);
  return h("dl", { class: "kv" }, ...rows.flatMap(([k, v]) => [h("dt", null, k), h("dd", null, v)]));
}
async function mount$8(root, ctx) {
  const bag = urlBag(), thumbs = /* @__PURE__ */ new Map();
  let items = [], cat = "all", q = "", sort = ctx.settings.library.sort, view = ctx.settings.library.view, alive = true;
  const body = h("div"), info = h("div", { class: "muted small" }), progress = h("div");
  async function reload() {
    items = await ctx.lib.all();
    paint();
  }
  const thumbUrl = (r) => {
    if (!r.thumb) return null;
    if (!thumbs.has(r.id)) thumbs.set(r.id, bag.make(r.thumb));
    return thumbs.get(r.id);
  };
  function visible() {
    const needle = q.trim().toLowerCase();
    let list = items.filter((r) => (cat === "all" || (cat === "favorites" ? r.favorite : cat === "recent" ? r.lastOpened : r.category === cat)) && (!needle || (needle.startsWith("#") ? (r.tags || []).some((t) => t.toLowerCase().includes(needle.slice(1))) : `${r.name} ${r.type} ${(r.tags || []).join(" ")}`.toLowerCase().includes(needle))));
    const by = { added: (a, b) => b.addedAt - a.addedAt, name: (a, b) => a.name.localeCompare(b.name), size: (a, b) => b.size - a.size, type: (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name) };
    list.sort(cat === "recent" ? (a, b) => b.lastOpened - a.lastOpened : by[sort]);
    return list;
  }
  async function open(rec) {
    const blob = await ctx.lib.blob(rec.id);
    if (!blob) return ctx.toast("The file data is missing.", "error");
    await ctx.lib.update(rec.id, { lastOpened: Date.now() });
    const mbag = urlBag();
    const preview = await previewBody(ctx, rec, blob, mbag, () => closeRef?.(null)).catch(() => h("p", { class: "muted" }, "Preview failed."));
    let closeRef;
    const act = async (fn) => {
      await fn();
      closeRef?.(null);
      await reload();
    };
    const p = ctx.modal({
      title: rec.name,
      wide: true,
      body: (close) => {
        closeRef = close;
        return h("div", { class: "stack" }, preview, metaList(rec));
      },
      actions: (close) => [
        button(rec.favorite ? "Unfavorite" : "Favorite", { icon: "star", onClick: () => act(() => ctx.lib.update(rec.id, { favorite: !rec.favorite })) }),
        button("Rename", { icon: "edit", onClick: async () => {
          const n = await ctx.prompt("Rename file", { value: rec.name });
          if (n && n.trim()) await act(() => ctx.lib.update(rec.id, { name: sanitizeFilename(n, rec.name) }));
        } }),
        button("Tags", { icon: "tag", onClick: async () => {
          const t = await ctx.prompt("Tags", { value: (rec.tags || []).join(", "), label: "Separate tags with commas" });
          if (t !== null) await act(() => ctx.lib.update(rec.id, { tags: [...new Set(t.split(",").map((x) => x.trim().slice(0, 30)).filter(Boolean))].slice(0, 20) }));
        } }),
        button("Copy", { icon: "dup", onClick: () => act(async () => {
          await ctx.lib.put({ ...rec, id: uid(), name: sanitizeFilename(rec.name.replace(/(\.[^.]+)?$/, " (copy)$1")), addedAt: Date.now(), lastOpened: null }, blob);
          ctx.toast("Copy added.", "ok");
        }) }),
        button("Save", { icon: "save", onClick: () => ctx.platform.saveBlob(blob, rec.name.split("/").pop()) }),
        button("Share", { icon: "share", onClick: async () => {
          try {
            await ctx.platform.shareBlob(blob, rec.name.split("/").pop()) || ctx.toast("Sharing files is not supported here. Use Save instead.", "error");
          } catch (e) {
            if (e?.name !== "AbortError") ctx.toast("Could not share the file.", "error");
          }
        } }),
        button("Delete", { icon: "trash", kind: "danger", onClick: async () => {
          if (await ctx.confirm(`Delete “${rec.name}” from the library? This cannot be undone.`, { okLabel: "Delete", danger: true })) act(() => ctx.lib.remove(rec.id));
        } })
      ]
    });
    await p;
    mbag.freeAll();
  }
  function paint() {
    clear(body);
    const list = visible();
    const total = items.reduce((n, r) => n + r.size, 0);
    info.textContent = items.length ? `${items.length} files · ${formatBytes(total)} stored on this device` : "";
    if (!items.length) return body.append(emptyState("Your library is empty", "Add files from your device. They stay on this device, in this browser.", button("Add files", { icon: "plus", kind: "primary", onClick: () => picker.click() })));
    if (!list.length) return body.append(emptyState("Nothing matches", "Try another filter or search."));
    if (view === "grid") body.append(h("div", { class: "grid" }, ...list.slice(0, 600).map((r) => h(
      "button",
      { class: `card cat-${r.category}`, type: "button", onClick: () => open(r), title: r.name },
      h("div", { class: "pic" }, thumbUrl(r) ? h("img", { src: thumbUrl(r), alt: "", loading: "lazy" }) : icon(r.category, 34)),
      h("div", { class: "cap" }, h("b", { class: "trunc" }, (r.favorite ? "★ " : "") + r.name), h("span", { class: "muted small" }, `${formatBytes(r.size)}${r.duration ? " · " + formatDuration(r.duration) : ""}`))
    ))));
    else body.append(h("div", { class: "list" }, ...list.slice(0, 600).map((r) => h(
      "div",
      { class: `item noselect cat-${r.category}`, style: "cursor:pointer", onClick: () => open(r) },
      thumbBox(r.category, thumbUrl(r)),
      h("div", { class: "grow" }, h("div", { class: "name trunc" }, (r.favorite ? "★ " : "") + r.name), h("div", { class: "meta" }, h("span", null, formatBytes(r.size)), h("span", null, dateLabel(r.addedAt)), ...(r.tags || []).map((t) => badge("#" + t)))),
      h("span", null)
    ))));
  }
  async function add2(files) {
    const bar = h("div", { class: "panel" }, h("div", { class: "small muted" }, "Importing…"), h("div", { class: "bar" }, h("i", { style: "width:0%" })));
    clear(progress).append(bar);
    try {
      const done2 = await importFiles(files, { extract: extractForLibrary, onProgress: (i, n, name) => {
        bar.firstChild.textContent = name ? `Adding ${name} (${i + 1} of ${n})` : "Finishing…";
        bar.lastChild.firstChild.style.width = `${i / n * 100}%`;
      } });
      ctx.toast(`${done2.length} file${done2.length === 1 ? "" : "s"} added.${done2.length < files.length ? " Empty files were skipped." : ""}`, "ok");
      navigator.storage?.persist?.().catch(() => {
      });
    } catch (e) {
      ctx.toast(e?.name === "QuotaExceededError" ? "This device is out of storage for DOWNOVA." : `Import failed: ${e.message}`, "error");
    }
    clear(progress);
    if (alive) await reload();
  }
  const picker = fileInput({ onFiles: add2 });
  const search = h("input", { class: "field", type: "search", placeholder: "Search files or #tags", "aria-label": "Search library" });
  search.addEventListener("input", debounce(() => {
    q = search.value;
    paint();
  }, 150));
  const sortSel = h("select", { class: "field", "aria-label": "Sort", style: "flex:0 0 auto;min-width:110px" }, ...[["added", "Newest"], ["name", "Name"], ["size", "Size"], ["type", "Type"]].map(([v, l]) => h("option", { value: v, selected: sort === v }, l)));
  sortSel.addEventListener("change", () => {
    sort = sortSel.value;
    ctx.save({ library: { sort } });
    paint();
  });
  const viewBtn = button("", { icon: view === "grid" ? "list" : "grid", kind: "ghost", title: "Switch between grid and list", onClick: () => {
    view = view === "grid" ? "list" : "grid";
    ctx.save({ library: { view } });
    viewBtn.replaceChildren(icon(view === "grid" ? "list" : "grid", 16));
    paint();
  } });
  const chips = h("div", { class: "chips" }, ...FILTERS.map(([id, l]) => {
    const c = h("button", { class: `chip ${id === cat ? "on" : ""}`, type: "button", onClick: () => {
      cat = id;
      chips.querySelectorAll(".chip").forEach((x) => x.classList.remove("on"));
      c.classList.add("on");
      paint();
    } }, l);
    return c;
  }));
  const zone = h("div", { class: "drop" }, "Drop files here, or ", button("choose files", { kind: "sm", onClick: () => picker.click() }));
  dropZone(zone, add2);
  root.append(
    pageHead("Library", "Files you add live in this browser’s storage. Nothing is uploaded.", picker, button("Add files", { icon: "plus", kind: "primary", onClick: () => picker.click() })),
    h("div", { class: "toolbar" }, search, sortSel, viewBtn),
    chips,
    h("div", { style: "margin:10px 0" }, zone),
    progress,
    info,
    h("div", { style: "margin-top:10px" }, body)
  );
  await reload();
  return () => {
    alive = false;
    bag.freeAll();
  };
}
const library = { id: "library", label: "Library", icon: "library", popup: false, needs: () => true, mount: mount$8 };
function srtToVtt(srt) {
  const body = String(srt).replace(/^\uFEFF/, "").replace(/\r+/g, "").trim().replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
  return `WEBVTT

${body}
`;
}
const shuffled = (arr, first) => {
  const a = arr.filter((x) => x !== first);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return first ? [first, ...a] : a;
};
async function mount$7(root, ctx, params) {
  const bag = urlBag();
  const P2 = { ...ctx.settings.player };
  let lib = [], order = [], cur = null, curUrl = null;
  const video = h("video", { preload: "metadata", playsinline: true, tabindex: -1 });
  const stage = h("div", { class: "player" }, video);
  const title = h("h2", { class: "trunc" }, "Nothing playing");
  const seek = h("input", { type: "range", min: 0, max: 1e3, value: 0, step: 1, "aria-label": "Seek" });
  const time = h("span", { class: "time" }, "0:00 / 0:00");
  const vol = h("input", { type: "range", min: 0, max: 100, value: Math.round(P2.volume * 100), "aria-label": "Volume", style: "width:90px" });
  const speed = h("select", { class: "field", "aria-label": "Playback speed", style: "width:auto;min-width:0" }, ...[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => h("option", { value: r, selected: r === P2.rate }, `${r}×`)));
  const list = h("div", { class: "list" }), recent = h("div", { class: "muted small" });
  const playBtn = button("", { icon: "play", title: "Play or pause (Space)", kind: "primary", onClick: () => toggle2() });
  const repeatBtn = button("", { icon: "repeat", kind: "ghost", onClick: () => {
    P2.repeat = { off: "all", all: "one", one: "off" }[P2.repeat];
    syncFlags();
    persist();
  } });
  const shufBtn = button("", { icon: "shuffle", kind: "ghost", onClick: () => {
    P2.shuffle = !P2.shuffle;
    reorder();
    syncFlags();
    persist();
    paintList();
  } });
  const persist = () => ctx.save({ player: { rate: P2.rate, volume: P2.volume, repeat: P2.repeat, shuffle: P2.shuffle } });
  const syncFlags = () => {
    repeatBtn.title = `Repeat: ${P2.repeat}`;
    repeatBtn.setAttribute("aria-label", repeatBtn.title);
    repeatBtn.style.color = P2.repeat === "off" ? "" : "var(--accent)";
    repeatBtn.style.opacity = P2.repeat === "one" ? 1 : "";
    repeatBtn.dataset.mode = P2.repeat;
    shufBtn.title = `Shuffle: ${P2.shuffle ? "on" : "off"}`;
    shufBtn.style.color = P2.shuffle ? "var(--accent)" : "";
  };
  video.volume = P2.volume;
  video.playbackRate = P2.rate;
  function reorder() {
    const base = lib.map((r) => r.id);
    order = P2.shuffle ? shuffled(base, cur?.id) : base;
  }
  const byId = (id) => lib.find((r) => r.id === id);
  const toggle2 = () => {
    if (!cur) return order.length && play(order[0]);
    video.paused ? video.play().catch(() => {
    }) : video.pause();
  };
  async function play(id) {
    const rec = byId(id);
    if (!rec) return;
    const blob = await ctx.lib.blob(id);
    if (!blob) return ctx.toast("The file data is missing.", "error");
    if (curUrl) bag.free(curUrl);
    cur = rec;
    curUrl = bag.make(blob);
    video.querySelectorAll("track").forEach((t) => t.remove());
    video.src = curUrl;
    video.playbackRate = P2.rate;
    stage.style.minHeight = rec.category === "audio" ? "120px" : "";
    title.textContent = rec.name;
    await ctx.lib.update(id, { lastOpened: Date.now() });
    rec.lastOpened = Date.now();
    video.play().catch(() => ctx.toast("Press play to start. The browser blocked autoplay."));
    paintList();
  }
  const step = (d) => {
    if (!order.length) return;
    const i = Math.max(0, order.indexOf(cur?.id));
    play(order[(i + d + order.length) % order.length]);
  };
  video.addEventListener("play", () => playBtn.replaceChildren(icon("pause", 16)));
  video.addEventListener("pause", () => playBtn.replaceChildren(icon("play", 16)));
  video.addEventListener("timeupdate", () => {
    if (video.duration) seek.value = Math.round(video.currentTime / video.duration * 1e3);
    time.textContent = `${formatDuration(video.currentTime)} / ${formatDuration(video.duration)}`;
  });
  video.addEventListener("error", () => ctx.toast("This browser cannot play that format or codec.", "error"));
  video.addEventListener("ended", () => {
    if (P2.repeat === "one") {
      video.currentTime = 0;
      video.play();
      return;
    }
    const i = order.indexOf(cur?.id);
    if (i < order.length - 1) play(order[i + 1]);
    else if (P2.repeat === "all" && order.length) play(order[0]);
  });
  seek.addEventListener("input", () => {
    if (video.duration) video.currentTime = seek.value / 1e3 * video.duration;
  });
  vol.addEventListener("input", () => {
    video.volume = vol.value / 100;
    video.muted = false;
    P2.volume = video.volume;
  });
  vol.addEventListener("change", persist);
  speed.addEventListener("change", () => {
    P2.rate = Number(speed.value);
    video.playbackRate = P2.rate;
    persist();
  });
  const subs = fileInput({ accept: ".vtt,.srt", multiple: false, onFiles: async ([f]) => {
    if (!cur) return ctx.toast("Start a video first.", "error");
    const text = await f.text();
    const vtt = /^\uFEFF?WEBVTT/.test(text) ? text : srtToVtt(text);
    video.querySelectorAll("track").forEach((t2) => t2.remove());
    const t = h("track", { kind: "subtitles", label: f.name, default: true, src: bag.make(new Blob([vtt], { type: "text/vtt" })) });
    video.append(t);
    t.addEventListener("load", () => {
      if (t.track) t.track.mode = "showing";
    });
    if (t.track) t.track.mode = "showing";
    ctx.toast(`Subtitles loaded: ${f.name}`, "ok");
  } });
  const fs = () => document.fullscreenElement ? document.exitFullscreen() : stage.requestFullscreen?.().catch(() => ctx.toast("Full screen is not available here.", "error"));
  const key = (e) => {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || e.target.tagName === "BUTTON" && e.key === " " || e.ctrlKey || e.metaKey || e.altKey || document.querySelector("dialog[open]")) return;
    const k = e.key;
    let used = true;
    if (k === " " || k === "k") toggle2();
    else if (k === "ArrowRight") video.currentTime += e.shiftKey ? 10 : 5;
    else if (k === "ArrowLeft") video.currentTime -= e.shiftKey ? 10 : 5;
    else if (k === "ArrowUp") {
      video.volume = Math.min(1, video.volume + 0.05);
      vol.value = Math.round(video.volume * 100);
      P2.volume = video.volume;
    } else if (k === "ArrowDown") {
      video.volume = Math.max(0, video.volume - 0.05);
      vol.value = Math.round(video.volume * 100);
      P2.volume = video.volume;
    } else if (k === "m") video.muted = !video.muted;
    else if (k === "f") fs();
    else if (k === "n") step(1);
    else if (k === "p") step(-1);
    else used = false;
    if (used) e.preventDefault();
  };
  document.addEventListener("keydown", key);
  function paintList() {
    clear(list);
    if (!lib.length) return list.append(emptyState("No audio or video yet", "Add media to the library to build a playlist."));
    for (const id of order) {
      const r = byId(id);
      if (!r) continue;
      list.append(h("div", { class: `item noselect cat-${r.category}`, style: `cursor:pointer;${r.id === cur?.id ? "border-color:var(--accent)" : ""}`, onClick: () => play(r.id), tabindex: 0, role: "button", onKeydown: (e) => {
        if (e.key === "Enter") play(r.id);
      } }, thumbBox(r.category), h("div", { class: "grow" }, h("div", { class: "name trunc" }, r.name), h("div", { class: "meta" }, h("span", null, formatBytes(r.size)), r.duration ? h("span", null, formatDuration(r.duration)) : null)), h("span", null)));
    }
    const rec = lib.filter((r) => r.lastOpened).sort((a, b) => b.lastOpened - a.lastOpened).slice(0, 5);
    recent.textContent = rec.length ? `Recently played: ${rec.map((r) => r.name).join(" · ")}` : "";
  }
  async function reload() {
    lib = (await ctx.lib.all()).filter((r) => r.category === "audio" || r.category === "video").sort((a, b) => a.addedAt - b.addedAt);
    reorder();
    paintList();
  }
  const picker = fileInput({ accept: "video/*,audio/*", onFiles: async (files) => {
    await importFiles(files, { extract: extractForLibrary });
    await reload();
    if (!cur && order.length) play(order[order.length - files.length] || order[0]);
  } });
  syncFlags();
  root.append(
    pageHead("Player", "Plays the audio and video formats your browser supports. Shortcuts: Space, ←/→, ↑/↓, M, F, N, P.", picker, button("Add media", { icon: "plus", kind: "primary", onClick: () => picker.click() })),
    stage,
    title,
    h("div", { class: "ctrls" }, button("", { icon: "prev", kind: "ghost", title: "Previous (P)", onClick: () => step(-1) }), playBtn, button("", { icon: "next", kind: "ghost", title: "Next (N)", onClick: () => step(1) }), seek, time),
    h("div", { class: "ctrls" }, shufBtn, repeatBtn, vol, speed, button("Subtitles", { kind: "sm", onClick: () => subs.click() }), subs, button("", { icon: "full", kind: "ghost", title: "Full screen (F)", onClick: fs })),
    h("h3", { style: "margin:14px 0 6px" }, "Playlist"),
    list,
    recent
  );
  await reload();
  if (params.id && byId(params.id)) play(params.id);
  return () => {
    document.removeEventListener("keydown", key);
    video.pause();
    video.removeAttribute("src");
    bag.freeAll();
  };
}
const player = { id: "player", label: "Player", icon: "play", popup: false, needs: () => true, mount: mount$7 };
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p) => Promise.resolve(p).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link22 = links[i];
            if (link22.href === dep && (!isCss || link22.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link2 = document.createElement("link");
        link2.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link2.as = "script";
        }
        link2.crossOrigin = "";
        link2.href = dep;
        if (cspNonce) {
          link2.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link2);
        if (isCss) {
          return new Promise((res, rej) => {
            link2.addEventListener("load", res);
            link2.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
async function loadPdfJs() {
  const pdfjs = await __vitePreload(() => import("./pdf-BJAF3mHZ.js"), true ? [] : void 0, import.meta.url);
  const worker = (await __vitePreload(async () => {
    const { default: __vite_default__ } = await import("./pdf.worker.min-BgGpz7GC.js");
    return { default: __vite_default__ };
  }, true ? [] : void 0, import.meta.url)).default;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  return pdfjs;
}
async function mount$6(root, ctx, params) {
  let pdf2 = null, page = 1, scale = 1.2, fit = false, rec = null, blob = null, renderTask = null, token = 0, alive = true, results = [];
  const holder = h("div"), recentBox = h("div");
  const canvas = h("canvas", { "aria-label": "PDF page" });
  const wrap2 = h("div", { class: "pdfwrap" }, canvas);
  const pageIn = h("input", { class: "field", type: "number", min: 1, value: 1, "aria-label": "Page number", style: "width:70px" });
  const count = h("span", { class: "muted" }, "/ 0");
  const zoomLbl = h("span", { class: "time", style: "min-width:54px" }, "120%");
  const sq = h("input", { class: "field", type: "search", placeholder: "Search text in this PDF", "aria-label": "Search in PDF" });
  const found = h("div", { class: "list", style: "margin-top:8px" });
  const shell = h("div", { class: "hidden" });
  async function render() {
    if (!pdf2) return;
    const mine = ++token;
    try {
      renderTask?.cancel();
    } catch {
    }
    const pg = await pdf2.getPage(page);
    if (mine !== token) return;
    if (fit) {
      const base = pg.getViewport({ scale: 1 });
      scale = clamp((wrap2.clientWidth - 28) / base.width, 0.25, 5);
    }
    const vp = pg.getViewport({ scale }), dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(vp.width * dpr);
    canvas.height = Math.floor(vp.height * dpr);
    canvas.style.width = `${Math.floor(vp.width)}px`;
    canvas.style.height = `${Math.floor(vp.height)}px`;
    renderTask = pg.render({ canvasContext: canvas.getContext("2d"), viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null });
    try {
      await renderTask.promise;
    } catch (e) {
      if (e?.name !== "RenderingCancelledException") ctx.toast("This page could not be drawn.", "error");
    }
    zoomLbl.textContent = `${Math.round(scale * 100)}%`;
    pageIn.value = page;
  }
  const goPage = (n) => {
    if (!pdf2) return;
    page = clamp(Math.round(Number(n) || 1), 1, pdf2.numPages);
    render();
  };
  const zoom = (f) => {
    fit = false;
    scale = clamp(scale * f, 0.25, 5);
    render();
  };
  async function open(file, fromRec) {
    clear(holder).append(h("div", { class: "bar indet" }, h("i")));
    try {
      const pdfjs = await loadPdfJs();
      const data = new Uint8Array(await file.arrayBuffer());
      const task = pdfjs.getDocument({ data, isEvalSupported: false, enableXfa: false });
      task.onPassword = async (update, reason) => {
        const pw = await ctx.prompt(reason === 2 ? "Wrong password. Try again" : "This PDF is password-protected", { label: "Password", okLabel: "Open" });
        if (pw == null) task.destroy();
        else update(pw);
      };
      if (pdf2) {
        pdf2.destroy();
        pdf2 = null;
      }
      pdf2 = await task.promise;
      blob = file;
      rec = fromRec;
      page = 1;
      results = [];
      clear(found);
      sq.value = "";
      count.textContent = `/ ${pdf2.numPages}`;
      pageIn.max = pdf2.numPages;
      shell.classList.remove("hidden");
      clear(holder);
      recentBox.classList.add("hidden");
      fit = true;
      await render();
    } catch (e) {
      clear(holder).append(emptyState("Could not open this PDF", /password/i.test(e?.message) ? "A password is required." : "The file may be damaged or not a real PDF."));
    }
  }
  async function search() {
    const term = sq.value.trim().toLowerCase();
    clear(found);
    results = [];
    if (!pdf2 || term.length < 2) return;
    found.append(h("div", { class: "muted small" }, "Searching…"));
    for (let p = 1; p <= pdf2.numPages && results.length < 200 && alive; p++) {
      const txt = (await (await pdf2.getPage(p)).getTextContent()).items.map((i) => i.str).join(" ");
      const low = txt.toLowerCase();
      let at = low.indexOf(term);
      while (at >= 0 && results.length < 200) {
        results.push({ p, snip: txt.slice(Math.max(0, at - 30), at + term.length + 40) });
        at = low.indexOf(term, at + term.length);
      }
    }
    clear(found);
    if (!results.length) return found.append(h("div", { class: "muted small" }, "No matches. Scanned pages with no text layer cannot be searched."));
    found.append(h("div", { class: "muted small" }, `${results.length}${results.length === 200 ? "+" : ""} matches`), ...results.slice(0, 50).map((r) => h("button", { class: "btn sm", type: "button", style: "justify-content:flex-start", onClick: () => goPage(r.p) }, `p.${r.p}  ${r.snip}`)));
  }
  sq.addEventListener("keydown", (e) => {
    if (e.key === "Enter") search();
  });
  pageIn.addEventListener("change", () => goPage(pageIn.value));
  async function print() {
    if (!pdf2) return;
    const pg = await pdf2.getPage(page), vp = pg.getViewport({ scale: 2 }), c = document.createElement("canvas");
    c.width = vp.width;
    c.height = vp.height;
    await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    const sheet = h("div", { class: "print-sheet" }, h("img", { src: c.toDataURL("image/png"), alt: "" }));
    document.body.append(sheet);
    document.body.classList.add("printing");
    const done2 = () => {
      document.body.classList.remove("printing");
      sheet.remove();
      removeEventListener("afterprint", done2);
    };
    addEventListener("afterprint", done2);
    setTimeout(() => window.print(), 50);
  }
  const picker = fileInput({ accept: "application/pdf,.pdf", multiple: false, onFiles: async ([f]) => {
    const [r] = await importFiles([f], { extract: extractForLibrary });
    await open(f, r);
  } });
  const toolbar = h(
    "div",
    { class: "toolbar" },
    button("", { icon: "up", title: "Previous page", onClick: () => goPage(page - 1) }),
    pageIn,
    count,
    button("", { icon: "down", title: "Next page", onClick: () => goPage(page + 1) }),
    button("", { icon: "minus", title: "Zoom out", onClick: () => zoom(1 / 1.2) }),
    zoomLbl,
    button("", { icon: "plus", title: "Zoom in", onClick: () => zoom(1.2) }),
    button("Fit width", { onClick: () => {
      fit = true;
      render();
    } }),
    button("", { icon: "full", title: "Full screen", onClick: () => document.fullscreenElement ? document.exitFullscreen() : wrap2.requestFullscreen?.().catch(() => ctx.toast("Full screen is not available.", "error")) }),
    button("", { icon: "print", title: "Print this page", onClick: print }),
    button("Save a copy", { icon: "save", onClick: () => ctx.platform.saveBlob(blob, rec?.name || "document.pdf") })
  );
  shell.append(toolbar, h("div", { class: "toolbar" }, sq, button("Search", { icon: "search", onClick: search })), found, h("div", { style: "margin-top:10px" }, wrap2));
  const onResize = () => {
    if (fit && pdf2) render();
  };
  addEventListener("resize", onResize);
  const all = (await ctx.lib.all()).filter((r) => extFromPath(r.name) === "pdf").sort((a, b) => (b.lastOpened || b.addedAt) - (a.lastOpened || a.addedAt));
  recentBox.append(h("h3", { style: "margin:6px 0" }, "Recent documents"), all.length ? h("div", { class: "list" }, ...all.slice(0, 10).map((r) => h(
    "div",
    { class: "item noselect cat-document", style: "cursor:pointer", tabindex: 0, role: "button", onClick: async () => {
      const b = await ctx.lib.blob(r.id);
      if (b) {
        await ctx.lib.update(r.id, { lastOpened: Date.now() });
        open(b, r);
      }
    }, onKeydown: (e) => {
      if (e.key === "Enter") e.target.click();
    } },
    thumbBox("document"),
    h("div", { class: "grow" }, h("div", { class: "name trunc" }, r.name), h("div", { class: "meta" }, h("span", null, formatBytes(r.size)))),
    h("span", null)
  ))) : emptyState("No PDFs yet", "Open a PDF from your device. It is kept in the library so it shows up here."));
  root.append(pageHead("PDF reader", "Opened locally. The file never leaves this device.", picker, button("Open PDF", { icon: "plus", kind: "primary", onClick: () => picker.click() })), holder, shell, recentBox);
  if (params.id) {
    const r = await ctx.lib.get(params.id);
    const b = r && await ctx.lib.blob(r.id);
    if (b) {
      await ctx.lib.update(r.id, { lastOpened: Date.now() });
      await open(b, r);
    }
  }
  return () => {
    alive = false;
    removeEventListener("resize", onResize);
    try {
      renderTask?.cancel();
    } catch {
    }
    pdf2?.destroy();
  };
}
const pdf = { id: "pdf", label: "PDF", icon: "pdf", popup: false, needs: () => true, mount: mount$6 };
function safeEntryPath(name) {
  if (typeof name !== "string" || !name || name.includes("\0")) return null;
  const norm = name.replace(/\\/g, "/");
  if (norm.startsWith("/") || /^[a-zA-Z]:/.test(norm)) return null;
  const parts = norm.split("/").filter((p) => p !== "" && p !== ".");
  if (!parts.length || parts.some((p) => p === "..")) return null;
  return parts.map((p) => sanitizeFilename(p, "_")).join("/");
}
const ZIP_LIMITS = { maxEntries: 1e4, maxTotalBytes: 2 * 1024 ** 3, maxCompressionRatio: 1e3 };
const sizeOf = (e) => typeof e._data?.uncompressedSize === "number" ? e._data.uncompressedSize : null;
const packedOf = (e) => typeof e._data?.compressedSize === "number" ? e._data.compressedSize : null;
async function mount$5(root, ctx, params) {
  const JSZip = (await __vitePreload(async () => {
    const { default: __vite_default__ } = await import("./jszip.min-DGmRQ-Dl.js").then((n) => n.j);
    return { default: __vite_default__ };
  }, true ? [] : void 0, import.meta.url)).default;
  let zip2 = null, name = "", entries = [];
  const body = h("div"), prog = h("div");
  function setProgress(label, pct) {
    clear(prog);
    if (label == null) return;
    prog.append(h("div", { class: "panel" }, h("div", { class: "small muted" }, label), h("div", { class: "bar" }, h("i", { style: `width:${Math.round(pct)}%` }))));
  }
  async function openZip(blob, label) {
    setProgress("Reading archive…", 5);
    try {
      zip2 = await JSZip.loadAsync(blob);
      name = label;
      const raw = Object.values(zip2.files).filter((f) => !f.dir);
      if (raw.length > ZIP_LIMITS.maxEntries) {
        zip2 = null;
        throw new Error(`This archive has ${raw.length} files, more than the ${ZIP_LIMITS.maxEntries} DOWNOVA will open.`);
      }
      entries = raw.map((f) => {
        const safe = safeEntryPath(f.name), size = sizeOf(f), packed = packedOf(f);
        const bomb = size != null && packed ? size > 10 * 1024 * 1024 && size / Math.max(1, packed) > ZIP_LIMITS.maxCompressionRatio : false;
        return { f, name: f.name, safe, size, bomb, date: f.date };
      });
      const total = entries.reduce((n, e) => n + (e.size || 0), 0);
      if (total > ZIP_LIMITS.maxTotalBytes) {
        zip2 = null;
        entries = [];
        throw new Error("The archive would expand to more than 2 GB, so it was not opened.");
      }
      setProgress(null);
      paint();
    } catch (e) {
      setProgress(null);
      zip2 = null;
      entries = [];
      clear(body).append(emptyState("Could not open this archive", /corrupt|end of central|signature|Can't find/i.test(e.message) ? "The file is damaged or is not a ZIP. Other archive formats (RAR, 7Z, TAR) are not supported." : e.message));
    }
  }
  const blocked = (e) => !e.safe ? "Blocked: unsafe path" : e.bomb ? "Blocked: suspicious compression ratio" : null;
  async function extractOne(e) {
    const why = blocked(e);
    if (why) return ctx.toast(why, "error");
    try {
      setProgress(`Extracting ${e.safe}…`, 0);
      const blob = await e.f.async("blob", (m) => setProgress(`Extracting ${e.safe}…`, m.percent));
      ctx.platform.saveBlob(blob, sanitizeFilename(e.safe.split("/").pop()));
      setProgress(null);
    } catch {
      setProgress(null);
      ctx.toast("Could not extract that file. It may be encrypted or damaged.", "error");
    }
  }
  async function extractAll() {
    const ok = entries.filter((e) => !blocked(e));
    let bytes = 0, done2 = 0, failed = 0;
    for (const e of ok) {
      setProgress(`Extracting ${done2 + 1} of ${ok.length}: ${e.safe}`, done2 / ok.length * 100);
      try {
        const blob = await e.f.async("blob");
        bytes += blob.size;
        if (bytes > ZIP_LIMITS.maxTotalBytes) {
          ctx.toast("Stopped: extracted data passed 2 GB.", "error");
          break;
        }
        await importFiles([new File([blob], e.safe)], { tags: ["extracted"], extract: extractForLibrary });
      } catch {
        failed++;
      }
      done2++;
    }
    setProgress(null);
    const skipped = entries.length - ok.length;
    ctx.toast(`Extracted ${done2 - failed} files into the library${failed ? `, ${failed} failed` : ""}${skipped ? `, ${skipped} blocked` : ""}.`, failed ? "error" : "ok");
    ctx.platform.notify?.("extraction", "Extraction complete", `${done2 - failed} files from ${name} were added to the library.`);
  }
  function paint() {
    clear(body);
    if (!zip2) return body.append(emptyState("Open a ZIP archive", "Choose a file or drop one here. It is read on this device only."));
    const total = entries.reduce((n, e) => n + (e.size || 0), 0);
    body.append(
      h("div", { class: "row wrap", style: "margin-bottom:10px" }, h("h2", { class: "grow trunc" }, name), badge(`${entries.length} files`), badge(formatBytes(total) + " unpacked"), button("Extract all to library", { icon: "library", kind: "primary", onClick: extractAll })),
      h("div", { class: "list" }, ...entries.slice(0, 1e3).map((e) => {
        const why = blocked(e);
        return h(
          "div",
          { class: `item noselect cat-archive ${why ? "dim" : ""}` },
          h("div", { class: "thumb" }, "·"),
          h("div", { class: "grow" }, h("div", { class: "name trunc", title: e.name }, e.safe || e.name), h("div", { class: "meta" }, h("span", null, e.size != null ? formatBytes(e.size) : "size unknown"), e.date ? h("span", null, timeLabel(e.date)) : null, why ? h("span", { style: "color:var(--danger)" }, why) : null)),
          why ? badge("Blocked", "bad") : button("Extract", { icon: "save", kind: "sm", onClick: () => extractOne(e) })
        );
      })),
      entries.length > 1e3 ? h("p", { class: "muted small" }, `Showing the first 1000 of ${entries.length}.`) : null
    );
  }
  const makeBox = h("div");
  async function createPanel() {
    const files = (await ctx.lib.all()).sort((a, b) => b.addedAt - a.addedAt);
    const sel2 = /* @__PURE__ */ new Set();
    const nameIn = h("input", { class: "field", value: "archive.zip", "aria-label": "ZIP name" });
    const go = button("Create ZIP", { icon: "zip", kind: "primary", disabled: true, onClick: async () => {
      const chosen = files.filter((f) => sel2.has(f.id));
      const z = new JSZip();
      const used = /* @__PURE__ */ new Set();
      try {
        for (const f of chosen) {
          let n = safeEntryPath(f.name) || sanitizeFilename(f.name);
          const base = n;
          let k = 1;
          while (used.has(n.toLowerCase())) n = base.replace(/(\.[^./]+)?$/, ` (${k++})$1`);
          used.add(n.toLowerCase());
          z.file(n, await ctx.lib.blob(f.id));
        }
        const out = await z.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } }, (m) => setProgress("Creating ZIP…", m.percent));
        setProgress(null);
        const fname = sanitizeFilename(nameIn.value.endsWith(".zip") ? nameIn.value : nameIn.value + ".zip", "archive.zip");
        ctx.platform.saveBlob(out, fname);
        ctx.toast(`Created ${fname} (${formatBytes(out.size)}).`, "ok");
      } catch (e) {
        setProgress(null);
        ctx.toast(`Could not create the ZIP: ${e.message}`, "error");
      }
    } });
    clear(makeBox).append(h("div", { class: "panel" }, h("h2", null, "Create a ZIP"), files.length ? h("div", { class: "list", style: "max-height:240px;overflow:auto;margin:8px 0" }, ...files.map((f) => {
      const cb = h("input", { type: "checkbox", "aria-label": f.name });
      cb.addEventListener("change", () => {
        cb.checked ? sel2.add(f.id) : sel2.delete(f.id);
        go.disabled = !sel2.size;
      });
      return h("label", { class: "row" }, cb, h("span", { class: "grow trunc" }, f.name), h("span", { class: "muted small" }, formatBytes(f.size)));
    })) : h("p", { class: "muted" }, "Add files to the library first."), h("div", { class: "toolbar", style: "margin:0" }, nameIn, go)));
  }
  const picker = fileInput({ accept: ".zip,application/zip", multiple: false, onFiles: ([f]) => openZip(f, f.name) });
  const zone = h("div", { class: "drop" }, "Drop a .zip here, or ", button("choose one", { kind: "sm", onClick: () => picker.click() }));
  dropZone(zone, ([f]) => openZip(f, f.name));
  root.append(pageHead("ZIP manager", "Opens ZIP archives locally. Entries with paths that try to escape the folder are blocked. RAR, 7Z and TAR are not supported.", picker), zone, prog, h("div", { style: "margin-top:12px" }, body), makeBox);
  paint();
  await createPanel();
  if (params.id) {
    const b = await ctx.lib.blob(params.id), r = await ctx.lib.get(params.id);
    if (b && r) await openZip(b, r.name);
  }
}
const zip = { id: "zip", label: "ZIP", icon: "zip", popup: false, needs: () => true, mount: mount$5 };
class ConversionError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
const OUTPUTS = {
  png: { mime: "image/png", ext: "png", lossy: false, alpha: true },
  jpeg: { mime: "image/jpeg", ext: "jpeg", lossy: true, alpha: false },
  jpg: { mime: "image/jpeg", ext: "jpg", lossy: true, alpha: false },
  webp: { mime: "image/webp", ext: "webp", lossy: true, alpha: true }
};
function browserEnv() {
  return {
    decode: (blob) => createImageBitmap(blob),
    createCanvas: (w, h2) => new OffscreenCanvas(w, h2),
    sanitizeSvg: null
  };
}
function targetSize(w, h2, maxWidth = 0, maxHeight = 0) {
  let scale = 1;
  if (maxWidth > 0 && w > maxWidth) scale = Math.min(scale, maxWidth / w);
  if (maxHeight > 0 && h2 > maxHeight) scale = Math.min(scale, maxHeight / h2);
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h2 * scale)) };
}
async function convertImage(blob, opts = {}, env = browserEnv()) {
  const { format = "png", quality = 0.92, maxWidth = 0, maxHeight = 0, background = "#ffffff" } = opts;
  const out = OUTPUTS[format];
  if (!out) throw new ConversionError("unsupported-format", `"${format}" is not a supported output format.`);
  const head = sniff(new Uint8Array(await blob.slice(0, 600).arrayBuffer()));
  let source = blob;
  if (head?.ext === "svg" || blob.type === "image/svg+xml") {
    if (!env.sanitizeSvg) throw new ConversionError("svg-source", 'This is a vector SVG. Use "Save as SVG" to keep it lossless; raster conversion of SVG is only available in the DOWNOVA dashboard.');
    const clean = env.sanitizeSvg(await blob.text());
    if (!clean) throw new ConversionError("svg-unsafe", "This SVG could not be sanitised safely, so it was not rendered.");
    source = new Blob([clean], { type: "image/svg+xml" });
  } else if (!head && !/^image\//.test(blob.type)) {
    throw new ConversionError("not-image", "The file is not a recognised image.");
  }
  let bmp;
  try {
    bmp = await env.decode(source);
  } catch {
    throw new ConversionError("decode", "The browser could not decode this file as an image.");
  }
  const sw = bmp.width || bmp.naturalWidth || 0, sh = bmp.height || bmp.naturalHeight || 0;
  if (!sw || !sh) {
    bmp.close?.();
    throw new ConversionError("decode", "The image has no readable dimensions.");
  }
  const { width, height } = targetSize(sw, sh, maxWidth, maxHeight);
  const canvas = env.createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!out.alpha) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(bmp, 0, 0, width, height);
  bmp.close?.();
  let result;
  try {
    result = await canvas.convertToBlob({ type: out.mime, quality: out.lossy ? clamp(Number(quality) || 0.92, 0.05, 1) : void 0 });
  } catch {
    throw new ConversionError("encode", `The browser could not encode ${format.toUpperCase()}.`);
  }
  const check = sniff(new Uint8Array(await result.slice(0, 16).arrayBuffer()));
  if (check?.mime !== out.mime) throw new ConversionError("encode-unsupported", `This browser cannot encode ${format.toUpperCase()}; it produced ${check?.mime || "an unknown format"} instead, so nothing was saved.`);
  const notes = [];
  if (!out.alpha) notes.push("JPEG has no transparency; transparent areas were filled with white.");
  if (width !== sw || height !== sh) notes.push(`Resized from ${sw}×${sh} to ${width}×${height}.`);
  if (head?.ext === "gif") notes.push("Animated GIFs convert to a single still frame.");
  return { blob: new Blob([result], { type: out.mime }), mime: out.mime, ext: out.ext, width, height, notes };
}
function convertedName(srcNameOrUrl, ext) {
  const base = splitName(sanitizeFilename(srcNameOrUrl.includes("/") || srcNameOrUrl.includes(":") ? fileNameFromUrl(srcNameOrUrl, "image") : srcNameOrUrl, "image")).base || "image";
  return `${base}.${ext}`;
}
const BAD_TAGS = /* @__PURE__ */ new Set(["script", "foreignobject", "iframe", "object", "embed", "audio", "video", "canvas", "link", "meta", "base", "style@import"]);
function sanitizeSvg(text, { DOMParserCtor = globalThis.DOMParser, SerializerCtor = globalThis.XMLSerializer } = {}) {
  if (!DOMParserCtor || !SerializerCtor) return null;
  if (/<!ENTITY|<!DOCTYPE[^>]*\[/i.test(text)) return null;
  const doc = new DOMParserCtor().parseFromString(String(text), "image/svg+xml");
  const root = doc.documentElement;
  if (!root || root.nodeName.toLowerCase() !== "svg" || doc.getElementsByTagName("parsererror").length) return null;
  const walk = (el) => {
    for (const child of [...el.children]) {
      if (BAD_TAGS.has(child.localName.toLowerCase())) {
        child.remove();
        continue;
      }
      walk(child);
    }
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase(), val = attr.value.trim();
      const isRef = name === "href" || name === "xlink:href" || name === "src";
      if (name.startsWith("on")) el.removeAttribute(attr.name);
      else if (isRef && !(val.startsWith("#") || /^data:image\/(png|jpe?g|gif|webp);/i.test(val))) el.removeAttribute(attr.name);
      else if (name === "style" && /(url\(\s*["']?\s*(?!#)|expression\(|javascript:|@import)/i.test(val)) el.removeAttribute(attr.name);
    }
    if (el.localName.toLowerCase() === "style" && /@import|url\(\s*["']?\s*(?!#)/i.test(el.textContent)) el.remove();
  };
  walk(root);
  return new SerializerCtor().serializeToString(root);
}
function pageEnv() {
  const base = browserEnv();
  return {
    ...base,
    sanitizeSvg: (t) => sanitizeSvg(t),
    decode: async (blob) => {
      try {
        return await createImageBitmap(blob);
      } catch {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        try {
          await img.decode();
        } finally {
          setTimeout(() => URL.revokeObjectURL(url), 0);
        }
        return img;
      }
    }
  };
}
async function mount$4(root, ctx) {
  const s = ctx.settings;
  let results = [], busy = false;
  const fmt = h("select", { class: "field", "aria-label": "Output format" }, ...[["png", "PNG (lossless, keeps transparency)"], ["jpeg", "JPEG (.jpeg)"], ["jpg", "JPG (.jpg)"], ["webp", "WebP (keeps transparency)"]].map(([v, l]) => h("option", { value: v, selected: v === s.imageFormat }, l)));
  const quality = h("input", { type: "range", min: 10, max: 100, value: Math.round(s.imageQuality * 100), "aria-label": "Quality" }), qv = h("span", { class: "muted" }, `${Math.round(s.imageQuality * 100)}%`);
  const maxw = h("input", { class: "field", type: "number", min: 0, max: 16e3, step: 50, value: s.imageMaxWidth, "aria-label": "Maximum width" });
  const hint = h("p", { class: "muted small" });
  const out = h("div", { class: "list" });
  const upd = () => {
    const lossy = fmt.value !== "png";
    quality.disabled = !lossy;
    hint.textContent = fmt.value.startsWith("jp") ? "JPEG has no transparency: transparent areas are filled with white." : fmt.value === "png" ? "PNG is lossless, so the quality slider does not apply." : "WebP keeps transparency.";
  };
  fmt.addEventListener("change", upd);
  quality.addEventListener("input", () => {
    qv.textContent = `${quality.value}%`;
  });
  upd();
  const paint = () => {
    clear(out);
    if (!results.length) return out.append(emptyState("No conversions yet", "Choose images to convert. Each result is re-encoded, never just renamed."));
    for (const r of results) out.append(h(
      "div",
      { class: "item noselect cat-image" },
      h("div", { class: "thumb" }, r.url ? h("img", { src: r.url, alt: "" }) : null),
      h("div", { class: "grow" }, h("div", { class: "name trunc" }, r.error ? r.src : r.name), h("div", { class: "meta" }, r.error ? h("span", { style: "color:var(--danger)" }, r.error) : [h("span", null, `${formatBytes(r.srcSize)} → ${formatBytes(r.blob.size)}`), h("span", null, `${r.width}×${r.height}`), ...r.notes.map((n) => h("span", null, n))])),
      r.error ? badge("Failed", "bad") : h("div", { class: "row gap-s" }, button("Save", { icon: "save", kind: "sm", onClick: () => ctx.platform.saveBlob(r.blob, r.name) }), button("To library", { kind: "sm", onClick: async () => {
        await importFiles([new File([r.blob], r.name, { type: r.blob.type })], { extract: extractForLibrary });
        ctx.toast("Added to the library.", "ok");
      } }))
    ));
  };
  async function run(files) {
    if (busy) return;
    busy = true;
    const env = pageEnv();
    results.forEach((r) => r.url && URL.revokeObjectURL(r.url));
    results = [];
    for (const f of files) {
      try {
        const r = await convertImage(f, { format: fmt.value, quality: Number(quality.value) / 100, maxWidth: Number(maxw.value) || 0 }, env);
        results.push({ ...r, name: convertedName(f.name, r.ext), srcSize: f.size, url: URL.createObjectURL(r.blob) });
      } catch (e) {
        results.push({ error: e instanceof ConversionError ? e.message : "Conversion failed.", src: f.name });
      }
      paint();
    }
    busy = false;
    ctx.platform.notify?.("conversion", "Conversion finished", `${results.filter((r) => !r.error).length} of ${files.length} images converted.`);
  }
  const picker = fileInput({ accept: "image/*", onFiles: run });
  const zone = h("div", { class: "drop" }, "Drop images here, or ", button("choose images", { kind: "sm", onClick: () => picker.click() }));
  dropZone(zone, (f) => run(f.filter((x) => x.type.startsWith("image/") || /\.(svg|png|jpe?g|gif|webp|bmp|avif|ico)$/i.test(x.name))));
  root.append(
    pageHead("Image converter", "Re-encodes images to PNG, JPEG or WebP in your browser. Nothing is uploaded."),
    h("div", { class: "panel" }, h("div", { class: "stack" }, field("Output format", fmt), field("Quality", h("div", { class: "row" }, quality, qv)), field("Maximum width in pixels (0 keeps the original)", maxw)), hint),
    h("div", { style: "margin:12px 0" }, zone, picker),
    out,
    h("details", { class: "panel", style: "margin-top:14px" }, h("summary", null, "What is not available"), h(
      "ul",
      { class: "muted" },
      h("li", null, "Raster images are never turned into SVG. Wrapping a bitmap in SVG is not vectorisation, so DOWNOVA does not offer it. Real SVG files are preserved or rasterised after sanitising."),
      h("li", null, "Audio and video conversion needs ffmpeg.wasm, which is not bundled in this build."),
      h("li", null, "Document conversion (Word, Excel, PowerPoint) is not available. DOWNOVA does not fake it by renaming files.")
    ))
  );
  paint();
  return () => results.forEach((r) => r.url && URL.revokeObjectURL(r.url));
}
const converter = { id: "converter", label: "Convert", icon: "convert", popup: false, needs: () => true, mount: mount$4 };
async function sha256Hex(blob) {
  const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function findDuplicateGroups(files, { hash = sha256Hex, onProgress } = {}) {
  const bySize = /* @__PURE__ */ new Map();
  for (const f of files) if (f.size > 0) (bySize.get(f.size) || bySize.set(f.size, []).get(f.size)).push(f);
  const candidates = [...bySize.values()].filter((g) => g.length > 1);
  const total = candidates.reduce((n, g) => n + g.length, 0);
  let done2 = 0;
  const groups = [];
  for (const g of candidates) {
    const byHash = /* @__PURE__ */ new Map();
    for (const f of g) {
      const h2 = await hash(f.blob ?? f);
      (byHash.get(h2) || byHash.set(h2, []).get(h2)).push(f);
      onProgress?.(++done2, total);
    }
    for (const [h2, items] of byHash) if (items.length > 1) groups.push({ hash: h2, size: items[0].size, items, wasted: items[0].size * (items.length - 1) });
  }
  return groups.sort((a, b) => b.wasted - a.wasted);
}
const totalWasted = (groups) => groups.reduce((n, g) => n + g.wasted, 0);
async function mount$3(root, ctx) {
  let groups = null, sel2 = /* @__PURE__ */ new Set(), scanning = false;
  const body = h("div"), prog = h("div", { class: "muted small" });
  const del = button("Delete selected", { icon: "trash", kind: "danger", disabled: true, onClick: async () => {
    const ids = [...sel2], size = groups.flatMap((g) => g.items).filter((i) => sel2.has(i.id)).reduce((n, i) => n + i.size, 0);
    if (!await ctx.confirm(`Delete ${ids.length} file${ids.length > 1 ? "s" : ""} (${formatBytes(size)}) from the library? You chose these yourself; nothing is deleted automatically. This cannot be undone.`, { okLabel: "Delete", danger: true })) return;
    await ctx.lib.remove(ids);
    ctx.toast(`Deleted ${ids.length} files.`, "ok");
    sel2.clear();
    scan();
  } });
  const refresh = () => {
    del.disabled = !sel2.size;
    del.lastChild.textContent = sel2.size ? `Delete ${sel2.size} selected` : "Delete selected";
  };
  function paint() {
    clear(body);
    if (!groups) return body.append(emptyState("Scan your library for duplicates", "Files are compared by size first, then by a SHA-256 fingerprint of their contents. Only exact copies are grouped."));
    if (!groups.length) return body.append(emptyState("No duplicates found", "Every file in the library has unique contents."));
    body.append(h(
      "div",
      { class: "row wrap", style: "margin-bottom:10px" },
      h("strong", { class: "grow" }, `${groups.length} groups · ${formatBytes(totalWasted(groups))} could be freed`),
      button("Select all but the oldest in each group", { onClick: () => {
        sel2.clear();
        for (const g of groups) [...g.items].sort((a, b) => a.addedAt - b.addedAt).slice(1).forEach((i) => sel2.add(i.id));
        paint();
      } }),
      button("Clear selection", { onClick: () => {
        sel2.clear();
        paint();
      } })
    ));
    for (const g of groups) body.append(h(
      "div",
      { class: "panel" },
      h("div", { class: "row" }, h("strong", { class: "grow" }, `${g.items.length} identical files · ${formatBytes(g.size)} each`), badge(`${formatBytes(g.wasted)} wasted`, "warn")),
      ...g.items.map((i) => {
        const cb = h("input", { type: "checkbox", checked: sel2.has(i.id), "aria-label": `Select ${i.name}` });
        cb.addEventListener("change", () => {
          cb.checked ? sel2.add(i.id) : sel2.delete(i.id);
          refresh();
        });
        return h("label", { class: "row", style: "padding:6px 0;border-top:1px solid var(--line);margin-top:6px" }, cb, h("span", { class: "grow trunc" }, i.name), h("span", { class: "muted small" }, timeLabel(i.addedAt)));
      })
    ));
    refresh();
  }
  async function scan() {
    if (scanning) return;
    scanning = true;
    sel2.clear();
    prog.textContent = "Reading library…";
    try {
      const all = await ctx.lib.all();
      const sizeCounts = /* @__PURE__ */ new Map();
      all.forEach((f) => sizeCounts.set(f.size, (sizeCounts.get(f.size) || 0) + 1));
      const cands = all.filter((f) => f.size > 0 && sizeCounts.get(f.size) > 1);
      const withBlobs = [];
      for (const f of cands) withBlobs.push({ ...f, blob: await ctx.lib.blob(f.id) });
      groups = await findDuplicateGroups(withBlobs, { onProgress: (i, n) => {
        prog.textContent = `Fingerprinting ${i} of ${n} files…`;
      } });
      prog.textContent = `Checked ${all.length} files.`;
    } catch (e) {
      prog.textContent = "";
      ctx.toast(`Scan failed: ${e.message}`, "error");
    }
    scanning = false;
    paint();
    refresh();
  }
  root.append(pageHead("Duplicate finder", "Finds exact copies in your DOWNOVA library. You review and confirm every deletion.", button("Scan library", { icon: "dup", kind: "primary", onClick: scan }), del), prog, body);
  paint();
}
const duplicates = { id: "duplicates", label: "Duplicates", icon: "dup", popup: false, needs: () => true, mount: mount$3 };
function computeAnalytics(items, now = Date.now(), days = 14) {
  const c = { total: items.length, completed: 0, failed: 0, cancelled: 0, active: 0, queued: 0 };
  const byCategory = {};
  let bytes = 0;
  for (const i of items) {
    if (i.status === "completed") c.completed++;
    else if (i.status === "failed") c.failed++;
    else if (i.status === "cancelled") c.cancelled++;
    else if (i.status === "active" || i.status === "paused") c.active++;
    else if (i.status === "queued") c.queued++;
    if (i.status === "completed") {
      const cat = i.category || "other";
      byCategory[cat] = byCategory[cat] || { count: 0, bytes: 0 };
      byCategory[cat].count++;
      if (i.fileSize > 0) {
        byCategory[cat].bytes += i.fileSize;
        bytes += i.fileSize;
      }
    }
  }
  const day = 864e5, start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const trend = [];
  for (let k = days - 1; k >= 0; k--) {
    const from = start.getTime() - k * day;
    trend.push({ date: from, count: items.filter((i) => i.status === "completed" && i.finishedAt >= from && i.finishedAt < from + day).length });
  }
  const done2 = items.filter((i) => i.status === "completed");
  return {
    counts: c,
    bytes,
    byCategory,
    trend,
    successRate: c.completed + c.failed ? c.completed / (c.completed + c.failed) : null,
    largest: [...done2].filter((i) => i.fileSize > 0).sort((a, b) => b.fileSize - a.fileSize).slice(0, 5),
    recent: [...done2].sort((a, b) => b.finishedAt - a.finishedAt).slice(0, 5)
  };
}
const stat = (label, value, sub) => h("div", { class: "stat" }, h("b", null, value), h("span", { class: "muted" }, label), sub ? h("div", { class: "muted small" }, sub) : null);
async function mount$2(root, ctx) {
  const lib = await ctx.lib.all().catch(() => []);
  const hasQueue = ctx.platform.caps.queue && ctx.platform.id === "chrome";
  const a = hasQueue ? computeAnalytics(await ctx.platform.getQueue()) : null;
  let est = null;
  try {
    est = await navigator.storage?.estimate?.();
  } catch {
  }
  root.append(pageHead("Insights", "Every number here is counted from your real download history and library. Nothing is estimated or made up."));
  if (a) {
    const max = Math.max(1, ...a.trend.map((t) => t.count));
    root.append(
      h(
        "div",
        { class: "stats" },
        stat("Downloads recorded", a.counts.total),
        stat("Completed", a.counts.completed),
        stat("Failed", a.counts.failed),
        stat("Cancelled", a.counts.cancelled),
        stat("Success rate", a.successRate == null ? "–" : `${Math.round(a.successRate * 100)}%`, "completed ÷ (completed + failed)"),
        stat("Downloaded size", formatBytes(a.bytes), "files with a known size")
      ),
      h("div", { class: "panel", style: "margin-top:12px" }, h("h2", null, "Completed per day (last 14 days)"), a.counts.completed ? h("div", { class: "spark", role: "img", "aria-label": "Completed downloads per day" }, ...a.trend.map((t) => h("i", { style: `height:${Math.max(3, t.count / max * 100)}%`, title: `${dateLabel(t.date)}: ${t.count}` }))) : h("p", { class: "muted" }, "No completed downloads yet.")),
      h("div", { class: "panel" }, h("h2", null, "By file type"), Object.keys(a.byCategory).length ? h("table", { class: "t" }, h("tbody", null, ...Object.entries(a.byCategory).sort((x, y) => y[1].count - x[1].count).map(([c, v]) => h("tr", null, h("td", null, CATEGORY_LABELS[c] || c), h("td", null, `${v.count} files`), h("td", { class: "muted" }, v.bytes ? formatBytes(v.bytes) : "size unknown"))))) : h("p", { class: "muted" }, "Nothing yet.")),
      h("div", { class: "panel" }, h("h2", null, "Largest downloads"), a.largest.length ? h("table", { class: "t" }, h("tbody", null, ...a.largest.map((i) => h("tr", null, h("td", { class: "trunc" }, i.name), h("td", null, formatBytes(i.fileSize)))))) : h("p", { class: "muted" }, "None with a known size.")),
      h("div", { class: "panel" }, h("h2", null, "Recent downloads"), a.recent.length ? h("table", { class: "t" }, h("tbody", null, ...a.recent.map((i) => h("tr", null, h("td", { class: "trunc" }, i.name), h("td", { class: "muted" }, dateLabel(i.finishedAt)))))) : h("p", { class: "muted" }, "None yet."))
    );
  } else root.append(h("p", { class: "muted" }, "Download analytics need the Chrome extension, which can see real download results."));
  const bySize = /* @__PURE__ */ new Map();
  lib.forEach((f) => bySize.set(f.size, (bySize.get(f.size) || 0) + 1));
  const possible = lib.filter((f) => f.size > 0 && bySize.get(f.size) > 1).length;
  const cats = Object.fromEntries(CATEGORIES.map((c) => [c, lib.filter((f) => f.category === c)]));
  root.append(h(
    "div",
    { class: "panel" },
    h("h2", null, "Library storage"),
    h(
      "div",
      { class: "stats" },
      stat("Files", lib.length),
      stat("Used by library", formatBytes(lib.reduce((n, f) => n + f.size, 0))),
      est?.quota ? stat("Browser storage in use", formatBytes(est.usage), `of ${formatBytes(est.quota)} available to DOWNOVA`) : null,
      stat("Possible duplicates", possible, "same size; run Duplicate finder to confirm")
    ),
    lib.length ? h("table", { class: "t", style: "margin-top:10px" }, h("tbody", null, ...CATEGORIES.filter((c) => cats[c].length).map((c) => h("tr", null, h("td", null, CATEGORY_LABELS[c]), h("td", null, `${cats[c].length} files`), h("td", { class: "muted" }, formatBytes(cats[c].reduce((n, f) => n + f.size, 0))))))) : emptyState("Library is empty", "Add files to see storage by type."),
    lib.length ? h("div", { style: "margin-top:10px" }, h("h3", null, "Largest files"), h("table", { class: "t" }, h("tbody", null, ...[...lib].sort((x, y) => y.size - x.size).slice(0, 5).map((f) => h("tr", null, h("td", { class: "trunc" }, f.name), h("td", null, formatBytes(f.size))))))) : null
  ));
}
const insights = { id: "insights", label: "Insights", icon: "chart", popup: false, needs: () => true, mount: mount$2 };
async function mount$1(root, ctx) {
  const bag = urlBag();
  let items = [];
  const body = h("div");
  const thumb = (r) => r.thumb ? bag.make(r.thumb) : null;
  async function reload() {
    items = (await ctx.lib.all()).filter((r) => (r.tags || []).includes("status")).sort((a, b) => (b.origin || b.addedAt) - (a.origin || a.addedAt));
    paint();
  }
  async function open(r) {
    const blob = await ctx.lib.blob(r.id);
    if (!blob) return;
    const mbag = urlBag();
    let close0;
    const prev = await previewBody(ctx, r, blob, mbag, () => close0?.(null));
    await ctx.modal({ title: "Status", wide: true, body: (close) => {
      close0 = close;
      return h("div", { class: "stack" }, prev, metaList(r));
    }, actions: (close) => [
      button("Save a copy", { icon: "save", onClick: () => ctx.platform.saveBlob(blob, r.name) }),
      button("Share", { icon: "share", onClick: async () => {
        try {
          await ctx.platform.shareBlob(blob, r.name) || ctx.toast("Sharing is not supported here. Use Save a copy.", "error");
        } catch (e) {
          if (e?.name !== "AbortError") ctx.toast("Could not share.", "error");
        }
      } }),
      button("Delete", { icon: "trash", kind: "danger", onClick: async () => {
        if (await ctx.confirm("Delete this status from DOWNOVA? The original in WhatsApp is not touched.", { okLabel: "Delete", danger: true })) {
          await ctx.lib.remove(r.id);
          close(null);
          reload();
        }
      } })
    ] });
    mbag.freeAll();
  }
  function paint() {
    clear(body);
    if (!items.length) return body.append(emptyState("No statuses imported", "Use “Import statuses” and pick files in the system file picker."));
    const days = /* @__PURE__ */ new Map();
    for (const r of items) {
      const k = dateLabel(r.origin || r.addedAt);
      (days.get(k) || days.set(k, []).get(k)).push(r);
    }
    for (const [day, list] of days) body.append(h("h3", { style: "margin:14px 0 8px" }, `${day} · ${list.length}`), h("div", { class: "grid" }, ...list.map((r) => h(
      "button",
      { class: "card", type: "button", onClick: () => open(r) },
      h("div", { class: "pic" }, thumb(r) ? h("img", { src: thumb(r), alt: "" }) : icon(r.category, 32)),
      h("div", { class: "cap" }, h("b", { class: "trunc" }, r.name), h("span", { class: "muted small" }, formatBytes(r.size)))
    ))));
  }
  const picker = fileInput({ accept: "image/*,video/*", onFiles: async (files) => {
    const done2 = await importFiles(files, { tags: ["status"], extract: extractForLibrary });
    ctx.toast(`${done2.length} imported.`, "ok");
    reload();
  } });
  const note = h(
    "details",
    { class: "panel" },
    h("summary", null, "How to import on Android"),
    h("p", { class: "muted" }, "Android’s scoped storage does not let any app read WhatsApp’s private files silently. You choose them yourself in the system picker, usually under Android › media › com.whatsapp › WhatsApp › Media › .Statuses (WhatsApp Business uses its own folder). Open a status in WhatsApp first so it is cached. Which folders the picker lets you browse depends on your Android version and phone maker."),
    h("p", { class: "muted small" }, "This feature uses the standard file picker. It is untested on real devices in this build.")
  );
  root.append(pageHead("Status saver", "Keep copies of statuses you choose to import. Files stay on this device.", picker, button("Import statuses", { icon: "plus", kind: "primary", onClick: () => picker.click() })), note, body);
  await reload();
  return () => {
    bag.freeAll();
  };
}
const status = { id: "status", label: "Status", icon: "phone", popup: false, needs: () => true, mount: mount$1 };
const enc = new TextEncoder(), dec = new TextDecoder();
const ITER = 25e4;
async function keyFrom(pass, salt, usage) {
  const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, usage);
}
async function encryptJson(obj, passphrase) {
  if (!passphrase || passphrase.length < 8) throw new Error("Use a passphrase of at least 8 characters.");
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFrom(passphrase, salt, ["encrypt"]);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj))));
  return JSON.stringify({ app: "downova", v: 1, kdf: "PBKDF2-SHA256", iter: ITER, salt: bytesToBase64(salt), iv: bytesToBase64(iv), data: bytesToBase64(data) });
}
async function decryptJson(text, passphrase) {
  let p;
  try {
    p = JSON.parse(text);
  } catch {
    throw new Error("This is not a DOWNOVA backup file.");
  }
  if (p?.app !== "downova" || p.v !== 1) throw new Error("This is not a DOWNOVA backup file.");
  try {
    const key = await keyFrom(passphrase, base64ToBytes(p.salt), ["decrypt"]);
    return JSON.parse(dec.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(p.iv) }, key, base64ToBytes(p.data))));
  } catch {
    throw new Error("Wrong passphrase, or the file is damaged.");
  }
}
const setting = (label, desc, control) => h("div", { class: "setting" }, h("div", null, h("div", { class: "lbl" }, label), desc ? h("div", { class: "muted small" }, desc) : null), control);
const sel = (value, options, onChange, label) => {
  const s = h("select", { class: "field", "aria-label": label }, ...options.map(([v, l]) => h("option", { value: v, selected: String(v) === String(value) }, l)));
  s.addEventListener("change", () => onChange(s.value));
  return s;
};
async function mount(root, ctx) {
  const s0 = ctx.settings, P2 = ctx.platform, ext = P2.id === "chrome";
  const save = (patch) => ctx.save(patch).catch(() => ctx.toast("Could not save that setting.", "error"));
  const num = (v) => Number(v);
  const appearance = h(
    "div",
    { class: "panel" },
    h("h2", null, "Appearance"),
    setting("Theme", null, sel(s0.theme, [["dark", "Dark"], ["light", "Light"], ["system", "Match system"]], (v) => save({ theme: v }), "Theme")),
    setting("Accent colour", null, sel(s0.accent, Object.keys(ACCENTS).map((k) => [k, k[0].toUpperCase() + k.slice(1)]), (v) => save({ accent: v }), "Accent colour")),
    setting("Language", "DOWNOVA is available in English only for now.", h("span", { class: "muted" }, "English"))
  );
  const downloads = ext ? h(
    "div",
    { class: "panel" },
    h("h2", null, "Downloads"),
    setting("Simultaneous downloads", "How many files download at once.", sel(s0.concurrency, [1, 2, 3, 4, 5, 6].map((n) => [n, String(n)]), (v) => save({ concurrency: num(v) }), "Simultaneous downloads")),
    setting("Ask where to save each file", "Chrome shows its Save As dialog. The download folder itself is set in Chrome settings.", toggle(s0.askWhereToSave, (v) => save({ askWhereToSave: v }), "Ask where to save")),
    setting("Keep download history", "When off, finished items are removed from the list straight away (analytics will be empty).", toggle(s0.keepHistory, (v) => save({ keepHistory: v }), "Keep history"))
  ) : null;
  const hoverSw = toggle(s0.hoverEnabled, async (on) => {
    const input = hoverSw.firstChild;
    if (ctx.target === "popup") {
      input.checked = !on;
      ctx.toast("Opening the dashboard to ask for site access…");
      P2.openDashboard("settings");
      return;
    }
    if (on) {
      const ok = await P2.hover.request().catch(() => false);
      if (!ok) {
        input.checked = false;
        return ctx.toast("Site access was not granted, so the hover button stays off.", "error");
      }
    } else await P2.hover.remove().catch(() => {
    });
    await save({ hoverEnabled: on });
    await P2.hover.sync();
    ctx.toast(on ? "Hover button is on." : "Hover button is off and site access was removed.", "ok");
  }, "Hover to download");
  const hover = ext ? h(
    "div",
    { class: "panel" },
    h("h2", null, "Hover to download"),
    setting("Show a download button over videos", "Needs access to the sites you visit so the button can appear. It only offers direct files; streaming and protected video is never offered.", hoverSw)
  ) : null;
  const fmtLabel = (f) => f.toUpperCase();
  const quality = h("input", { type: "range", min: 10, max: 100, step: 1, value: Math.round(s0.imageQuality * 100), "aria-label": "Image quality" });
  const qv = h("span", { class: "muted", style: "min-width:34px;text-align:right" }, `${Math.round(s0.imageQuality * 100)}%`);
  quality.addEventListener("input", () => {
    qv.textContent = `${quality.value}%`;
  });
  quality.addEventListener("change", () => save({ imageQuality: Number(quality.value) / 100 }));
  const maxw = h("input", { class: "field", type: "number", min: 0, max: 16e3, step: 50, value: s0.imageMaxWidth, "aria-label": "Maximum width", style: "width:110px" });
  maxw.addEventListener("change", () => save({ imageMaxWidth: num(maxw.value) || 0 }));
  const menu = ext ? h(
    "div",
    { class: "panel" },
    h("h2", null, "Right-click menu"),
    setting("Preferred image format", 'Used by "Save Image As Preferred Format".', sel(s0.imageFormat, IMAGE_FORMATS.map((f) => [f, fmtLabel(f)]), (v) => save({ imageFormat: v }), "Preferred image format")),
    setting("Quality for JPEG and WebP", "PNG is lossless. JPEG has no transparency, so transparent areas become white.", h("div", { class: "row", style: "min-width:170px" }, quality, qv)),
    setting("Resize wide images to", "0 keeps the original size. Proportions are always kept.", maxw),
    h("details", { style: "margin-top:8px" }, h("summary", null, "Choose which actions appear"), h(
      "div",
      { class: "stack", style: "margin-top:8px" },
      ...MENU_ACTIONS.map(([id, label]) => h("div", { class: "setting" }, h("div", { class: "lbl" }, label), toggle(s0.menu[id], (v) => save({ menu: { [id]: v } }), label)))
    ))
  ) : null;
  const notifLabels = { started: "Download started", completed: "Download completed", failed: "Download failed", conversion: "Image saved or converted", scheduled: "Scheduled download started", extraction: "Archive extracted" };
  const notifs = ext ? h("div", { class: "panel" }, h("h2", null, "Notifications"), ...Object.entries(notifLabels).map(([k, l]) => setting(l, null, toggle(s0.notifications[k], (v) => save({ notifications: { [k]: v } }), l)))) : null;
  const perms = h("div", { class: "muted small" }, "Loading…");
  P2.permissions().then((p) => {
    perms.textContent = ext ? `Permissions: ${p.permissions.join(", ") || "none"}. Site access: ${p.origins?.length ? p.origins.join(", ") : "none granted"}.` : "This app asks for no special permissions. Files you add stay in this browser.";
  }).catch(() => {
    perms.textContent = "Permissions could not be listed.";
  });
  const pass = h("input", { class: "field", type: "password", placeholder: "Passphrase (8+ characters)", "aria-label": "Backup passphrase", autocomplete: "new-password" });
  const download = (blob, name) => P2.saveBlob(blob, name);
  const index = async () => (await ctx.lib.all().catch(() => [])).map(({ name, size, type, category, tags, favorite, addedAt }) => ({ name, size, type, category, tags, favorite, addedAt }));
  const exportData = async () => download(new Blob([JSON.stringify({ app: "downova", exportedAt: (/* @__PURE__ */ new Date()).toISOString(), settings: ctx.settings, history: await P2.getQueue(), libraryIndex: await index() }, null, 2)], { type: "application/json" }), "downova-export.json");
  const backup = async () => {
    try {
      const text = await encryptJson({ settings: ctx.settings, history: await P2.getQueue(), libraryIndex: await index() }, pass.value);
      download(new Blob([text], { type: "application/json" }), "downova-backup.dnv");
      ctx.toast("Encrypted backup created.", "ok");
    } catch (e) {
      ctx.toast(e.message, "error");
    }
  };
  const restoreInput = h("input", { type: "file", accept: ".dnv,application/json", class: "hidden" });
  restoreInput.addEventListener("change", async () => {
    const f = restoreInput.files[0];
    restoreInput.value = "";
    if (!f) return;
    try {
      const data = await decryptJson(await f.text(), pass.value);
      await save(data.settings || {});
      ctx.toast("Settings restored. Files are never part of a backup.", "ok");
    } catch (e) {
      ctx.toast(e.message, "error");
    }
  });
  const privacy = h(
    "div",
    { class: "panel" },
    h("h2", null, "Privacy centre"),
    h("p", { class: "muted small" }, "DOWNOVA has no account, no analytics server and never uploads your files. Everything below stays on this device."),
    perms,
    h(
      "div",
      { class: "toolbar", style: "margin-top:12px" },
      button("Clear download history", { icon: "trash", onClick: async () => {
        if (await ctx.confirm("Remove all finished entries from the download list? Downloaded files are not touched.", { okLabel: "Clear history", danger: true })) {
          await P2.clearHistory();
          ctx.toast("History cleared.", "ok");
        }
      } }),
      button("Clear local library", { icon: "trash", kind: "danger", onClick: async () => {
        if (await ctx.confirm("Delete every file stored in the DOWNOVA library on this device? This cannot be undone.", { okLabel: "Delete library", danger: true })) {
          await ctx.lib.clear();
          ctx.toast("Library cleared.", "ok");
        }
      } }),
      button("Export my data", { icon: "save", onClick: exportData })
    ),
    h("h3", { style: "margin:14px 0 6px" }, "Encrypted backup (optional)"),
    h("p", { class: "muted small" }, "AES-256 encrypted settings, history and a file index. Without the passphrase it cannot be opened, and it cannot be recovered if you lose it."),
    h("div", { class: "toolbar" }, pass, button("Create backup", { icon: "lock", onClick: backup }), button("Restore settings", { onClick: () => restoreInput.click() }), restoreInput)
  );
  const about = h(
    "div",
    { class: "panel" },
    h("h2", null, "About"),
    h("p", { class: "muted" }, `DOWNOVA Cyber Edition ${P2.version()} · ${ext ? "Chrome extension" : P2.id === "android" ? "Android app" : "Web app"}`),
    h("p", { class: "muted small" }, "DOWNOVA only handles direct, permitted files. It does not bypass DRM, sign-in walls, CORS or protected streams.")
  );
  root.append(pageHead("Settings"), appearance, downloads, hover, menu, notifs, privacy, about);
}
const settings = { id: "settings", label: "Settings", icon: "gear", popup: true, needs: () => true, mount };
const VIEWS = [scanner, queue, link, schedule, library, player, pdf, zip, converter, duplicates, insights, status, settings];
function applyTheme(s) {
  const root = document.documentElement;
  const dark = s.theme === "system" ? matchMedia("(prefers-color-scheme: dark)").matches : s.theme === "dark";
  root.dataset.theme = dark ? "dark" : "light";
  root.style.setProperty("--accent", ACCENTS[s.accent] || ACCENTS.emerald);
}
function parseRoute(hash) {
  const m = /^#\/?([a-z-]*)(?:\?(.*))?$/.exec(hash || "");
  return { id: m?.[1] || "", params: Object.fromEntries(new URLSearchParams(m?.[2] || "")) };
}
async function startApp({ platform, target, mount: mount2 }) {
  let settings2 = await platform.getSettings();
  applyTheme(settings2);
  platform.onSettings((s) => {
    settings2 = s;
    applyTheme(s);
  });
  document.documentElement.dataset.target = target;
  const visible = VIEWS.filter((v) => v.needs(platform.caps) && (target !== "popup" || v.popup));
  const home = target === "popup" ? platform.caps.scan ? "scanner" : "queue" : platform.caps.queue && target !== "web" && target !== "android" ? "queue" : "library";
  const ctx = {
    platform,
    target,
    lib: Library,
    get settings() {
      return settings2;
    },
    async save(patch) {
      settings2 = await platform.setSettings(patch);
      applyTheme(settings2);
      return settings2;
    },
    toast,
    confirm: confirmDialog,
    prompt: promptDialog,
    modal,
    go(id, params = {}) {
      const q = new URLSearchParams(params).toString();
      location.hash = `#/${id}${q ? "?" + q : ""}`;
    }
  };
  const nav = h("nav", { class: "nav", "aria-label": "Sections" });
  const view = h("section", { class: "view", id: "view", tabindex: "-1" });
  const brand = h("div", { class: "brand" }, h("img", { src: new URL("./icons/icon48.png", document.baseURI).href, alt: "", width: 26, height: 26 }), h("strong", null, "DOWNOVA"));
  const head = h(
    "header",
    { class: "rail-head" },
    brand,
    target === "popup" && platform.caps.queue ? button("", { icon: "external", kind: "ghost", title: "Open the full dashboard", onClick: () => {
      platform.openDashboard();
      window.close();
    } }) : null
  );
  mount2.append(h("div", { class: "app" }, h("aside", { class: "rail" }, head, nav), h("main", { class: "main" }, view)));
  let cleanup = null, token = 0;
  async function render() {
    const { id: rid, params } = parseRoute(location.hash);
    const current = visible.find((v) => v.id === rid) || visible.find((v) => v.id === home) || visible[0];
    const mine = ++token;
    if (cleanup) {
      try {
        cleanup();
      } catch {
      }
      cleanup = null;
    }
    clear(nav).append(...visible.map((v) => h("a", { href: `#/${v.id}`, class: v.id === current.id ? "on" : "", "aria-current": v.id === current.id ? "page" : null, title: v.label }, icon(v.icon, 18), h("span", null, v.label))));
    clear(view);
    try {
      const c = await current.mount(view, ctx, params);
      if (mine !== token) {
        c?.();
        return;
      }
      cleanup = c || null;
    } catch (e) {
      view.append(h("div", { class: "empty" }, h("strong", null, "This section failed to load"), h("p", null, String(e?.message || e))));
    }
  }
  addEventListener("hashchange", render);
  await render();
  return ctx;
}
function pageScan() {
  const out = [];
  const abs = (u) => {
    try {
      return new URL(u, document.baseURI).href;
    } catch {
      return null;
    }
  };
  const push = (o) => {
    if (o.url && out.length < 4e3) out.push(o);
  };
  document.querySelectorAll("a[href]").forEach((a) => push({
    url: abs(a.getAttribute("href")),
    tag: "a",
    download: a.hasAttribute("download") ? a.getAttribute("download") || "" : null,
    mime: a.getAttribute("type") || "",
    text: (a.textContent || "").trim().slice(0, 80)
  }));
  document.querySelectorAll("img").forEach((i) => {
    const u = i.currentSrc || i.src;
    push({ url: u && abs(u), tag: "img", width: i.naturalWidth || 0, height: i.naturalHeight || 0, text: i.alt || "" });
  });
  const media = (el, tag) => {
    const u = el.currentSrc || el.getAttribute("src");
    if (u) push({ url: abs(u), tag, width: el.videoWidth || 0, height: el.videoHeight || 0 });
    el.querySelectorAll("source").forEach((s) => push({ url: abs(s.getAttribute("src") || ""), tag, mime: s.getAttribute("type") || "" }));
    if (tag === "video" && el.getAttribute("poster")) push({ url: abs(el.getAttribute("poster")), tag: "img", kind: "poster" });
  };
  document.querySelectorAll("video").forEach((v) => media(v, "video"));
  document.querySelectorAll("audio").forEach((a) => media(a, "audio"));
  return { pageUrl: location.href, title: document.title, candidates: out };
}
const send = (msg) => chrome.runtime.sendMessage(msg);
const listen = (key, cb) => {
  const fn = (changes, area) => {
    if (area === "local" && changes[key]) cb(changes[key].newValue);
  };
  chrome.storage.onChanged.addListener(fn);
  return () => chrome.storage.onChanged.removeListener(fn);
};
const SCAN_HELP = "DOWNOVA can only scan a page after you open it from the toolbar icon or its right-click menu. Chrome also blocks extensions on internal pages (chrome://, the Web Store).";
function createChromeAdapter() {
  return {
    id: "chrome",
    caps: { queue: true, scan: true, hover: true, schedule: true, contextMenus: true, nativeFiles: false },
    async getSettings() {
      return normalizeSettings((await chrome.storage.local.get("settings")).settings);
    },
    async setSettings(patch) {
      const next = mergeSettings((await chrome.storage.local.get("settings")).settings, patch);
      await chrome.storage.local.set({ settings: next });
      return next;
    },
    onSettings(cb) {
      return listen("settings", (v) => cb(normalizeSettings(v)));
    },
    async getQueue() {
      return (await chrome.storage.local.get("queue")).queue || [];
    },
    onQueue(cb) {
      return listen("queue", (v) => cb(v || []));
    },
    enqueue(items) {
      return send({ type: "dn:enqueue", items });
    },
    queueAction(action, id, value) {
      return send({ type: "dn:queue:action", action, id, value });
    },
    /** Real byte counts straight from Chrome. */
    async progress(items) {
      const out = {};
      await Promise.all(items.filter((i) => i.downloadId != null && (i.status === "active" || i.status === "paused")).map(async (i) => {
        const [d] = await chrome.downloads.search({ id: i.downloadId });
        if (d) out[i.id] = { bytes: d.bytesReceived || 0, total: d.totalBytes > 0 ? d.totalBytes : 0 };
      }));
      return out;
    },
    async getSchedule() {
      return (await chrome.storage.local.get("schedule")).schedule || [];
    },
    onSchedule(cb) {
      return listen("schedule", (v) => cb(v || []));
    },
    scheduleAdd(url, runAt, filename) {
      return send({ type: "dn:schedule:add", url, runAt, filename });
    },
    scheduleUpdate(id, runAt) {
      return send({ type: "dn:schedule:update", id, runAt });
    },
    scheduleRemove(id) {
      return send({ type: "dn:schedule:remove", id });
    },
    async scanTab(tabId) {
      if (tabId == null) {
        const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!t || String(t.url || "").startsWith("chrome-extension://")) throw new Error("Open DOWNOVA from the toolbar icon on the page you want to scan.");
        tabId = t.id;
      }
      let frames;
      try {
        frames = await chrome.scripting.executeScript({ target: { tabId: Number(tabId), allFrames: true }, func: pageScan });
      } catch {
        throw new Error(SCAN_HELP);
      }
      const candidates = [];
      let pageUrl = "", title = "";
      for (const f of frames) {
        if (!f?.result) continue;
        if (!pageUrl) ({ pageUrl, title } = f.result);
        candidates.push(...f.result.candidates);
      }
      return { pageUrl, title, candidates };
    },
    probe: (url) => probeUrl(url),
    notify: (kind, title, message) => send({ type: "dn:notify", kind, title, message }).catch(() => {
    }),
    saveBlob: (blob, name) => saveBlobAsFile(blob, name),
    async shareBlob(blob, name) {
      const f = new File([blob], name, { type: blob.type });
      if (navigator.canShare?.({ files: [f] })) {
        await navigator.share({ files: [f] });
        return true;
      }
      return false;
    },
    openDashboard(route = "") {
      return chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") + (route ? "#/" + route : "") });
    },
    openUrl(url) {
      return chrome.tabs.create({ url });
    },
    hover: {
      has: () => chrome.permissions.contains({ origins: ["<all_urls>"] }),
      request: () => chrome.permissions.request({ origins: ["<all_urls>"] }),
      remove: () => chrome.permissions.remove({ origins: ["<all_urls>"] }),
      sync: () => send({ type: "dn:hover:sync" })
    },
    permissions: () => chrome.permissions.getAll(),
    async clearHistory() {
      await chrome.storage.local.set({ queue: (await this.getQueue()).filter((i) => ["queued", "active", "paused"].includes(i.status)) });
    },
    version: () => chrome.runtime.getManifest().version
  };
}
export {
  createChromeAdapter as c,
  startApp as s
};
