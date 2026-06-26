const sectionLinks = [...document.querySelectorAll(".section-nav a")];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const themeToggle = document.querySelector("#themeToggle");
const THEME_KEY = "mahathi-theme";
const CROP_KEY = "mahathi-image-crops-v1";
const tunableImages = [...document.querySelectorAll(".tunable-image[data-image-id]")];
const heroImage = document.querySelector(".hero-image");

const defaultCropConfig = {
  banner: { x: 19, y: 86, zoom: 1 },
  front: { x: 50, y: 52, zoom: 1 },
  teacher: { x: 71, y: 100, zoom: 1.07 },
  mallari: { x: 50, y: 71, zoom: 1.09 },
  ganesha: { x: 50, y: 88, zoom: 1.01 },
  alaripu: { x: 80, y: 50, zoom: 1 },
  "kriti-on-devi": { x: 98, y: 84, zoom: 1.09 },
  varnam: { x: 66, y: 100, zoom: 1.14 },
  parathpara: { x: 50, y: 77, zoom: 1.12 },
  padam: { x: 71, y: 100, zoom: 1.04 },
  javali: { x: 84, y: 100, zoom: 1.02 },
  thillana: { x: 99, y: 100, zoom: 1.06 },
  mangalam: { x: 65, y: 84, zoom: 1.27 },
  rohit: { x: 0, y: 25, zoom: 1.08 },
  vinay: { x: 20, y: 9, zoom: 1.21 },
  arun: { x: 41, y: 41, zoom: 1.23 },
  rakesh: { x: 18, y: 11, zoom: 1.3 },
};

const getStoredCropConfig = () => {
  try {
    const raw = localStorage.getItem(CROP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const applySingleCrop = (img, preset) => {
  const wrap = img.closest(".artist-image-wrap, .program-image-wrap");
  if (!wrap || !img.naturalWidth || !img.naturalHeight) return;

  const x = clamp(Number(preset?.x ?? 50), 0, 100);
  const y = clamp(Number(preset?.y ?? 50), 0, 100);
  const zoom = clamp(Number(preset?.zoom ?? 1), 1, 2.2);

  const wrapW = wrap.clientWidth;
  const wrapH = wrap.clientHeight;
  if (!wrapW || !wrapH) return;

  const coverScale = Math.max(wrapW / img.naturalWidth, wrapH / img.naturalHeight);
  const scale = coverScale * zoom;
  const renderW = img.naturalWidth * scale;
  const renderH = img.naturalHeight * scale;
  const overflowX = Math.max(0, renderW - wrapW);
  const overflowY = Math.max(0, renderH - wrapH);

  img.style.position = "absolute";
  img.style.width = `${renderW}px`;
  img.style.height = `${renderH}px`;
  img.style.left = `${-overflowX * (x / 100)}px`;
  img.style.top = `${-overflowY * (y / 100)}px`;
  img.style.maxWidth = "none";
};

const applyCropConfig = (config) => {
  const bannerPreset = config.banner || defaultCropConfig.banner || { x: 50, y: 74, zoom: 1 };
  if (heroImage) {
    heroImage.style.setProperty("--banner-x", `${clamp(Number(bannerPreset.x) || 50, 0, 100)}%`);
    heroImage.style.setProperty("--banner-y", `${clamp(Number(bannerPreset.y) || 74, 0, 100)}%`);
    heroImage.style.setProperty("--banner-zoom", `${clamp(Number(bannerPreset.zoom) || 1, 1, 2.2)}`);
  }

  tunableImages.forEach((img) => {
    const id = img.dataset.imageId;
    applySingleCrop(img, config[id] || defaultCropConfig[id] || { x: 50, y: 50, zoom: 1 });
  });
};

const runtimeCropConfig = { ...defaultCropConfig, ...getStoredCropConfig() };
const ensureImageReady = (img) =>
  img.complete && img.naturalWidth
    ? Promise.resolve()
    : new Promise((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });

Promise.all(tunableImages.map((img) => ensureImageReady(img))).then(() => {
  applyCropConfig(runtimeCropConfig);
});

window.addEventListener("resize", () => {
  applyCropConfig(runtimeCropConfig);
});

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);

  if (!themeToggle) return;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
};

const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme === "dark" ? "dark" : "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}

const params = new URLSearchParams(window.location.search);
const tuningMode = params.get("tune") === "1";

if (tuningMode && tunableImages.length) {
  document.body.classList.add("tuning-mode");

  const panel = document.createElement("aside");
  panel.className = "tuning-panel";

  const title = document.createElement("h4");
  title.textContent = "Image Tuning Mode";
  panel.append(title);

  const note = document.createElement("p");
  note.className = "tuning-note";
  note.textContent =
    "Adjust sliders, then copy JSON and share it back so values can be saved permanently.";
  panel.append(note);

  const output = document.createElement("textarea");
  output.readOnly = true;

  const syncOutput = () => {
    output.value = JSON.stringify(runtimeCropConfig, null, 2);
  };

  const addTuneRow = (id, label) => {
    const row = document.createElement("div");
    row.className = "tune-row";

    const heading = document.createElement("p");
    heading.textContent = label;
    row.append(heading);

    const makeSlider = (field, text, min, max, step) => {
      const wrapper = document.createElement("label");
      const current = document.createElement("span");
      const currentValue =
        runtimeCropConfig[id]?.[field] ?? defaultCropConfig[id]?.[field] ?? (field === "zoom" ? 1 : 50);
      current.textContent = `${text}: ${currentValue}`;
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = String(min);
      slider.max = String(max);
      slider.step = String(step);
      slider.value = String(currentValue);

      slider.addEventListener("input", () => {
        const value = Number(slider.value);
        runtimeCropConfig[id] = { ...(runtimeCropConfig[id] || {}), [field]: value };
        applyCropConfig(runtimeCropConfig);
        localStorage.setItem(CROP_KEY, JSON.stringify(runtimeCropConfig));
        current.textContent = `${text}: ${value}`;
        syncOutput();
      });

      wrapper.append(current, slider);
      row.append(wrapper);
    };

    makeSlider("x", "X", 0, 100, 1);
    makeSlider("y", "Y", 0, 100, 1);
    makeSlider("zoom", "Zoom", 1, 2.2, 0.01);
    panel.append(row);
  };

  addTuneRow("banner", "Hero Banner");

  tunableImages.forEach((img) => {
    const id = img.dataset.imageId;
    const card = img.closest(".artist-card, .program-card");
    const label = card?.querySelector("h3")?.textContent?.trim() || id;
    addTuneRow(id, label);
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
      setTimeout(() => {
        copyBtn.textContent = "Copy JSON";
      }, 1200);
    } catch {
      copyBtn.textContent = "Copy failed";
      setTimeout(() => {
        copyBtn.textContent = "Copy JSON";
      }, 1200);
    }
  });

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.textContent = "Reset to current defaults";
  resetBtn.addEventListener("click", () => {
    localStorage.removeItem(CROP_KEY);
    window.location.reload();
  });

  actions.append(copyBtn, resetBtn);
  panel.append(actions);
  panel.append(output);
  document.body.append(panel);
  syncOutput();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeId = `#${entry.target.id}`;
      sectionLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === activeId);
      });
    });
  },
  {
    threshold: 0.4,
    rootMargin: "-80px 0px -40% 0px",
  }
);

sections.forEach((section) => observer.observe(section));
