/* ============================================================
   MOTO WEKTOR — interakcje i animacje
   Zasada: treść jest widoczna bez JS. JS tylko WZBOGACA.
   ============================================================ */
(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js"); // odblokowuje stany animacji reveal

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Hero wideo: dopasuj wysokość do okna minus realna wysokość górnych pasków
     (utilbar + nav), żeby cały film był widoczny od razu, bez scrollowania */
  (function fitHero() {
    if (!document.querySelector(".vhero")) return;
    var set = function () {
      var ub = document.querySelector(".utilbar");
      var nv = document.querySelector(".nav");
      var h = (ub ? ub.offsetHeight : 0) + (nv ? nv.offsetHeight : 0);
      root.style.setProperty("--top-chrome", h + "px");
    };
    set();
    window.addEventListener("resize", set, { passive: true });
    window.addEventListener("load", set);
  })();

  /* Hero wideo: pauza przy preferencji ograniczonego ruchu (pokazuje plakat/klatkę) */
  if (reduceMotion) {
    document.querySelectorAll(".vhero__video").forEach(function (v) {
      v.removeAttribute("autoplay");
      try { v.pause(); } catch (e) {}
    });
  }

  /* ---- 1. Header: zmiana stanu przy scrollu ---- */
  const header = document.querySelector(".nav, .site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- 2. Menu mobilne ---- */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");
  const closeBtn = document.querySelector(".mobile-menu__close");
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("is-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (toggle) toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  if (closeBtn) closeBtn.addEventListener("click", () => setMenu(false));
  if (menu) menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---- 2b. Menu „Odkrywaj" (dropdown w nawigacji) ---- */
  document.querySelectorAll(".nav__more").forEach((more) => {
    const btn = more.querySelector(".nav__more-btn");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = more.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
    more.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { more.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    });
  });
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".nav__more.is-open").forEach((more) => {
      if (!more.contains(e.target)) {
        more.classList.remove("is-open");
        const b = more.querySelector(".nav__more-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---- 3. Reveal przy scrollu (IntersectionObserver) ---- */
  const revealEls = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            // stagger: nadaj opóźnienia dzieciom
            if (el.hasAttribute("data-reveal-stagger")) {
              Array.from(el.children).forEach((child, i) => {
                child.style.transitionDelay = i * 70 + "ms";
              });
            }
            el.classList.add("is-visible");
            obs.unobserve(el);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---- 4. Liczniki statystyk ---- */
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1400;
    if (reduceMotion) { el.textContent = target.toLocaleString("pl-PL") + suffix; return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      el.textContent = Math.round(target * eased).toLocaleString("pl-PL") + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      const cio = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---- 5. Subtelny parallax panelu hero ---- */
  const heroPanel = document.querySelector("[data-parallax]");
  if (heroPanel && !reduceMotion && window.matchMedia("(min-width: 1025px)").matches) {
    window.addEventListener("scroll", () => {
      const y = Math.min(window.scrollY, 600);
      heroPanel.style.transform = "translateY(" + y * 0.06 + "px)";
    }, { passive: true });
  }

  /* ---- 6. Rok w stopce ---- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- 7. Formularz — szablon (bez backendu) ---- */
  const form = document.querySelector("form[data-demo]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector(".form__status");
      if (note) note.textContent = "To wersja demonstracyjna szablonu — formularz nie wysyła jeszcze wiadomości.";
    });
  }

  /* ---- 9. Galeria produktowa (carousel: slide + parallax + Ken-Burns + autoplay) ----
     Treść widoczna bez JS (scroll-snap). JS przejmuje sterowanie i dodaje ruch. */
  (function galleries() {
    const roots = document.querySelectorAll("[data-gallery]");
    if (!roots.length) return;
    roots.forEach(setupGallery);

    function setupGallery(root) {
      const stage = root.querySelector(".mw-gal__stage");
      const track = root.querySelector(".mw-gal__track");
      const slides = Array.prototype.slice.call(root.querySelectorAll(".mw-gal__slide"));
      const imgs = slides.map((s) => s.querySelector("img"));
      const n = slides.length;
      if (!stage || !track || n < 2) return; // nie ma czego przewijać

      const prevBtn = root.querySelector(".mw-gal__nav--prev");
      const nextBtn = root.querySelector(".mw-gal__nav--next");
      const dotsWrap = root.querySelector(".mw-gal__dots");
      const bar = root.querySelector(".mw-gal__bar i");
      const live = root.querySelector(".mw-gal__live");

      const AUTOPLAY = 5200;  // ms na slajd
      const PARALLAX = 6;     // % dryfu obrazu w ruchu (głębia)
      const ZOOM = 0.05;      // Ken-Burns: powiększenie slajdu w ruchu (spoczynek = 1.0)
      const SETTLE = 0.16;    // wygładzanie ease-out

      let pos = 0, target = 0, index = 0, dir = 1;
      let dragging = false, moved = false, startX = 0, startPos = 0;
      let hovering = false, focusedIn = false, inView = false;
      let autoElapsed = 0, lastT = 0, rafId = null;

      // kropki
      const dots = [];
      if (dotsWrap) {
        for (let i = 0; i < n; i++) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "mw-gal__dot";
          b.setAttribute("aria-label", "Pokaż zdjęcie " + (i + 1) + " z " + n);
          b.addEventListener("click", (function (k) { return function () { goto(k, true); }; })(i));
          dotsWrap.appendChild(b);
          dots.push(b);
        }
      }

      function isPaused() { return hovering || focusedIn || document.hidden || dragging; }

      function setUI(i) {
        for (let k = 0; k < n; k++) {
          if (dots[k]) dots[k].setAttribute("aria-current", k === i ? "true" : "false");
          slides[k].setAttribute("aria-hidden", k === i ? "false" : "true");
        }
        if (live) {
          const cap = slides[i].querySelector(".mw-gal__cap");
          live.textContent = "Zdjęcie " + (i + 1) + " z " + n + (cap ? ": " + cap.textContent.trim() : "");
        }
      }

      function render() {
        const w = stage.clientWidth || 1;
        track.style.transform = "translate3d(" + (-pos * w) + "px,0,0)";
        for (let k = 0; k < n; k++) {
          const d = k - pos;
          const cl = Math.max(-1, Math.min(1, d));
          const dim = Math.min(Math.abs(d), 1);
          if (reduceMotion) {
            imgs[k].style.transform = "";
            slides[k].style.opacity = "";
          } else {
            // aktywny (dim=0): scale 1.0, brak dryfu — pełny pojazd, bez kadrowania.
            // w ruchu / sąsiad (dim→1): lekki zoom + parallax + przygaszenie.
            const sc = 1 + dim * ZOOM;
            imgs[k].style.transform = "scale(" + sc.toFixed(4) + ") translateX(" + (-cl * PARALLAX).toFixed(2) + "%)";
            slides[k].style.opacity = (1 - dim * 0.42).toFixed(3); // przygaszeni sąsiedzi
          }
        }
        if (bar) bar.style.transform = "scaleX(" + (reduceMotion ? 0 : (autoElapsed / AUTOPLAY)) + ")";
      }

      function goto(i, viaUser) {
        target = Math.max(0, Math.min(n - 1, i));
        index = target;
        setUI(index);
        autoElapsed = 0;
        if (viaUser && (index === 0 || index === n - 1)) dir = index === 0 ? 1 : -1;
        startLoop();
      }
      function step(delta) { let i = index + delta; if (i < 0) i = n - 1; else if (i > n - 1) i = 0; goto(i, true); }
      function autoStep() {
        let i = index + dir;
        if (i > n - 1 || i < 0) { dir = -dir; i = index + dir; }
        goto(i, false);
      }

      function loop(t) {
        if (!lastT) lastT = t;
        const dt = Math.min(64, t - lastT); lastT = t;

        if (Math.abs(target - pos) > 0.0006) {
          pos += reduceMotion ? (target - pos) : (target - pos) * SETTLE;
          if (Math.abs(target - pos) <= 0.0006) pos = target;
        }
        if (!reduceMotion && inView && !isPaused()) {
          autoElapsed += dt;
          if (autoElapsed >= AUTOPLAY) { autoElapsed = 0; autoStep(); }
        }
        render();

        const moving = Math.abs(target - pos) > 0.0006 || dragging;
        const wantAuto = inView && !reduceMotion;
        if (moving || wantAuto) { rafId = requestAnimationFrame(loop); }
        else { rafId = null; lastT = 0; }
      }
      function startLoop() { if (rafId == null) { lastT = 0; rafId = requestAnimationFrame(loop); } }

      // strzałki
      if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
      if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });

      // klawiatura (fokus na przyciskach wewnątrz galerii)
      root.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      });

      // pauza autoplay przy hover / fokusie
      root.addEventListener("mouseenter", function () { hovering = true; });
      root.addEventListener("mouseleave", function () { hovering = false; startLoop(); });
      root.addEventListener("focusin", function () { focusedIn = true; });
      root.addEventListener("focusout", function () { focusedIn = false; startLoop(); });
      document.addEventListener("visibilitychange", function () { if (!document.hidden) startLoop(); });

      // przeciąganie / swipe (pointer events)
      imgs.forEach(function (im) { im.addEventListener("dragstart", function (e) { e.preventDefault(); }); });
      stage.addEventListener("pointerdown", function (e) {
        if (e.button != null && e.button !== 0) return;
        if (e.target.closest(".mw-gal__nav, .mw-gal__dot")) return;
        dragging = true; moved = false; startX = e.clientX; startPos = pos;
        stage.classList.add("is-dragging");
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        startLoop();
      });
      stage.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        const w = stage.clientWidth || 1;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        let p = startPos - dx / w;
        if (p < 0) p *= 0.35;                          // gumka na krańcach
        else if (p > n - 1) p = (n - 1) + (p - (n - 1)) * 0.35;
        pos = p; target = p;
      });
      function endDrag() {
        if (!dragging) return;
        dragging = false; stage.classList.remove("is-dragging");
        const delta = pos - startPos;
        const startIdx = Math.round(startPos);
        let ti = Math.round(pos);
        if (ti === startIdx && Math.abs(delta) > 0.12) ti = startIdx + (delta > 0 ? 1 : -1);
        goto(Math.max(0, Math.min(n - 1, ti)), true);
      }
      stage.addEventListener("pointerup", endDrag);
      stage.addEventListener("pointercancel", endDrag);
      stage.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

      // start tylko gdy widoczna (oszczędność)
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { inView = en.isIntersecting; if (inView) startLoop(); });
        }, { threshold: 0.25 });
        io.observe(root);
      } else { inView = true; }

      window.addEventListener("resize", render, { passive: true });

      setUI(0); render(); startLoop();
    }
  })();

  /* ---- 8. Płynne przewijanie (Lenis, jeśli dostępne i bez reduced-motion) ---- */
  if (!reduceMotion && window.Lenis) {
    const lenis = new window.Lenis({ duration: 1.05, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // kotwice w obrębie strony
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1) { const t = document.querySelector(id); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); } }
      });
    });
  }
})();
