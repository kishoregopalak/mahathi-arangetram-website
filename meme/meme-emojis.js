/**
 * Optional emoji overlays for meme mode.
 * Loaded by meme.js only when MEME_EMOJIS_ENABLED is true.
 */
(() => {
  const PARTY_EMOJIS = ["🎉", "🎊", "🥳", "🎂", "✨", "🪩", "🎈", "💃", "🕺", "🎵", "🎶", "🌟", "💖", "🍰", "🧁"];

  const STICKER_CORNERS = [
    { x: [4, 14], y: [4, 14] },
    { x: [86, 96], y: [4, 14] },
    { x: [4, 14], y: [86, 96] },
    { x: [86, 96], y: [86, 96] },
  ];

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const pickCornerPosition = (corner) => ({
    x: corner.x[0] + Math.random() * (corner.x[1] - corner.x[0]),
    y: corner.y[0] + Math.random() * (corner.y[1] - corner.y[0]),
  });

  const addStickers = (root) => {
    const targets = [
      ...root.querySelectorAll("#about .card .portrait"),
      ...root.querySelectorAll(".program-image-wrap"),
    ];

    targets.forEach((target) => {
      if (target.querySelector(".meme-sticker-layer")) return;

      const layer = document.createElement("div");
      layer.className = "meme-sticker-layer";
      layer.setAttribute("aria-hidden", "true");

      for (let i = 0; i < 6; i += 1) {
        const corner = STICKER_CORNERS[i % STICKER_CORNERS.length];
        const position = pickCornerPosition(corner);
        const sticker = document.createElement("span");
        sticker.className = "meme-sticker";
        sticker.textContent = PARTY_EMOJIS[Math.floor(Math.random() * PARTY_EMOJIS.length)];
        sticker.style.setProperty("--x", `${position.x}%`);
        sticker.style.setProperty("--y", `${position.y}%`);
        sticker.style.setProperty("--r", `${-22 + Math.random() * 44}deg`);
        sticker.style.setProperty("--s", `${0.8 + Math.random() * 0.45}`);
        sticker.style.setProperty("--d", `${i * 0.35}s`);
        layer.appendChild(sticker);
      }

      const host = target.classList.contains("program-image-wrap")
        ? target
        : target.parentElement;
      if (host) {
        host.classList.add("meme-photo-target");
        host.appendChild(layer);
      }
    });
  };

  const createFloatPath = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pad = Math.max(w, h) * 0.12;

    const pickEdgePoint = () => {
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) return { x: -pad, y: Math.random() * h };
      if (edge === 1) return { x: w + pad, y: Math.random() * h };
      if (edge === 2) return { x: Math.random() * w, y: -pad };
      return { x: Math.random() * w, y: h + pad };
    };

    const start = pickEdgePoint();
    let end = pickEdgePoint();
    let guard = 0;
    while (Math.hypot(end.x - start.x, end.y - start.y) < Math.min(w, h) * 0.75 && guard < 8) {
      end = pickEdgePoint();
      guard += 1;
    }

    return { startX: start.x, startY: start.y, endX: end.x, endY: end.y };
  };

  let floatController = null;

  const addFloats = (doc = document, { scrollWindow = window } = {}) => {
    if (floatController) {
      floatController.destroy();
      floatController = null;
    }

    doc.querySelectorAll(".meme-float").forEach((node) => node.remove());

    const floatCount = 12;
    const floats = [];
    const paths = Array.from({ length: floatCount }, () => createFloatPath());

    for (let i = 0; i < floatCount; i += 1) {
      const float = doc.createElement("div");
      float.className = "meme-float";
      float.style.setProperty("--float-delay", `${(i % 7) * 0.31}s`);
      float.style.setProperty("--float-duration", `${2.8 + (i % 5) * 0.35}s`);

      const inner = doc.createElement("span");
      inner.className = "meme-float-inner";
      inner.textContent = PARTY_EMOJIS[i % PARTY_EMOJIS.length];
      float.append(inner);
      doc.body.appendChild(float);
      floats.push(float);
    }

    const getScrollState = () => {
      const scrollElement = scrollWindow.document.scrollingElement || scrollWindow.document.documentElement;
      const scrollTop = scrollWindow.scrollY || scrollElement.scrollTop || 0;
      const scrollHeight = Math.max(
        scrollElement.scrollHeight,
        scrollWindow.document.body?.scrollHeight || 0
      );
      const viewport = scrollWindow.innerHeight;
      const maxScroll = Math.max(scrollHeight - viewport, 1);
      return { progress: clamp(scrollTop / maxScroll, 0, 1) };
    };

    let rafId = 0;
    const update = () => {
      const { progress } = getScrollState();
      floats.forEach((float, index) => {
        const path = paths[index];
        const x = path.startX + (path.endX - path.startX) * progress;
        const y = path.startY + (path.endY - path.startY) * progress;
        float.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = scrollWindow.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    const onResize = () => {
      for (let i = 0; i < paths.length; i += 1) {
        paths[i] = createFloatPath();
      }
      update();
    };

    scrollWindow.addEventListener("scroll", onScrollOrResize, { passive: true });
    scrollWindow.addEventListener("resize", onResize, { passive: true });
    update();

    floatController = {
      destroy: () => {
        scrollWindow.removeEventListener("scroll", onScrollOrResize);
        scrollWindow.removeEventListener("resize", onResize);
        if (rafId) scrollWindow.cancelAnimationFrame(rafId);
        floats.forEach((node) => node.remove());
      },
    };
  };

  window.MemeEmojiEffects = { addStickers, addFloats };
})();
