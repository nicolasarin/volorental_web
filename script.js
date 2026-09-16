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

  /* ---------- Active nav on same-page sections ---------- */
  const navLinks = document.querySelectorAll(".nav__link");
  const sectionOrder = ["inicio", "servicios", "proyectos", "nosotros", "contacto"];
  const isHome = document.body.getAttribute("data-page") === "inicio";

  const setActiveNav = (id) => {
    navLinks.forEach((item) => {
      item.classList.toggle("is-active", item.getAttribute("data-nav") === id);
    });
  };

  if (isHome && navLinks.length) {
    const headerHeight = () => {
      const sticky = document.querySelector(".header");
      return sticky ? sticky.getBoundingClientRect().height : 100;
    };

    const sectionFromHash = () => {
      const hash = (window.location.hash || "#inicio").slice(1);
      return sectionOrder.includes(hash) ? hash : "inicio";
    };

    const sectionFromScroll = () => {
      const marker = headerHeight() + 96;
      let current = "inicio";
      document.querySelectorAll("#inicio, #servicios, #proyectos, #contacto, #nosotros").forEach((el) => {
        if (el.getBoundingClientRect().top <= marker) current = el.id;
      });

      const doc = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 32;
      if (atBottom) current = "nosotros";

      return current;
    };

    const syncNav = () => setActiveNav(sectionFromScroll());

    const scrollToSection = (id, behavior = "smooth") => {
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior, block: "start" });
      return true;
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const id = link.getAttribute("data-nav");
        if (!id || !document.getElementById(id)) return;
        event.preventDefault();
        history.pushState(null, "", `#${id}`);
        setActiveNav(id);
        scrollToSection(id);
      });
    });

    window.addEventListener("hashchange", () => {
      const id = sectionFromHash();
      setActiveNav(id);
      scrollToSection(id);
    });
    window.addEventListener("scroll", syncNav, { passive: true });
    setActiveNav(sectionFromHash());
    window.setTimeout(syncNav, 50);
  } else {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.forEach((item) => item.classList.remove("is-active"));
        link.classList.add("is-active");
      });
    });
  }

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

    const hashId = (window.location.hash || "").slice(1);
    if (hashId && document.getElementById(hashId)) {
      window.setTimeout(() => {
        document.getElementById(hashId).scrollIntoView({ behavior: "smooth", block: "start" });
      }, 320);
    }
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

  /* ---------- Equipos catalog ---------- */
  const EQUIPOS_ICONS = {
    pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.2" stroke="currentColor" stroke-width="1.8"/></svg>',
    audio: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="6.5" width="13" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 10l5-2.5v9L16 14" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="7" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="17" r="2" fill="currentColor"/></svg>',
    puzzle: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.5 4h5v3a2 2 0 104 0V4H20v5.5h-3a2 2 0 100 4h3V20H4v-6.5h3a2 2 0 100-4H4V4h4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const initEquiposCatalog = async () => {
    const root = document.querySelector("[data-equipos]");
    if (!root) return;

    const catsEl = root.querySelector("[data-equipos-cats]");
    const gridEl = root.querySelector("[data-equipos-grid]");
    const headingEl = root.querySelector("[data-equipos-heading]");
    const searchEl = root.querySelector("[data-equipos-search]");
    const allBtn = root.querySelector("[data-equipos-all]");
    const searchForm = root.querySelector(".equipos-search");

    let catalog = null;
    try {
      const response = await fetch("data/equipos.json", { cache: "no-store" });
      if (response.ok) catalog = await response.json();
    } catch (error) {
      catalog = null;
    }
    if (!catalog) catalog = window.VOLO_EQUIPOS || null;
    if (!catalog) {
      if (gridEl) {
        gridEl.innerHTML = '<p class="equipos-empty">No se pudo cargar el catálogo de equipos.</p>';
      }
      return;
    }

    const categories = catalog.categories || [];
    const products = catalog.products || [];
    const featuredCategory = catalog.featuredCategory || (categories[0] && categories[0].id);
    const featuredLimit = Number(catalog.featuredLimit) || 4;
    const state = {
      category: featuredCategory,
      query: "",
      showAll: false
    };

    const categoryLabel = (id) => {
      const match = categories.find((item) => item.id === id);
      return match ? match.label : id;
    };

    const renderCategories = () => {
      catsEl.innerHTML = categories
        .map((item) => `
          <li>
            <button class="equipos-cat${item.id === state.category && !state.query ? " is-active" : ""}" type="button" data-cat="${escapeHtml(item.id)}">
              ${EQUIPOS_ICONS[item.icon] || EQUIPOS_ICONS.pin}
              <span>${escapeHtml(item.label)}</span>
            </button>
          </li>`)
        .join("");
    };

    const visibleProducts = () => {
      const query = state.query.trim().toLowerCase();
      if (query) {
        return products.filter((item) =>
          [item.name, item.type, item.category].join(" ").toLowerCase().includes(query)
        );
      }

      const inCategory = products.filter((item) => item.category === state.category);
      if (!state.showAll && state.category === featuredCategory) {
        const featured = inCategory.filter((item) => item.featured);
        return (featured.length ? featured : inCategory).slice(0, featuredLimit);
      }
      return inCategory;
    };

    const renderHeading = () => {
      if (state.query.trim()) {
        headingEl.textContent = "Resultados";
        return;
      }
      const label = categoryLabel(state.category);
      headingEl.textContent = !state.showAll && state.category === featuredCategory
        ? `${label} destacada`
        : label;
    };

    const renderGrid = () => {
      const items = visibleProducts();
      if (!items.length) {
        gridEl.innerHTML = '<p class="equipos-empty">No encontramos equipos con ese criterio.</p>';
        return;
      }

      gridEl.innerHTML = items
        .map((item) => `
          <article class="equipos-card">
            <div class="equipos-card__media">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
            </div>
            <h4 class="equipos-card__name">${escapeHtml(item.name)}</h4>
            <p class="equipos-card__type">${escapeHtml(item.type || "")}</p>
            <p class="equipos-card__stock">${Number(item.stock) || 0} unidades</p>
          </article>`)
        .join("");
    };

    const render = () => {
      renderCategories();
      renderHeading();
      renderGrid();
    };

    catsEl.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cat]");
      if (!button) return;
      state.category = button.getAttribute("data-cat");
      state.query = "";
      state.showAll = false;
      if (searchEl) searchEl.value = "";
      render();
    });

    if (allBtn) {
      allBtn.addEventListener("click", () => {
        state.showAll = true;
        state.query = "";
        if (searchEl) searchEl.value = "";
        render();
      });
    }

    if (searchForm) {
      searchForm.addEventListener("submit", (event) => event.preventDefault());
    }

    if (searchEl) {
      searchEl.addEventListener("input", () => {
        state.query = searchEl.value;
        render();
      });
    }

    render();
  };

  initEquiposCatalog();
})();
