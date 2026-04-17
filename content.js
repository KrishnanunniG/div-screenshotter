(function () {
  let active = false;
  let highlighted = null;
  let overlay = null;
  let tooltip = null;

  function createOverlay() {
    overlay = document.createElement("div");
    overlay.id = "__esshot-overlay";
    document.body.appendChild(overlay);

    tooltip = document.createElement("div");
    tooltip.id = "__esshot-tooltip";
    tooltip.textContent = "Click to screenshot · Esc to cancel";
    document.body.appendChild(tooltip);
  }

  function removeOverlay() {
    overlay?.remove();
    tooltip?.remove();
    overlay = null;
    tooltip = null;
  }

  function highlightElement(el) {
    if (!el || el.id === "__esshot-overlay" || el.id === "__esshot-tooltip") return;
    highlighted = el;
    const r = el.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    overlay.style.left = r.left + scrollX + "px";
    overlay.style.top = r.top + scrollY + "px";
    overlay.style.width = r.width + "px";
    overlay.style.height = r.height + "px";
    overlay.style.display = "block";

    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : "";
    const cls = el.classList.length ? `.${[...el.classList].slice(0, 2).join(".")}` : "";
    const dim = `${Math.round(r.width)}×${Math.round(r.height)}`;
    tooltip.textContent = `${tag}${id}${cls} · ${dim}px · Click to capture · Esc to cancel`;
  }

  function onMouseMove(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    highlightElement(el);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") deactivate();
  }

  async function onClickCapture(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!highlighted) return;

    const el = highlighted;
    const rect = el.getBoundingClientRect();

    deactivate();

    await new Promise((r) => setTimeout(r, 120));

    chrome.runtime.sendMessage({ action: "captureTab" }, async ({ dataUrl }) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const dpr = window.devicePixelRatio || 1;
        const canvas = document.createElement("canvas");
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          rect.left * dpr,
          rect.top * dpr,
          rect.width * dpr,
          rect.height * dpr,
          0,
          0,
          rect.width * dpr,
          rect.height * dpr
        );
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
          a.download = `screenshot-${timestamp}.png`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
          showFlash(rect);
        }, "image/png");
      };
    });
  }

  function showFlash(rect) {
    const flash = document.createElement("div");
    flash.className = "__esshot-flash";
    flash.style.left = rect.left + window.scrollX + "px";
    flash.style.top = rect.top + window.scrollY + "px";
    flash.style.width = rect.width + "px";
    flash.style.height = rect.height + "px";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
  }

  function activate() {
    if (active) return;
    active = true;
    createOverlay();
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("click", onClickCapture, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.body.style.cursor = "crosshair";
  }

  function deactivate() {
    if (!active) return;
    active = false;
    removeOverlay();
    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("click", onClickCapture, true);
    document.removeEventListener("keydown", onKeyDown, true);
    document.body.style.cursor = "";
    highlighted = null;
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "toggle") active ? deactivate() : activate();
    if (msg.action === "activate") activate();
  });
})();
