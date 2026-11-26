// src/core/util.js
var INVALID_FS = /[<>:"/\\|?*\u0000-\u001f]/g;
var RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
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
function uid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

// src/core/settings.js
var MENU_ACTIONS = [
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
var DEFAULT_SETTINGS = {
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
  notifications: { started: false, completed: true, failed: true, conversion: true, scheduled: true, extraction: true },
  player: { rate: 1, volume: 1, repeat: "off", shuffle: false },
  library: { view: "grid", sort: "added" }
};
var THEMES = ["dark", "light", "system"];
var ACCENTS = { emerald: "#2ee59d", cyan: "#35d0e6", amber: "#f5b83d", violet: "#a98bff" };
var IMAGE_FORMATS = ["png", "jpeg", "jpg", "webp"];
var bool = (v, d) => typeof v === "boolean" ? v : d;
var objOf = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : {};
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

// src/core/download-queue.js
var STATUS = { QUEUED: "queued", ACTIVE: "active", PAUSED: "paused", COMPLETED: "completed", FAILED: "failed", CANCELLED: "cancelled", HANDED_OFF: "handed_off" };
var WAITING = /* @__PURE__ */ new Set([STATUS.QUEUED, STATUS.ACTIVE, STATUS.PAUSED]);
var FINISHED = /* @__PURE__ */ new Set([STATUS.COMPLETED, STATUS.FAILED, STATUS.CANCELLED, STATUS.HANDED_OFF]);
var PRIORITY_RANK = { high: 0, normal: 1, low: 2 };
var ERRORS = {
  NETWORK_FAILED: "The network request failed.",
  NETWORK_TIMEOUT: "The server took too long to respond.",
  NETWORK_DISCONNECTED: "You went offline during the download.",
  NETWORK_SERVER_DOWN: "The server is unreachable.",
  NETWORK_INVALID_REQUEST: "The request was rejected as invalid.",
  SERVER_FAILED: "The server reported an error.",
  SERVER_NO_RANGE: "The server does not support resuming.",
  SERVER_BAD_CONTENT: "The file was not found on the server.",
  SERVER_UNAUTHORIZED: "The server requires sign-in.",
  SERVER_CERT_PROBLEM: "The server certificate is not valid.",
  SERVER_FORBIDDEN: "The server refused access (403).",
  SERVER_UNREACHABLE: "The server could not be reached.",
  FILE_FAILED: "The file could not be written.",
  FILE_ACCESS_DENIED: "Chrome was not allowed to write the file.",
  FILE_NO_SPACE: "There is not enough disk space.",
  FILE_NAME_TOO_LONG: "The file name is too long.",
  FILE_TOO_LARGE: "The file is too large for this disk.",
  FILE_VIRUS_INFECTED: "The file was flagged as malicious.",
  FILE_BLOCKED: "Chrome blocked this file type.",
  FILE_SECURITY_CHECK_FAILED: "The security check failed.",
  FILE_TOO_SHORT: "The download ended early.",
  USER_CANCELED: "Cancelled.",
  USER_SHUTDOWN: "Chrome closed during the download.",
  CRASH: "Chrome closed unexpectedly."
};
var friendlyError = (code) => ERRORS[code] || (code ? `Download interrupted (${code}).` : "Download interrupted.");
function createItem({ url, filename = "", source = "manual", priority = "normal", pageUrl = "", now = Date.now() }) {
  return {
    id: uid(),
    url,
    filename: filename || "",
    name: filename || fileNameFromUrl(url, "download"),
    source,
    pageUrl,
    priority: PRIORITY_RANK[priority] != null ? priority : "normal",
    status: STATUS.QUEUED,
    addedAt: now,
    downloadId: null,
    attempts: 0,
    error: null,
    fileSize: null,
    path: "",
    mime: "",
    finishedAt: null
  };
}
function isDuplicateWaiting(items, url) {
  return items.some((i) => WAITING.has(i.status) && i.url === url);
}
function sortWaiting(items) {
  return items.filter((i) => i.status === STATUS.QUEUED).sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.addedAt - b.addedAt);
}
function pickNext(items, maxActive) {
  const active = items.filter((i) => i.status === STATUS.ACTIVE).length;
  return sortWaiting(items).slice(0, Math.max(0, maxActive - active));
}
function applyDelta(item, d, now = Date.now()) {
  const n = { ...item };
  if (d.paused && "current" in d.paused) {
    if (d.paused.current && n.status === STATUS.ACTIVE) n.status = STATUS.PAUSED;
    else if (!d.paused.current && n.status === STATUS.PAUSED) n.status = STATUS.ACTIVE;
  }
  if (d.state?.current === "complete") {
    n.status = STATUS.COMPLETED;
    n.error = null;
    n.finishedAt = now;
  } else if (d.state?.current === "interrupted") {
    const code = d.error?.current || n.pendingError;
    n.status = code === "USER_CANCELED" ? STATUS.CANCELLED : STATUS.FAILED;
    n.error = code === "USER_CANCELED" ? null : friendlyError(code);
    n.finishedAt = now;
  }
  return n;
}
function setPriority(items, id, priority) {
  if (PRIORITY_RANK[priority] == null) return items;
  return items.map((i) => i.id === id && i.status === STATUS.QUEUED ? { ...i, priority } : i);
}
function retryItem(item) {
  if (item.noRetry || item.status !== STATUS.FAILED && item.status !== STATUS.CANCELLED) return item;
  return { ...item, status: STATUS.QUEUED, error: null, downloadId: null, finishedAt: null, attempts: item.attempts + 1, addedAt: Date.now() };
}
function trimHistory(items, max = 500) {
  const waiting = items.filter((i) => WAITING.has(i.status));
  const done = items.filter((i) => !WAITING.has(i.status)).sort((a, b) => (b.finishedAt || b.addedAt) - (a.finishedAt || a.addedAt)).slice(0, max);
  return [...waiting, ...done].sort((a, b) => b.addedAt - a.addedAt);
}

// src/extension/store.js
var tail = Promise.resolve();
function lock(fn) {
  const run = tail.then(() => fn());
  tail = run.catch(() => {
  });
  return run;
}
async function getSettings() {
  return normalizeSettings((await chrome.storage.local.get("settings")).settings);
}
function withQueue(fn) {
  return lock(async () => {
    const state = { items: (await chrome.storage.local.get("queue")).queue || [] };
    const result = await fn(state);
    await chrome.storage.local.set({ queue: trimHistory(state.items) });
    return result;
  });
}
function withSchedule(fn) {
  return lock(async () => {
    const state = { items: (await chrome.storage.local.get("schedule")).schedule || [] };
    const result = await fn(state);
    await chrome.storage.local.set({ schedule: state.items.sort((a, b) => a.runAt - b.runAt) });
    return result;
  });
}

// src/core/file-types.js
var T = {};
var add = (category, list) => {
  for (const [ext, mime] of list) T[ext] = { mime, category };
};
add("image", [["png", "image/png"], ["jpg", "image/jpeg"], ["jpeg", "image/jpeg"], ["gif", "image/gif"], ["svg", "image/svg+xml"], ["webp", "image/webp"], ["bmp", "image/bmp"], ["ico", "image/x-icon"], ["tif", "image/tiff"], ["tiff", "image/tiff"], ["avif", "image/avif"]]);
add("audio", [["mp3", "audio/mpeg"], ["wav", "audio/wav"], ["ogg", "audio/ogg"], ["oga", "audio/ogg"], ["m4a", "audio/mp4"], ["aac", "audio/aac"], ["flac", "audio/flac"], ["opus", "audio/opus"]]);
add("video", [["mp4", "video/mp4"], ["m4v", "video/mp4"], ["webm", "video/webm"], ["mov", "video/quicktime"], ["avi", "video/x-msvideo"], ["mkv", "video/x-matroska"], ["ogv", "video/ogg"]]);
add("document", [["pdf", "application/pdf"], ["doc", "application/msword"], ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], ["xls", "application/vnd.ms-excel"], ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], ["ppt", "application/vnd.ms-powerpoint"], ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"], ["csv", "text/csv"], ["txt", "text/plain"], ["rtf", "application/rtf"], ["odt", "application/vnd.oasis.opendocument.text"], ["ods", "application/vnd.oasis.opendocument.spreadsheet"], ["odp", "application/vnd.oasis.opendocument.presentation"], ["md", "text/markdown"], ["json", "application/json"], ["xml", "application/xml"]]);
add("archive", [["zip", "application/zip"], ["rar", "application/vnd.rar"], ["7z", "application/x-7z-compressed"], ["tar", "application/x-tar"], ["gz", "application/gzip"], ["tgz", "application/gzip"], ["bz2", "application/x-bzip2"], ["xz", "application/x-xz"]]);
var CATEGORY_LABELS = { image: "Images", video: "Videos", audio: "Audio", document: "Documents", archive: "Archives", other: "Other files" };
var STREAM_EXT = /* @__PURE__ */ new Set(["m3u8", "mpd", "ism", "f4m"]);
var STREAM_MIME = /mpegurl|dash\+xml|vnd\.ms-sstr/i;
var GENERIC_MIME = /^(application\/octet-stream|binary\/octet-stream|application\/force-download|text\/html|application\/xhtml\+xml)$/i;
var MIME_TO_EXT = {};
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
var extForMime = (mime) => MIME_TO_EXT[cleanMime(mime)] || "";
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

// src/core/media-detector.js
var ELIGIBLE = /* @__PURE__ */ new Set(["downloadable", "unknown"]);
var isEligible = (item) => ELIGIBLE.has(item.status);
var SKIP_SCHEMES = /* @__PURE__ */ new Set(["javascript:", "mailto:", "tel:", "about:", "chrome:", "chrome-extension:", "file:", "ftp:", "sms:"]);
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
    let status = "downloadable", reason = "";
    if (u.protocol === "blob:") {
      status = "restricted";
      reason = "Blob URL: it only exists inside the page that created it and cannot be fetched from outside.";
    } else if (isStreamingManifest(u.href, c.mime)) {
      status = "unsupported";
      reason = "Streaming manifest. DOWNOVA does not reconstruct segmented or protected streams.";
    } else if (c.kind === "poster") {
      status = "preview-only";
      reason = "Poster frame for a video, not the video itself.";
    } else if (u.protocol !== "http:" && u.protocol !== "https:" && u.protocol !== "data:") {
      status = "unsupported";
      reason = `${u.protocol} resources cannot be downloaded.`;
    } else if (!cls.known) {
      status = "unknown";
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
      status,
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
    if (existing.status === "preview-only" && status !== "preview-only") Object.assign(existing, { status, reason });
    if (!existing.width && item.width) {
      existing.width = item.width;
      existing.height = item.height;
    }
    if (rank(item.confidence) > rank(existing.confidence)) Object.assign(existing, { category: item.category, ext: item.ext, mime: item.mime, confidence: item.confidence, signals: item.signals });
  }
  return [...map.values()];
}
var rank = (c) => ({ low: 0, medium: 1, high: 2 })[c] ?? 0;
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

// src/core/image-converter.js
var ConversionError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
var OUTPUTS = {
  png: { mime: "image/png", ext: "png", lossy: false, alpha: true },
  jpeg: { mime: "image/jpeg", ext: "jpeg", lossy: true, alpha: false },
  jpg: { mime: "image/jpeg", ext: "jpg", lossy: true, alpha: false },
  webp: { mime: "image/webp", ext: "webp", lossy: true, alpha: true }
};
function browserEnv() {
  return {
    decode: (blob) => createImageBitmap(blob),
    createCanvas: (w, h) => new OffscreenCanvas(w, h),
    sanitizeSvg: null
  };
}
function targetSize(w, h, maxWidth = 0, maxHeight = 0) {
  let scale = 1;
  if (maxWidth > 0 && w > maxWidth) scale = Math.min(scale, maxWidth / w);
  if (maxHeight > 0 && h > maxHeight) scale = Math.min(scale, maxHeight / h);
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
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
  if (width !== sw || height !== sh) notes.push(`Resized from ${sw}\xD7${sh} to ${width}\xD7${height}.`);
  if (head?.ext === "gif") notes.push("Animated GIFs convert to a single still frame.");
  return { blob: new Blob([result], { type: out.mime }), mime: out.mime, ext: out.ext, width, height, notes };
}
function convertedName(srcNameOrUrl, ext) {
  const base = splitName(sanitizeFilename(srcNameOrUrl.includes("/") || srcNameOrUrl.includes(":") ? fileNameFromUrl(srcNameOrUrl, "image") : srcNameOrUrl, "image")).base || "image";
  return `${base}.${ext}`;
}

// src/core/svg.js
function inspectSvg(text) {
  const t = String(text || "").slice(0, 5e6);
  const head = t.slice(0, 600).replace(/^\uFEFF/, "").trimStart();
  const isSvg = /<svg[\s>]/i.test(t) && !/^<!doctype html|^<html/i.test(head);
  const risks = [];
  if (/<script[\s>]/i.test(t)) risks.push("contains a <script> element");
  if (/[\s"'/]on[a-z]+\s*=/i.test(t)) risks.push("contains event-handler attributes");
  if (/<foreignObject[\s>]/i.test(t)) risks.push("contains <foreignObject> (embedded HTML)");
  if (/javascript\s*:/i.test(t)) risks.push("contains a javascript: URL");
  if (/<!ENTITY/i.test(t)) risks.push("declares XML entities");
  if (/(?:href|src)\s*=\s*["']\s*(?:https?:)?\/\//i.test(t) || /url\(\s*["']?\s*(?:https?:)?\/\//i.test(t) || /@import/i.test(t)) risks.push("references external resources");
  return { isSvg, risks, safe: isSvg && risks.length === 0 };
}

// src/extension/page-scan.js
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

// src/extension/actions.js
var basename = (p) => String(p || "").split(/[\\/]/).pop() || "";
var blobToDataUrl = (blob) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = () => rej(r.error);
  r.readAsDataURL(blob);
});
async function notify(kind, title, message) {
  const s = await getSettings();
  if (kind && !s.notifications[kind]) return;
  return toast(title, message);
}
async function toast(title, message) {
  try {
    await chrome.notifications.create({ type: "basic", iconUrl: chrome.runtime.getURL("icons/icon128.png"), title: String(title).slice(0, 80), message: String(message || "").slice(0, 220) });
  } catch {
  }
}
async function openDashboard(route = "") {
  await chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") + (route ? "#/" + route : "") });
}
var DATA_URL_LIMIT = 19e5;
var offscreenReady = null;
async function ensureOffscreen() {
  if (!chrome.offscreen) throw new Error("Large files need the offscreen API, which this Chrome does not provide.");
  offscreenReady = offscreenReady || (async () => {
    const open = chrome.runtime.getContexts ? await chrome.runtime.getContexts({ contextTypes: ["OFFSCREEN_DOCUMENT"] }) : [];
    if (!open.length) await chrome.offscreen.createDocument({ url: "offscreen.html", reasons: ["BLOBS"], justification: "Create blob URLs so large converted images can be downloaded." });
  })().finally(() => {
    offscreenReady = null;
  });
  return offscreenReady;
}
async function downloadUrlFor(blob) {
  const dataUrl = await blobToDataUrl(blob);
  if (dataUrl.length <= DATA_URL_LIMIT) return { url: dataUrl };
  await ensureOffscreen();
  const res = await chrome.runtime.sendMessage({ target: "offscreen", type: "make", dataUrl });
  if (!res?.ok) throw new Error(res?.error || "Could not prepare the large file.");
  return { url: res.url, blobUrl: res.url };
}
async function revokeBlobUrl(url) {
  try {
    await chrome.runtime.sendMessage({ target: "offscreen", type: "revoke", url });
  } catch {
  }
}
async function pump(state, settings) {
  for (const it of pickNext(state.items, settings.concurrency)) {
    const idx = state.items.findIndex((x) => x.id === it.id);
    try {
      const v = validateDownloadUrl(it.url, { allowData: true });
      if (!v.ok) throw new Error(v.error);
      const opts = { url: v.url, conflictAction: "uniquify", saveAs: settings.askWhereToSave };
      if (it.filename) opts.filename = sanitizeFilename(it.filename);
      const downloadId = await chrome.downloads.download(opts);
      state.items[idx] = { ...it, status: STATUS.ACTIVE, downloadId, error: null };
      if (settings.notifications.started) notify("started", "Download started", it.name);
    } catch (e) {
      const msg = String(e?.message || e);
      state.items[idx] = { ...it, status: /cancel/i.test(msg) ? STATUS.CANCELLED : STATUS.FAILED, error: /cancel/i.test(msg) ? null : msg, finishedAt: Date.now() };
    }
  }
}
async function enqueue(entries, { source = "manual" } = {}) {
  const settings = await getSettings();
  const result = { added: 0, duplicates: 0, rejected: [] };
  await withQueue(async (st) => {
    for (const e of entries || []) {
      const v = validateDownloadUrl(e?.url);
      if (!v.ok) {
        result.rejected.push({ url: String(e?.url || "").slice(0, 200), error: v.error });
        continue;
      }
      if (isDuplicateWaiting(st.items, v.url)) {
        result.duplicates++;
        continue;
      }
      const item = createItem({ url: v.url, filename: e.filename ? sanitizeFilename(e.filename) : "", source: e.source || source, priority: e.priority, pageUrl: e.pageUrl || "" });
      item.category = classify({ url: v.url }).category;
      st.items.unshift(item);
      result.added++;
    }
    await pump(st, settings);
  });
  return result;
}
async function trackDirect({ displayUrl, blob, filename, source, category }) {
  const settings = await getSettings();
  let target;
  try {
    target = await downloadUrlFor(blob);
  } catch (e) {
    toast("Could not save the file", String(e?.message || e));
    return { ok: false, error: String(e?.message || e) };
  }
  return withQueue(async (st) => {
    const item = { ...createItem({ url: displayUrl.length > 300 ? displayUrl.slice(0, 80) + "\u2026" : displayUrl, filename, source }), noRetry: true, category, blobUrl: target.blobUrl || null };
    try {
      const downloadId = await chrome.downloads.download({ url: target.url, filename: sanitizeFilename(filename), conflictAction: "uniquify", saveAs: settings.askWhereToSave });
      st.items.unshift({ ...item, status: STATUS.ACTIVE, downloadId });
      return { ok: true };
    } catch (e) {
      const msg = String(e?.message || e);
      if (target.blobUrl) revokeBlobUrl(target.blobUrl);
      st.items.unshift({ ...item, blobUrl: null, status: /cancel/i.test(msg) ? STATUS.CANCELLED : STATUS.FAILED, error: msg, finishedAt: Date.now() });
      return { ok: false, error: msg };
    }
  });
}
async function handleDownloadChange(delta) {
  const settings = await getSettings();
  await withQueue(async (st) => {
    const i = st.items.findIndex((x) => x.downloadId === delta.id);
    if (i < 0) return;
    const before = st.items[i];
    let after = applyDelta(before, delta);
    if (after.status === STATUS.COMPLETED && before.status !== STATUS.COMPLETED) {
      const [dl] = await chrome.downloads.search({ id: delta.id });
      if (dl) {
        after = { ...after, fileSize: dl.fileSize > 0 ? dl.fileSize : dl.totalBytes > 0 ? dl.totalBytes : null, path: dl.filename || "", mime: dl.mime || "", name: basename(dl.filename) || after.name, category: classify({ url: after.url, mime: dl.mime }).category === "other" ? after.category || "other" : classify({ url: after.url, mime: dl.mime }).category };
      }
    }
    if (after.blobUrl && FINISHED.has(after.status)) {
      revokeBlobUrl(after.blobUrl);
      after = { ...after, blobUrl: null };
    }
    st.items[i] = after;
    if (after.status !== before.status) {
      if (after.status === STATUS.COMPLETED) notify("completed", "Download complete", after.name);
      else if (after.status === STATUS.FAILED) notify("failed", "Download failed", `${after.name}: ${after.error}`);
    }
    if (!settings.keepHistory && FINISHED.has(after.status)) st.items.splice(i, 1);
    await pump(st, settings);
  });
}
async function reconcile() {
  const settings = await getSettings();
  await withQueue(async (st) => {
    for (let i = 0; i < st.items.length; i++) {
      const it = st.items[i];
      if (it.status !== STATUS.ACTIVE && it.status !== STATUS.PAUSED || it.downloadId == null) continue;
      const [dl] = await chrome.downloads.search({ id: it.downloadId });
      if (!dl) {
        st.items[i] = { ...it, status: STATUS.FAILED, error: "The browser no longer has this download.", finishedAt: Date.now() };
        continue;
      }
      if (dl.state === "complete") st.items[i] = { ...it, status: STATUS.COMPLETED, finishedAt: Date.now(), fileSize: dl.fileSize > 0 ? dl.fileSize : null, path: dl.filename || "", mime: dl.mime || "" };
      else if (dl.state === "interrupted") st.items[i] = applyDelta(it, { state: { current: "interrupted" }, error: { current: dl.error } });
      else st.items[i] = { ...it, status: dl.paused ? STATUS.PAUSED : STATUS.ACTIVE };
    }
    await pump(st, settings);
  });
}
async function queueAction(action, id, value) {
  const settings = await getSettings();
  return withQueue(async (st) => {
    const i = st.items.findIndex((x) => x.id === id);
    const it = st.items[i];
    switch (action) {
      case "clear-finished":
        st.items = st.items.filter((x) => WAITING.has(x.status));
        return { ok: true };
      case "priority":
        st.items = setPriority(st.items, id, value);
        break;
      case "retry":
        if (it) st.items[i] = retryItem(it);
        break;
      case "pause":
        if (it?.downloadId != null) await chrome.downloads.pause(it.downloadId).catch(() => {
        });
        break;
      case "resume":
        if (it?.downloadId != null) await chrome.downloads.resume(it.downloadId).catch(() => {
        });
        break;
      case "show":
        if (it?.downloadId != null) chrome.downloads.show(it.downloadId);
        return { ok: true };
      case "cancel":
        if (!it) break;
        if (it.status === STATUS.QUEUED) st.items[i] = { ...it, status: STATUS.CANCELLED, finishedAt: Date.now() };
        else if (it.downloadId != null) await chrome.downloads.cancel(it.downloadId).catch(() => {
        });
        break;
      case "remove":
        if (!it) break;
        if (it.downloadId != null && (it.status === STATUS.ACTIVE || it.status === STATUS.PAUSED)) await chrome.downloads.cancel(it.downloadId).catch(() => {
        });
        st.items.splice(i, 1);
        break;
      default:
        return { ok: false, error: "Unknown action." };
    }
    await pump(st, settings);
    return { ok: true };
  });
}
async function scheduleAdd({ url, runAt, filename = "" }) {
  const v = validateDownloadUrl(url);
  if (!v.ok) return { ok: false, error: v.error };
  const t = Number(runAt);
  if (!Number.isFinite(t) || t < Date.now() - 1e3) return { ok: false, error: "Pick a time in the future." };
  await withSchedule(async (st) => {
    st.items.push({ id: uid(), url: v.url, filename: filename ? sanitizeFilename(filename) : "", runAt: t, createdAt: Date.now() });
  });
  return { ok: true };
}
async function scheduleUpdate(id, runAt) {
  const t = Number(runAt);
  if (!Number.isFinite(t) || t < Date.now() - 1e3) return { ok: false, error: "Pick a time in the future." };
  await withSchedule(async (st) => {
    const s = st.items.find((x) => x.id === id);
    if (s) s.runAt = t;
  });
  return { ok: true };
}
async function scheduleRemove(id) {
  await withSchedule(async (st) => {
    st.items = st.items.filter((x) => x.id !== id);
  });
  return { ok: true };
}
async function tickSchedule() {
  const due = await withSchedule(async (st) => {
    const now = Date.now();
    const d = st.items.filter((x) => x.runAt <= now);
    st.items = st.items.filter((x) => x.runAt > now);
    return d;
  });
  if (!due.length) return;
  const r = await enqueue(due.map((d) => ({ url: d.url, filename: d.filename, priority: "high", source: "schedule" })), { source: "schedule" });
  notify("scheduled", "Scheduled download started", r.added ? `${r.added} download${r.added > 1 ? "s" : ""} added to the queue.` : "It was already in the queue or could not be added.");
}
async function scanTab(tabId) {
  const frames = await chrome.scripting.executeScript({ target: { tabId, allFrames: true }, func: pageScan });
  const candidates = [];
  let pageUrl = "", title = "";
  for (const f of frames) {
    if (!f?.result) continue;
    if (!pageUrl) ({ pageUrl, title } = f.result);
    candidates.push(...f.result.candidates);
  }
  return { pageUrl, title, candidates };
}
function describeUrl(url, tag) {
  const [it] = analyzeCandidates([{ url, tag, download: tag === "a" ? "" : null }]);
  if (!it) return { ok: false, reason: "No usable media URL." };
  return { ok: isEligible(it), item: it, reason: it.reason };
}
async function readImage(url) {
  if (url.startsWith("data:")) return (await fetch(url)).blob();
  const res = await fetch(url, { credentials: "omit", mode: "cors", cache: "force-cache" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
}
var CORS_MSG = `This image's server does not let extensions read it (cross-origin restriction), so it cannot be converted. DOWNOVA does not bypass this. "Save Original Image" still works.`;
async function convertAndSave(srcUrl, format) {
  const s = await getSettings();
  const fmt = format === "preferred" ? s.imageFormat : format;
  const v = validateDownloadUrl(srcUrl, { allowData: true });
  if (!v.ok) return toast("Cannot convert this image", v.error);
  let blob;
  try {
    blob = await readImage(v.url);
  } catch {
    return toast("Conversion unavailable", CORS_MSG);
  }
  if (blob.size > 60 * 1024 * 1024) return toast("Image too large", "Images over 60 MB are not converted in the background.");
  try {
    const r = await convertImage(blob, { format: fmt, quality: s.imageQuality, maxWidth: s.imageMaxWidth });
    const name = convertedName(v.url.startsWith("data:") ? "image" : v.url, r.ext);
    const out = await trackDirect({ displayUrl: v.url, blob: r.blob, filename: name, source: "convert", category: "image" });
    if (out.ok) notify("conversion", `Saved as ${fmt.toUpperCase()}`, `${name} \xB7 ${r.width}\xD7${r.height}${r.notes[0] ? " \xB7 " + r.notes[0] : ""}`);
    else toast("Download did not start", out.error);
  } catch (e) {
    toast("Could not convert image", e.message);
  }
}
async function saveSvg(srcUrl) {
  const v = validateDownloadUrl(srcUrl, { allowData: true });
  if (!v.ok) return toast("Cannot save this image", v.error);
  let blob;
  try {
    blob = await readImage(v.url);
  } catch {
    if (/\.svg$/i.test(new URL(v.url).pathname)) {
      const r = await enqueue([{ url: v.url, priority: "high", source: "context" }]);
      return toast("Saving original SVG", r.added ? "Saved through the download manager. It could not be inspected first (cross-origin)." : "Already in the queue.");
    }
    return toast("Not an SVG", "This image is not an SVG file, so there is no vector to preserve. Raster images are never wrapped in SVG and passed off as vectors.");
  }
  const text = await blob.text();
  const info = inspectSvg(text);
  if (!info.isSvg) return toast("Not an SVG", 'The file is not SVG. Use "Save Image As PNG/JPEG/WebP" or "Save Original Image".');
  if (info.risks.length) return toast("SVG not saved", `Blocked for safety: it ${info.risks.slice(0, 2).join(" and ")}.`);
  const name = convertedName(v.url.startsWith("data:") ? "image" : v.url, "svg");
  const out = await trackDirect({ displayUrl: v.url, blob: new Blob([text], { type: "image/svg+xml" }), filename: name, source: "convert", category: "image" });
  if (out.ok) notify("conversion", "SVG saved", `${name} (original vector, unmodified)`);
}
function copyTextInPage(text) {
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0";
    document.documentElement.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
    }
    ta.remove();
    return ok;
  };
  try {
    return navigator.clipboard.writeText(text).then(() => true, fallback);
  } catch {
    return fallback();
  }
}
async function copyImageInPage(src) {
  try {
    const blob = await (await fetch(src, { credentials: "omit" })).blob();
    const bmp = await createImageBitmap(blob);
    const c = document.createElement("canvas");
    c.width = bmp.width;
    c.height = bmp.height;
    c.getContext("2d").drawImage(bmp, 0, 0);
    const png = await new Promise((r) => c.toBlob(r, "image/png"));
    await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}
async function copyText(tab, text, label) {
  try {
    const [r] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: copyTextInPage, args: [text] });
    return r?.result ? toast(`${label} copied`, text.length > 120 ? text.slice(0, 117) + "\u2026" : text) : toast("Could not copy", "The page blocked clipboard access.");
  } catch {
    return toast("Could not copy", "Chrome did not allow copying on this page.");
  }
}
async function copyImage(tab, src) {
  try {
    const [r] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: copyImageInPage, args: [src] });
    return r?.result?.ok ? toast("Image copied", "Pasted images are PNG.") : toast("Could not copy image", 'The page or the image server blocked reading it. Try "Copy Image URL".');
  } catch {
    return toast("Could not copy image", "Chrome did not allow this on the current page.");
  }
}
async function pageSummary(tab) {
  const scan = await scanTab(tab.id);
  const items = analyzeCandidates(scan.candidates, { pageUrl: scan.pageUrl });
  return { ...scan, items, eligible: items.filter((i) => i.status === "downloadable" || i.status === "unknown") };
}
var summaryText = (items) => {
  const el = items.filter(isEligible), by = {};
  for (const i of el) by[i.category] = (by[i.category] || 0) + 1;
  const parts = Object.entries(by).map(([c, n]) => `${n} ${CATEGORY_LABELS[c].toLowerCase()}`);
  return `${el.length} downloadable${parts.length ? " (" + parts.join(", ") + ")" : ""}; ${items.length - el.length} unavailable.`;
};
async function detectLink(url) {
  const cls = classify({ url });
  const probe = await probeUrl(url);
  const type = probe.ok && probe.mime ? probe.mime.split(";")[0] : cls.mime || "unknown";
  const size = probe.ok && probe.size ? ` \xB7 ${(probe.size / 1048576).toFixed(1)} MB` : "";
  return toast(`Detected: ${cls.known || probe.ok && probe.mime ? cls.category === "other" ? "file" : cls.category : "unknown type"}`, `${type}${size}${probe.ok ? "" : " \xB7 headers not readable (cross-origin)"}`);
}

// src/extension/context-menu.js
var LABELS = Object.fromEntries(MENU_ACTIONS);
var GROUPS = [
  { id: "image", contexts: ["image"], actions: ["saveImage", "savePreferred", "savePng", "saveJpeg", "saveJpg", "saveWebp", "saveOriginal", "saveSvg", "copyImageUrl", "copyImage", "imageInfo", "openImage", "pageScan"] },
  { id: "link", contexts: ["link"], actions: ["linkDownload", "linkQueue", "linkCopy", "linkOpen", "linkDetect", "linkInfo"] },
  { id: "video", contexts: ["video"], actions: ["videoDownload", "videoQueue", "videoInfo", "videoCopy", "pageScan"] },
  { id: "audio", contexts: ["audio"], actions: ["audioDownload", "audioQueue", "audioInfo", "audioCopy"] },
  { id: "page", contexts: ["page"], actions: ["pageScan", "pageDownloadAll", "pageDashboard", "pageCount"] },
  { id: "selection", contexts: ["selection"], actions: ["selectionDetect"] }
];
var create = (props) => new Promise((resolve) => chrome.contextMenus.create(props, () => {
  void chrome.runtime.lastError;
  resolve();
}));
function registerMenus() {
  return lock(async () => {
    const s = await getSettings();
    await chrome.contextMenus.removeAll();
    for (const g of GROUPS) {
      const on = g.actions.filter((a) => s.menu[a]);
      if (!on.length) continue;
      const root = `dn-root-${g.id}`;
      await create({ id: root, title: "DOWNOVA", contexts: g.contexts });
      for (const a of on) {
        const title = a === "savePreferred" ? `Save Image As Preferred Format (${s.imageFormat.toUpperCase()})` : LABELS[a];
        await create({ id: `dn:${g.id}:${a}`, parentId: root, title, contexts: g.contexts });
      }
    }
  });
}
var FORMAT_FOR = { savePng: "png", saveJpeg: "jpeg", saveJpg: "jpg", saveWebp: "webp", savePreferred: "preferred" };
var mediaTag = { video: "video", audio: "audio" };
async function mediaUrlOrExplain(info, kind) {
  const url = info.srcUrl;
  if (!url) {
    await toast("No direct source", `This ${kind} does not expose a direct file URL, so DOWNOVA cannot download it.`);
    return null;
  }
  const d = describeUrl(url, mediaTag[kind] || "a");
  if (!d.ok) {
    await toast("Cannot download this " + kind, d.reason || "Not directly downloadable.");
    return null;
  }
  return d.item.url;
}
async function handleMenuClick(info, tab) {
  const id = String(info.menuItemId || "");
  if (!id.startsWith("dn:")) return;
  const [, group, action] = id.split(":");
  const dash = (route, url) => openDashboard(`${route}?url=${encodeURIComponent(url)}`);
  const queued = async (url, priority, label) => {
    const r = await enqueue([{ url, priority, source: "context", pageUrl: tab?.url || "" }], { source: "context" });
    if (r.rejected.length) return toast("Cannot download", r.rejected[0].error);
    if (r.duplicates) return toast("Already queued", "This file is already waiting or downloading.");
    return toast(label, "Added to the DOWNOVA queue.");
  };
  switch (action) {
    // images
    case "saveImage":
    case "saveOriginal":
      return queued(info.srcUrl, "high", "Saving original image");
    case "savePng":
    case "saveJpeg":
    case "saveJpg":
    case "saveWebp":
    case "savePreferred":
      return convertAndSave(info.srcUrl, FORMAT_FOR[action]);
    case "saveSvg":
      return saveSvg(info.srcUrl);
    case "copyImageUrl":
      return copyText(tab, info.srcUrl, "Image URL");
    case "copyImage":
      return copyImage(tab, info.srcUrl);
    case "imageInfo":
    case "openImage":
      return dash("link", info.srcUrl);
    // links
    case "linkDownload":
      return queued(info.linkUrl, "high", "Downloading link");
    case "linkQueue":
      return queued(info.linkUrl, "normal", "Link queued");
    case "linkCopy":
      return copyText(tab, info.linkUrl, "Link");
    case "linkOpen":
    case "linkInfo":
      return dash("link", info.linkUrl);
    case "linkDetect":
      return detectLink(info.linkUrl);
    // video / audio
    case "videoDownload":
    case "audioDownload": {
      const u = await mediaUrlOrExplain(info, group);
      return u && queued(u, "high", `Downloading ${group}`);
    }
    case "videoQueue":
    case "audioQueue": {
      const u = await mediaUrlOrExplain(info, group);
      return u && queued(u, "normal", `${group} queued`);
    }
    case "videoInfo":
    case "audioInfo":
      return info.srcUrl ? dash("link", info.srcUrl) : toast("No direct source", `This ${group} does not expose a direct file URL.`);
    case "videoCopy":
    case "audioCopy":
      return info.srcUrl ? copyText(tab, info.srcUrl, "Media URL") : toast("No direct source", `This ${group} does not expose a direct file URL.`);
    // page
    case "pageScan":
      return openDashboard(`scanner?tabId=${tab.id}`);
    case "pageDashboard":
      return openDashboard();
    case "pageCount": {
      try {
        const r = await pageSummary(tab);
        return toast("Detected on this page", summaryText(r.items));
      } catch {
        return toast("Cannot scan this page", "Chrome does not allow extensions to read this page.");
      }
    }
    case "pageDownloadAll": {
      try {
        const r = await pageSummary(tab);
        const pick = r.items.filter((i) => i.status === "downloadable" && !(i.category === "image" && i.width && i.height && Math.max(i.width, i.height) < 32) && !i.url.startsWith("data:")).slice(0, 50);
        if (!pick.length) return toast("Nothing to download", "No directly downloadable files were found on this page.");
        const q = await enqueue(pick.map((i) => ({ url: i.url, source: "page", pageUrl: r.pageUrl })), { source: "page" });
        return toast("Queued from this page", `${q.added} added${q.duplicates ? `, ${q.duplicates} already queued` : ""}${pick.length === 50 ? " (limit 50 per run)" : ""}. Tiny images are skipped.`);
      } catch {
        return toast("Cannot scan this page", "Chrome does not allow extensions to read this page.");
      }
    }
    // selection
    case "selectionDetect": {
      const m = /https?:\/\/[^\s<>"')]+/i.exec(info.selectionText || "");
      if (!m) return toast("No link found", "The selected text does not contain an http(s) link.");
      return dash("link", m[0]);
    }
    default:
      return void 0;
  }
}

// src/extension/background.js
var HOVER_ID = "dn-hover";
var menuTimer;
var rebuildMenus = () => {
  clearTimeout(menuTimer);
  menuTimer = setTimeout(() => registerMenus().catch(() => {
  }), 150);
};
async function syncHover() {
  const s = await getSettings();
  const granted = await chrome.permissions.contains({ origins: ["<all_urls>"] });
  const regs = await chrome.scripting.getRegisteredContentScripts({ ids: [HOVER_ID] });
  if (s.hoverEnabled && granted) {
    if (!regs.length) await chrome.scripting.registerContentScripts([{ id: HOVER_ID, matches: ["<all_urls>"], js: ["content.js"], runAt: "document_idle", allFrames: true, persistAcrossSessions: true }]);
  } else if (regs.length) await chrome.scripting.unregisterContentScripts({ ids: [HOVER_ID] });
}
async function boot() {
  await Promise.allSettled([registerMenus(), syncHover(), reconcile(), tickSchedule()]);
  await chrome.alarms.create("dn-tick", { periodInMinutes: 1 });
}
chrome.runtime.onInstalled.addListener(() => {
  boot();
});
chrome.runtime.onStartup.addListener(() => {
  boot();
});
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === "dn-tick") tickSchedule();
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  handleMenuClick(info, tab).catch((e) => toast("DOWNOVA hit an error", String(e?.message || e)));
});
chrome.downloads.onChanged.addListener((delta) => {
  handleDownloadChange(delta).catch(() => {
  });
});
chrome.permissions.onRemoved.addListener(() => {
  syncHover().catch(() => {
  });
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.settings) return;
  const a = changes.settings.oldValue || {}, b = changes.settings.newValue || {};
  if (JSON.stringify([a.menu, a.imageFormat]) !== JSON.stringify([b.menu, b.imageFormat])) rebuildMenus();
  if (a.hoverEnabled !== b.hoverEnabled) syncHover().catch(() => {
  });
});
var FROM_CONTENT = /* @__PURE__ */ new Set(["dn:hover:download"]);
var isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
async function handle(msg, { fromContent, sender }) {
  if (!isObj(msg) || typeof msg.type !== "string") return { ok: false, error: "Malformed message." };
  if (fromContent && !FROM_CONTENT.has(msg.type)) return { ok: false, error: "Not allowed from a web page." };
  switch (msg.type) {
    case "dn:hover:download": {
      if ((await getSettings()).hoverEnabled !== true) return { ok: false, error: "Hover download is turned off." };
      const v = validateDownloadUrl(msg.url);
      if (!v.ok) return { ok: false, error: v.error };
      const [it] = analyzeCandidates([{ url: v.url, tag: "video" }]);
      if (!it || it.status === "unsupported" || it.status === "restricted") return { ok: false, error: it?.reason || "Not a direct file." };
      const r = await enqueue([{ url: v.url, priority: "high", source: "hover", pageUrl: sender?.tab?.url || "" }], { source: "hover" });
      if (r.rejected.length) return { ok: false, error: r.rejected[0].error };
      return { ok: true, duplicate: r.duplicates > 0 };
    }
    case "dn:enqueue": {
      if (!Array.isArray(msg.items) || msg.items.length > 500) return { ok: false, error: "Invalid item list." };
      return { ok: true, ...await enqueue(msg.items.map((i) => ({ url: i?.url, filename: typeof i?.filename === "string" ? i.filename : "", priority: i?.priority, source: "manual", pageUrl: "" })), { source: "manual" }) };
    }
    case "dn:queue:action":
      return queueAction(String(msg.action), String(msg.id || ""), msg.value);
    case "dn:schedule:add":
      return scheduleAdd(msg);
    case "dn:schedule:update":
      return scheduleUpdate(String(msg.id), msg.runAt);
    case "dn:schedule:remove":
      return scheduleRemove(String(msg.id));
    case "dn:hover:sync":
      await syncHover();
      return { ok: true };
    case "dn:notify":
      await notify(typeof msg.kind === "string" ? msg.kind : null, String(msg.title || "DOWNOVA"), String(msg.message || ""));
      return { ok: true };
    default:
      return { ok: false, error: "Unknown message type." };
  }
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return false;
  const fromContent = Boolean(sender.tab) && !String(sender.url || "").startsWith(chrome.runtime.getURL(""));
  handle(msg, { fromContent, sender }).then(sendResponse, (e) => sendResponse({ ok: false, error: String(e?.message || e) }));
  return true;
});
