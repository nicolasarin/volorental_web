(() => {
  "use strict";

  const page = () => document.body.getAttribute("data-page") || "inicio";

  const navClass = (id) => (page() === id ? "nav__link is-active" : "nav__link");

  const headerHTML = () => `
  <header class="header">
    <div class="container header__inner">
      <a href="index.html" class="logo" aria-label="VOLO Rental">
        <span class="logo__volo">VOLO</span>
        <span class="logo__rental">RENTAL</span>
      </a>

      <nav class="nav" aria-label="Principal">
        <a href="index.html" class="${navClass("inicio")}">INICIO</a>
        <a href="servicios.html" class="${navClass("servicios")}">SERVICIOS</a>
        <a href="index.html#proyectos" class="${navClass("proyectos")}">PROYECTOS</a>
        <a href="nosotros.html" class="${navClass("nosotros")}">NOSOTROS</a>
      </nav>

      <a href="index.html#contacto" class="btn btn--outline-orange header__cta">
        COTIZAR AHORA
        <svg class="icon-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>

      <button class="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;

  const footerHTML = () => `
  <footer class="site-footer">
    <section class="brands" aria-label="Marcas con las que trabajamos">
      <div class="container">
        <p class="eyebrow brands__title">ALGUNAS MARCAS CON LAS QUE TRABAJAMOS</p>
        <div class="brands__viewport">
          <div class="brands__track" id="brandsTrack">
            <div class="brand"><span class="brand__logo brand__logo--robe">ROBE</span></div>
            <div class="brand"><span class="brand__logo brand__logo--ayrton">AYRTON</span></div>
            <div class="brand"><span class="brand__logo brand__logo--claypaky">CLAYPAKY</span></div>
            <div class="brand"><span class="brand__logo brand__logo--chauvet">CHAUVET<br /><small>PROFESSIONAL</small></span></div>
            <div class="brand"><span class="brand__logo brand__logo--ma">MA<br /><small>LIGHTING</small></span></div>
            <div class="brand"><span class="brand__logo brand__logo--proplex">PROPLEX</span></div>
            <div class="brand"><span class="brand__logo brand__logo--luminex">LUMINEX</span></div>
            <div class="brand"><span class="brand__logo brand__logo--martin">MARTIN</span></div>
            <div class="brand"><span class="brand__logo brand__logo--robe">ROBE</span></div>
            <div class="brand"><span class="brand__logo brand__logo--ayrton">AYRTON</span></div>
            <div class="brand"><span class="brand__logo brand__logo--claypaky">CLAYPAKY</span></div>
            <div class="brand"><span class="brand__logo brand__logo--chauvet">CHAUVET<br /><small>PROFESSIONAL</small></span></div>
            <div class="brand"><span class="brand__logo brand__logo--ma">MA<br /><small>LIGHTING</small></span></div>
            <div class="brand"><span class="brand__logo brand__logo--proplex">PROPLEX</span></div>
            <div class="brand"><span class="brand__logo brand__logo--luminex">LUMINEX</span></div>
            <div class="brand"><span class="brand__logo brand__logo--martin">MARTIN</span></div>
          </div>
        </div>
      </div>
    </section>
  </footer>`;

  const fill = (selector, html) => {
    const slot = document.querySelector(selector);
    if (slot) slot.outerHTML = html;
  };

  const render = () => {
    fill("[data-layout='header']", headerHTML());
    fill("[data-layout='footer']", footerHTML());
  };

  if (document.body && document.querySelector("[data-layout='header'], [data-layout='footer']")) {
    render();
  } else {
    document.addEventListener("DOMContentLoaded", render);
  }
})();
