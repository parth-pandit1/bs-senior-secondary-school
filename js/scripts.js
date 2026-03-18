  /* =========================
  SHARED UTILITIES
  ========================= */
function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

function setCurrentYear() {
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function hardenTargetBlankLinks() {
  qsa('a[target="_blank"]').forEach(a => {
    const rel = (a.getAttribute("rel") || "").toLowerCase();
    if (!rel.includes("noopener")) a.setAttribute("rel", `${rel} noopener`.trim());
    if (!rel.includes("noreferrer")) a.setAttribute("rel", `${a.getAttribute("rel")} noreferrer`.trim());
  });
}

function hardenExternalLinksAndPdfs() {
  const links = qsa("a[href]");

  links.forEach(a => {
    const href = (a.getAttribute("href") || "").trim();
    if (!href) return;

    const isPdf = href.toLowerCase().endsWith(".pdf");
    const isExternal = /^https?:\/\//i.test(href);

    if (isPdf || isExternal) {
      a.setAttribute("target", "_blank");
      const existingRel = (a.getAttribute("rel") || "").toLowerCase();
      let rel = existingRel;
      if (!rel.includes("noopener")) rel = `${rel} noopener`.trim();
      if (!rel.includes("noreferrer")) rel = `${rel} noreferrer`.trim();
      a.setAttribute("rel", rel);
    }
  });
}

function enableLazyImages() {
  const images = qsa("img");
  images.forEach(img => {
    // Skip hero / logo images
    if (
      img.classList.contains("school-logo") ||
      img.closest(".top-info") ||
      img.id === "lightboxImg"
    ) {
      return;
    }
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
  });
}

function initScrollToTop() {
  if (!("scrollBehavior" in document.documentElement.style)) return;

  let btn = qs("#scrollTopBtn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "scrollTopBtn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Scroll to top");
    btn.innerHTML = "&#8593;";
    document.body.appendChild(btn);
  }

  const toggleVisibility = () => {
    if (window.scrollY > 250) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();
}

/* =========================
  WELCOME OVERLAY
  ========================= */
function initWelcomeOverlay() {
  const overlay = qs("#welcome-overlay");
  if (!overlay) return;
  window.addEventListener(
    "load",
    () => {
      setTimeout(() => overlay.classList.add("hide"), 2000);
    },
    { once: true }
  );
}

/* =========================
  READ MORE (ACTIVITY CARDS)
  ========================= */
function initReadMore() {
  const readMoreLinks = qsa(".read-more");
  if (readMoreLinks.length === 0) return;

  readMoreLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const container = link.previousElementSibling;
      const currentMoreText = container ? container.querySelector(".more-text") : null;
      if (!currentMoreText) return;

      const isOpen = currentMoreText.style.display === "inline";

      qsa(".more-text").forEach(text => {
        text.style.display = "none";
      });

      readMoreLinks.forEach(btn => {
        btn.textContent = "Read More";
        btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        currentMoreText.style.display = "inline";
        link.textContent = "Read Less";
        link.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* =========================
  HERO SLIDER
  ========================= */
function initHeroSlider() {
  const slides = qsa(".hero-slider .slide");
  if (slides.length <= 1) return;

  let current = slides.findIndex(s => s.classList.contains("active"));
  if (current < 0) current = 0;

  function next() {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }

  // Let first slide settle a bit.
  setTimeout(() => {
    setInterval(next, 5000);
  }, 1200);
}

/* =========================
  AUTO SCROLL TRACK (FACILITIES)
  ========================= */
function initAutoScrollTrack() {
  const track = qs("#galleryTrack");
  if (!track) return;

  let scrollAmount = 0;
  const speed = 0.4;
  let pause = false;

  function autoScroll() {
    if (!pause) {
      scrollAmount += speed;
      track.style.transform = `translateX(-${scrollAmount}px)`;

      const half = track.scrollWidth / 2;
      if (half > 0 && scrollAmount >= half) {
        pause = true;
        setTimeout(() => {
          scrollAmount = 0;
          track.style.transform = "translateX(0px)";
          pause = false;
        }, 900);
      }
    }
    requestAnimationFrame(autoScroll);
  }

  autoScroll();
}

/* =========================
  BEYOND ACADEMICS ARROWS
  ========================= */
function initBeyondSliderArrows() {
  const slider = qs("#beyondSlider");
  const nextBtn = qs("#nextBtn");
  const prevBtn = qs("#prevBtn");
  if (!slider || !nextBtn || !prevBtn) return;

  nextBtn.addEventListener("click", () => {
    slider.scrollBy({ left: 300, behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    slider.scrollBy({ left: -300, behavior: "smooth" });
  });
}

/* =========================
  FLIP CARDS (LEADERSHIP)
  ========================= */
function initFlipCards() {
  const cards = qsa(".flip-card");
  if (cards.length === 0) return;
  cards.forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
}

// Backwards-compatible with existing inline HTML handlers.
window.shiftAndFlip = function shiftAndFlip(el) {
  if (el && el.classList) el.classList.toggle("flipped");
};

/* =========================
  MOBILE NAV
  ========================= */
function initMobileNav() {
  const menuToggle = qs("#menuToggle");
  const navbar = qs("#navbar");
  if (!menuToggle || !navbar) return;

  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", navbar.classList.contains("active") ? "true" : "false");
  });

  // Close menu after clicking a nav link (mobile).
  qsa("#navbar a").forEach(a => {
    a.addEventListener("click", () => {
      if (navbar.classList.contains("active")) navbar.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================
  COUNTERS ON SCROLL
  ========================= */
function initCounters() {
  const counterSection = qs(".counter-section");
  const counters = qsa(".counter");
  if (!counterSection || counters.length === 0 || !("IntersectionObserver" in window)) return;

  let started = false;

  function startCounters() {
    counters.forEach(counter => {
      const target = Number(counter.dataset.target || "0");
      let count = 0;

      function update() {
        const increment = Math.max(1, Math.ceil(target / 150));
        if (count < target) {
          count = Math.min(target, count + increment);
          counter.textContent = String(count);
          requestAnimationFrame(update);
        } else {
          counter.textContent = String(target);
        }
      }

      update();
    });
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          startCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(counterSection);
}

/* =========================
  GALLERY LIGHTBOX (INDEX)
  ========================= */
function initLightbox() {
  const lightbox = qs("#lightbox");
  const lightboxImg = qs("#lightboxImg");
  const closeLightbox = qs("#closeLightbox");

  if (!lightbox || !lightboxImg || !closeLightbox) return;

  // Works for both `.gallery-item img` and card-based galleries.
  const clickableImages = qsa(".gallery-item img, .gallery-card img");
  if (clickableImages.length === 0) return;

  clickableImages.forEach(img => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "Gallery image";
    });
  });

  function close() {
    lightbox.style.display = "none";
  }

  closeLightbox.addEventListener("click", close);
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });
}

/* =========================
  SCROLL REVEAL (ACCESSIBLE)
  ========================= */
function initScrollReveal() {
  const reveals = qsa(".reveal");
  if (reveals.length === 0) return;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    reveals.forEach(el => el.classList.add("active"));
    return;
  }

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach(el => obs.observe(el));
  } else {
    const revealOnScroll = () => {
      reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) el.classList.add("active");
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
  }
}

onReady(() => {
  setCurrentYear();
  hardenTargetBlankLinks();
  hardenExternalLinksAndPdfs();
  enableLazyImages();
  initWelcomeOverlay();
  initReadMore();
  initHeroSlider();
  initAutoScrollTrack();
  initBeyondSliderArrows();
  initFlipCards();
  initMobileNav();
  initCounters();
  initLightbox();
  initScrollReveal();
  initScrollToTop();
});