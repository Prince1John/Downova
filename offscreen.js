(() => {
  // src/extension/offscreen.js
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (sender.id !== chrome.runtime.id || !msg || msg.target !== "offscreen") return false;
    if (msg.type === "make" && typeof msg.dataUrl === "string" && msg.dataUrl.startsWith("data:")) {
      fetch(msg.dataUrl).then((r) => r.blob()).then((b) => sendResponse({ ok: true, url: URL.createObjectURL(b) })).catch((e) => sendResponse({ ok: false, error: String(e) }));
      return true;
    }
    if (msg.type === "revoke" && typeof msg.url === "string") {
      URL.revokeObjectURL(msg.url);
      sendResponse({ ok: true });
      return false;
    }
    return false;
  });
})();
