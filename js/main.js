document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------------- Page transitions ---------------- */
(function pageTransitions() {
  const progress = document.getElementById("routeProgress");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Runs on every load, including back/forward-cache restores, so a page
  // that was mid-transition when the user left never gets stuck faded out.
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("is-leaving");
    if (progress) {
      progress.classList.remove("is-active");
      progress.classList.add("is-done");
      window.setTimeout(() => progress.classList.remove("is-done"), 400);
    }
  });

  if (prefersReduced) return;

  const LEAVE_MS = 320;

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const a = e.target.closest("a");
    if (!a) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;

    const href = a.getAttribute("href") || "";
    if (!href || href.startsWith("#") || /^(tel|sms|mailto):/i.test(href)) return;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch (err) {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;

    e.preventDefault();
    document.body.classList.add("is-leaving");
    if (progress) {
      progress.classList.remove("is-done");
      void progress.offsetWidth; // restart the width transition cleanly
      progress.classList.add("is-active");
    }
    window.setTimeout(() => {
      window.location.href = url.href;
    }, LEAVE_MS);
  });
})();
