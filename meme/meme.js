const MEME_APP = document.querySelector("#meme-app");
const MEME_PARAMS = new URLSearchParams(window.location.search);
const CAKE_STORAGE_KEY = "mahathi-meme-cake-v1";

// Set to true to load meme-emojis.js (stickers + floating parallax emojis).
const MEME_EMOJIS_ENABLED = false;

const CAKE_FILES = Array.from({ length: 13 }, (_, index) => `cake-${String(index + 1).padStart(2, "0")}.png`);

const PROGRAM_IDS = [
  "mallari",
  "ganesha",
  "alaripu",
  "kriti-on-devi",
  "varnam",
  "parathpara",
  "padam",
  "javali",
  "thillana",
  "mangalam",
];

const CAKE_TARGETS = ["banner", "about-mahathi", "about-guru", ...PROGRAM_IDS];

const defaultCakeConfig = {
  banner: { x: 68, y: 65, scale: 0.43, rotate: 6, cake: 0 },
  "about-mahathi": { x: 76, y: 33, scale: 0.61, rotate: 18, cake: 1 },
  "about-guru": { x: 52, y: 49, scale: 0.58, rotate: -9, cake: 4 },
  mallari: { x: 33, y: 36, scale: 0.57, rotate: 18, cake: 2 },
  ganesha: { x: 78, y: 9, scale: 0.56, rotate: -8, cake: 3 },
  alaripu: { x: 34, y: 24, scale: 0.76, rotate: 12, cake: 4 },
  "kriti-on-devi": { x: 86, y: 29, scale: 0.72, rotate: 2, cake: 5 },
  varnam: { x: 50, y: 56, scale: 0.67, rotate: -5, cake: 6 },
  parathpara: { x: 33, y: 11, scale: 0.52, rotate: -6, cake: 7 },
  padam: { x: 38, y: 32, scale: 0.64, rotate: 14, cake: 8 },
  javali: { x: 47, y: 38, scale: 0.91, rotate: -10, cake: 9 },
  thillana: { x: 22, y: 32, scale: 0.54, rotate: -2, cake: 10 },
  mangalam: { x: 53, y: 61, scale: 0.4, rotate: -1, cake: 11 },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getStoredCakeConfig = () => {
  try {
    const raw = localStorage.getItem(CAKE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

let runtimeCakeConfig = { ...defaultCakeConfig, ...getStoredCakeConfig() };

const fixAssetPaths = (root) => {
  root.querySelectorAll("[src], [href]").forEach((node) => {
    ["src", "href"].forEach((attr) => {
      const value = node.getAttribute(attr);
      if (!value || value.startsWith("http") || value.startsWith("#") || value.startsWith("mailto:")) {
        return;
      }
      if (!value.startsWith("../") && !value.startsWith("/")) {
        node.setAttribute(attr, `../${value}`);
      }
    });
  });
};

const loadMainScript = () =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "../script.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load main script"));
    document.body.appendChild(script);
  });

const cakeSrc = (file, assetBase) => `${assetBase}cake-vectors/${file}`;

const applyCakeOverlay = (host, targetId, assetBase) => {
  const preset = {
    ...defaultCakeConfig[targetId],
    ...(runtimeCakeConfig[targetId] || {}),
  };
  const x = clamp(Number(preset.x ?? 50), 0, 100);
  const y = clamp(Number(preset.y ?? 70), 0, 100);
  const scale = clamp(Number(preset.scale ?? 0.3), 0.05, 1.5);
  const rotate = Number(preset.rotate ?? 0);
  const cakeIndex = clamp(Number(preset.cake ?? 0), 0, CAKE_FILES.length - 1);

  let overlay = host.querySelector(":scope > .meme-cake-overlay");
  if (!overlay) {
    overlay = document.createElement("img");
    overlay.className = "meme-cake-overlay";
    overlay.alt = "";
    overlay.setAttribute("aria-hidden", "true");
    overlay.decoding = "async";
    host.appendChild(overlay);
  }

  overlay.src = cakeSrc(CAKE_FILES[cakeIndex], assetBase);
  overlay.dataset.cakeTarget = targetId;
  overlay.style.setProperty("--cake-x", `${x}%`);
  overlay.style.setProperty("--cake-y", `${y}%`);
  overlay.style.setProperty("--cake-scale", String(scale));
  overlay.style.setProperty("--cake-rotate", `${rotate}deg`);
};

const applyAllCakeOverlays = (root, assetBase) => {
  CAKE_TARGETS.forEach((targetId) => {
    const host = root.querySelector(`[data-cake-target="${targetId}"]`);
    if (host) applyCakeOverlay(host, targetId, assetBase);
  });
};

const ensureCakeHost = (element, targetId) => {
  if (element.dataset.cakeTarget) return element;

  if (element.classList.contains("meme-cake-host")) {
    element.dataset.cakeTarget = targetId;
    return element;
  }

  const host = document.createElement("div");
  host.className = "meme-cake-host";
  host.dataset.cakeTarget = targetId;
  element.parentNode.insertBefore(host, element);
  host.appendChild(element);
  return host;
};

const addCakeOverlays = (root, assetBase) => {
  const hero = root.querySelector(".hero");
  if (hero) {
    hero.classList.add("meme-cake-host");
    hero.dataset.cakeTarget = "banner";
  }

  const aboutCards = root.querySelectorAll("#about .split .card");
  if (aboutCards[0]) {
    const portrait = aboutCards[0].querySelector(".portrait");
    if (portrait) ensureCakeHost(portrait, "about-mahathi");
  }
  if (aboutCards[1]) {
    const portrait = aboutCards[1].querySelector(".portrait");
    if (portrait) ensureCakeHost(portrait, "about-guru");
  }

  root.querySelectorAll(".program-image-wrap").forEach((wrap) => {
    const img = wrap.querySelector(".tunable-image[data-image-id]");
    const id = img?.dataset.imageId;
    if (id && PROGRAM_IDS.includes(id)) {
      wrap.classList.add("meme-cake-host");
      wrap.dataset.cakeTarget = id;
    }
  });

  applyAllCakeOverlays(root, assetBase);
};

const loadEmojiEffects = () =>
  new Promise((resolve, reject) => {
    if (window.MemeEmojiEffects) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "meme-emojis.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load meme-emojis.js"));
    document.body.appendChild(script);
  });

const applyEmojiEffects = async (root, doc, scrollWindow) => {
  if (!MEME_EMOJIS_ENABLED) return;
  await loadEmojiEffects();
  window.MemeEmojiEffects.addStickers(root);
  window.MemeEmojiEffects.addFloats(doc, { scrollWindow });
};

const enableCakeTuning = (root, assetBase) => {
  document.body.classList.add("meme-tuning-mode");

  const panel = document.createElement("aside");
  panel.className = "meme-tuning-panel";

  const title = document.createElement("h4");
  title.textContent = "Meme Cake Tuning";
  panel.append(title);

  const note = document.createElement("p");
  note.className = "tuning-note";
  note.textContent =
    "Drag sliders to position each cake overlay. Copy JSON when done, or reset to site defaults.";
  panel.append(note);

  const targetSelect = document.createElement("label");
  targetSelect.className = "meme-tune-target-select";
  const targetLabel = document.createElement("span");
  targetLabel.textContent = "Image";
  const targetPicker = document.createElement("select");

  const labels = {
    banner: "Hero Banner",
    "about-mahathi": "About Mahathi",
    "about-guru": "Guru Sridevi Jagannath",
    mallari: "Mallari",
    ganesha: "Ganesha Vandanam",
    alaripu: "Alaripu",
    "kriti-on-devi": "Kriti on Devi",
    varnam: "Varnam",
    parathpara: "Parathpara",
    padam: "Padam",
    javali: "Javali",
    thillana: "Thillana",
    mangalam: "Mangalam",
  };

  CAKE_TARGETS.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = labels[id] || id;
    targetPicker.append(option);
  });

  targetSelect.append(targetLabel, targetPicker);
  panel.append(targetSelect);

  const row = document.createElement("div");
  row.className = "tune-row meme-tune-controls";
  panel.append(row);

  const output = document.createElement("textarea");
  output.readOnly = true;

  const syncOutput = () => {
    output.value = JSON.stringify(runtimeCakeConfig, null, 2);
  };

  const scrollToTarget = (id) => {
    const host = root.querySelector(`[data-cake-target="${id}"]`);
    if (!host) return;
    host.classList.add("meme-tune-highlight");
    host.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => host.classList.remove("meme-tune-highlight"), 1200);
  };

  const controlState = { id: CAKE_TARGETS[0] };

  const makeSlider = (field, text, min, max, step) => {
    const wrapper = document.createElement("label");
    const current = document.createElement("span");
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.step = String(step);

    const refresh = () => {
      const id = controlState.id;
      const value =
        runtimeCakeConfig[id]?.[field] ?? defaultCakeConfig[id]?.[field] ?? (field === "scale" ? 0.3 : field === "cake" ? 0 : field === "rotate" ? 0 : 50);
      slider.value = String(value);
      current.textContent = `${text}: ${value}`;
    };

    slider.addEventListener("input", () => {
      const id = controlState.id;
      const value = Number(slider.value);
      runtimeCakeConfig[id] = { ...(runtimeCakeConfig[id] || {}), [field]: value };
      applyAllCakeOverlays(root, assetBase);
      localStorage.setItem(CAKE_STORAGE_KEY, JSON.stringify(runtimeCakeConfig));
      current.textContent = `${text}: ${value}`;
      syncOutput();
    });

    wrapper.append(current, slider);
    row.append(wrapper);
    return refresh;
  };

  const refreshX = makeSlider("x", "X", 0, 100, 1);
  const refreshY = makeSlider("y", "Y", 0, 100, 1);
  const refreshScale = makeSlider("scale", "Scale", 0.05, 1.2, 0.01);
  const refreshRotate = makeSlider("rotate", "Rotate", -180, 180, 1);
  const refreshCake = makeSlider("cake", "Cake #", 0, CAKE_FILES.length - 1, 1);

  const refreshControls = () => {
    refreshX();
    refreshY();
    refreshScale();
    refreshRotate();
    refreshCake();
    scrollToTarget(controlState.id);
  };

  targetPicker.addEventListener("change", () => {
    controlState.id = targetPicker.value;
    refreshControls();
  });

  const actions = document.createElement("div");
  actions.className = "tune-actions";

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.textContent = "Copy JSON";
  copyBtn.addEventListener("click", async () => {
    syncOutput();
    try {
      await navigator.clipboard.writeText(output.value);
      copyBtn.textContent = "Copied";
      window.setTimeout(() => {
        copyBtn.textContent = "Copy JSON";
      }, 1200);
    } catch {
      copyBtn.textContent = "Copy failed";
      window.setTimeout(() => {
        copyBtn.textContent = "Copy JSON";
      }, 1200);
    }
  });

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.textContent = "Reset cake defaults";
  resetBtn.addEventListener("click", () => {
    localStorage.removeItem(CAKE_STORAGE_KEY);
    window.location.reload();
  });

  actions.append(copyBtn, resetBtn);
  panel.append(actions);
  panel.append(output);
  document.body.append(panel);

  refreshControls();
  syncOutput();
};

const decorateContent = async (root, { assetBase = "", doc = document, tuning = false } = {}) => {
  addCakeOverlays(root, assetBase);
  await applyEmojiEffects(root, doc, window);
  if (tuning) enableCakeTuning(root, assetBase);
};

const loadViaFetch = async () => {
  const response = await fetch("../index.html");
  if (!response.ok) throw new Error(`Failed to fetch main page (${response.status})`);

  const html = await response.text();
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const bodyMarkup = parsed.body.innerHTML;
  MEME_APP.innerHTML = bodyMarkup;
  fixAssetPaths(MEME_APP);

  await loadMainScript();
  decorateContent(MEME_APP, {
    assetBase: "",
    doc: document,
    tuning: MEME_PARAMS.get("tune") === "1",
  });
};

const loadViaIframe = () => {
  MEME_APP.innerHTML = "";

  const note = document.createElement("p");
  note.className = "meme-local-note";
  note.textContent = "Meme mode loaded via embedded page. For best results, run a local server.";
  MEME_APP.append(note);

  const iframe = document.createElement("iframe");
  iframe.className = "meme-fallback-iframe";
  iframe.title = "Mahathi site meme view";
  iframe.src = "../index.html";
  iframe.setAttribute("scrolling", "no");
  MEME_APP.append(iframe);

  iframe.addEventListener("load", async () => {
    const iframeDoc = iframe.contentDocument;
    const iframeWin = iframe.contentWindow;
    if (!iframeDoc || !iframeWin) return;

    const syncHeight = () => {
      const height = Math.max(
        iframeDoc.documentElement.scrollHeight,
        iframeDoc.body.scrollHeight,
        iframeWin.innerHeight
      );
      iframe.style.height = `${height}px`;
    };

    syncHeight();
    window.setTimeout(syncHeight, 250);
    window.setTimeout(syncHeight, 900);
    iframeWin.addEventListener("resize", syncHeight);

    const memeLink = iframeDoc.createElement("link");
    memeLink.rel = "stylesheet";
    memeLink.href = "meme/meme.css";
    iframeDoc.head.append(memeLink);

    addCakeOverlays(iframeDoc.body, "meme/");
    await applyEmojiEffects(iframeDoc.body, iframeDoc, window);

    if (MEME_PARAMS.get("tune") === "1") {
      enableCakeTuning(iframeDoc.body, "meme/");
    }

    window.addEventListener("resize", syncHeight, { passive: true });
  });
};

const initMeme = async () => {
  try {
    await loadViaFetch();
  } catch {
    loadViaIframe();
  }
};

initMeme();
