(() => {
  "use strict";

  /* ---------- Mobile nav ---------- */
  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");

  if (menuToggle && header) {
    const setOpen = (open) => {
      header.classList.toggle("nav-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.classList.toggle("nav-locked", open);
    };

    menuToggle.addEventListener("click", () => {
      setOpen(!header.classList.contains("nav-open"));
    });

    header.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  }

  /* ---------- Active nav on same-page hash links ---------- */
  const currentFile = (() => {
    const name = window.location.pathname.split("/").pop();
    return !name || name === "" ? "index.html" : name;
  })();

  document.querySelectorAll(".nav__link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const targetFile = (href.split("#")[0] || currentFile).split("/").pop() || currentFile;
    if (targetFile !== currentFile) return;

    link.addEventListener("click", () => {
      document.querySelectorAll(".nav__link").forEach((item) => {
        item.classList.remove("is-active");
      });
      link.classList.add("is-active");
    });
  });

  /* ---------- Page loader ---------- */
  const finishLoad = () => {
    if (document.documentElement.classList.contains("is-ready")) return;

    document.documentElement.classList.remove("is-loading");
    document.documentElement.classList.add("is-ready");

    const loader = document.querySelector(".page-loader");
    if (loader) {
      const drop = () => loader.remove();
      loader.addEventListener("transitionend", drop, { once: true });
      window.setTimeout(drop, 900);
    }

    window.setTimeout(initHomeReveals, 280);
  };

  /* ---------- Home scroll reveals ---------- */
  const initHomeReveals = () => {
    const home = document.body.getAttribute("data-page") === "inicio";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!home) return;

    const groups = document.querySelectorAll(".reveal-group");
    const show = (group) => group.classList.add("is-inview");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      groups.forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    groups.forEach((group) => observer.observe(group));
  };

  if (document.readyState === "complete") {
    finishLoad();
  } else {
    window.addEventListener("load", finishLoad, { once: true });
    window.setTimeout(finishLoad, 8000);
  }
})();
