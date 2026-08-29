/**
 * app.js
 * ------------------------------------------------------------------
 * Orquesta la página: toma el contenido de config.js y lo renderiza
 * en el DOM. Engancha las interacciones (menú móvil, copiar al
 * portapapeles, animaciones). Todo el contenido editable vive en un
 * solo lugar: config.js.
 * ------------------------------------------------------------------
 */

import { SETTINGS, BANNER, SOCIALS, COMMUNITY, NARANJAX } from "./config.js";
import { initParticles } from "./particles.js";
import { db, doc, collection, query, orderBy, onSnapshot } from "./firebase-init.js";

// Datos de pago (alias/CBU): viven en Firestore (settings/payment) y se
// editan desde admin.html → pestaña "Datos de pago". NARANJAX de
// config.js queda solo como valor de respaldo hasta el primer guardado.
let PAYMENT_DATA = NARANJAX;

// Productos y precios de la TIENDA (no revendedores) viven en
// Firestore, colección "products". Se editan desde admin.html →
// pestaña "Productos", sin tocar código. Esta lista se mantiene
// actualizada en vivo con onSnapshot.
let PRODUCTS = [];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);

// Precio final de un producto: si tiene discountPrice (y es menor al
// precio normal), ese es el que se cobra. Si no, se usa price.
const finalPrice = (product) =>
  product.discountPrice != null && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

// % de descuento redondeado, para el badge ("-15%").
const discountPercent = (product) =>
  Math.round((1 - finalPrice(product) / product.price) * 100);

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}

/* ================= RENDER: MARCA / HEADER ================= */

function renderBrand() {
  $$(".js-store-name").forEach((el) => (el.textContent = SETTINGS.storeName));
  $$(".js-logo").forEach((el) => (el.src = SETTINGS.logoUrl));
  document.title = `${SETTINGS.storeName} — Diamantes Free Fire`;
}

/* ================= RENDER: HERO / BANNER ================= */

function renderBanner() {
  $$(".js-banner-title").forEach((el) => (el.textContent = BANNER.title));
  $$(".js-banner-subtitle").forEach((el) => (el.textContent = BANNER.subtitle));
  $$(".js-banner-text").forEach((el) => (el.textContent = BANNER.text));

  const heroBg = $("#hero-bg-image");
  if (heroBg && (BANNER.imageUrlMobile || BANNER.imageUrlDesktop)) {
    let currentUrl = "";
    const applyHeroBg = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const url = isMobile
        ? BANNER.imageUrlMobile || BANNER.imageUrlDesktop
        : BANNER.imageUrlDesktop || BANNER.imageUrlMobile;
      if (url === currentUrl) return; // evita re-pintar el fondo sin necesidad
      currentUrl = url;
      heroBg.style.backgroundImage = `linear-gradient(180deg, rgba(5,5,5,.35), rgba(5,5,5,.9)), url('${url}')`;
      heroBg.style.opacity = "1";
    };
    applyHeroBg();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyHeroBg, 200);
    });
  }
}

/* ================= RENDER: PRODUCTOS ================= */

// Ícono de diamante por defecto para paquetes sin foto propia todavía.
// Reemplazá `product.image` en config.js por tu propia foto cuando quieras.
const DIAMOND_PLACEHOLDER_SVG = `
  <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" class="diamond-icon">
    <polygon points="23,3 40,16 23,43 6,16" fill="url(#diamondGrad)" stroke="var(--c-blue-glow)" stroke-width="1.2"/>
    <polygon points="6,16 23,3 23,43" fill="#000" opacity="0.14"/>
    <line x1="6" y1="16" x2="40" y2="16" stroke="var(--c-blue-glow)" stroke-width="0.6" opacity="0.6"/>
    <defs>
      <linearGradient id="diamondGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e9f6ff"/>
        <stop offset="55%" stop-color="#7fd6ff"/>
        <stop offset="100%" stop-color="#00a8ff"/>
      </linearGradient>
    </defs>
  </svg>`;

function buildWhatsappLink(product, buyer) {
  const lines = [
    "¡Hola!  Ya realicé el pago, te dejo mi comprobante ",
    "",
    " Quiero comprar:",
    product.name,
    "",
    " Precio:",
    formatPrice(finalPrice(product)),
  ];
  if (buyer) {
    lines.push("", " Mi ID (UID):", buyer.uid, "🎮 Nombre en el juego:", buyer.nickname);
  }
  lines.push("", " Pedido realizado en settings.sbs");
  const msg = lines.join("\n");
  return `https://wa.me/${SETTINGS.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

function productCardTemplate(product, index) {
  if (product.type === "quantity") return quantityCardTemplate(product, index);

  const img = product.image
    ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
    : `<div class="w-full h-full flex items-center justify-center">${DIAMOND_PLACEHOLDER_SVG}</div>`;

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const hasBonus = product.bonus != null && product.bonus > 0;
  const outOfStock = product.inStock === false;

  // Título grande del pack: "100+10 DIAMANTES" si hay bono, si no el nombre tal cual.
  const title =
    product.diamonds && hasBonus
      ? `${product.diamonds}+${product.bonus} DIAMANTES`
      : product.diamonds
      ? `${product.diamonds} DIAMANTES`
      : product.name;

  // Línea de detalle: "100 diamantes + 10 bono" o la descripción/badge que haya cargado el admin.
  const detailLine =
    product.diamonds && hasBonus
      ? `${product.diamonds} diamantes + ${product.bonus} bono`
      : product.description || (product.badge ? product.badge : "Entrega inmediata");

  const maxLine = product.maxPerPurchase ? `Máximo por compra: ${product.maxPerPurchase} uds.` : "";

  const priceBlock = hasDiscount
    ? `<span class="pack-card__price--strike">${formatPrice(product.price)}</span><span class="pack-card__price">${formatPrice(product.discountPrice)}</span>`
    : `<span class="pack-card__price">${formatPrice(product.price)}</span>`;

  const buyBtn = outOfStock
    ? `<button type="button" class="btn-primary pack-card__buy text-sm px-4 py-3 rounded-full" disabled>Sin stock</button>`
    : `<button type="button" class="js-buy-btn btn-primary pack-card__buy text-sm px-4 py-3 rounded-full" data-product-index="${index}">Comprar</button>`;

  return `
    <article class="gem-card pack-card glass glow-border relative${outOfStock ? " pack-card--oos" : ""}" data-aos="fade-up">
      ${outOfStock ? `<span class="stock-badge">Sin stock</span>` : ""}
      <div class="pack-card__media">${img}</div>
      <div class="pack-card__body">
        <h3 class="pack-card__title">${title}</h3>
        <p class="pack-card__detail">${detailLine}</p>
        ${maxLine ? `<p class="pack-card__max">${maxLine}</p>` : ""}
        <div class="pack-card__price-row">${priceBlock}</div>
        ${buyBtn}
      </div>
    </article>`;
}

// Tarjeta para productos "por cantidad" (Tokens, Cajas, etc.): el
// cliente elige cuánto quiere comprar con un selector +/- que avanza
// de a `stepSize` unidades, y el precio se recalcula en vivo como
// (cantidad / stepSize) * stepPrice.
function quantityCardTemplate(product, index) {
  const img = product.image
    ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
    : `<div class="w-full h-full flex items-center justify-center">${DIAMOND_PLACEHOLDER_SVG}</div>`;

  const step = Number(product.stepSize) || 1;
  const min = Math.max(step, Number(product.minSteps) > 0 ? Number(product.minSteps) * step : step);
  const max = product.maxSteps ? Number(product.maxSteps) * step : null;
  const unitPrice = Number(product.stepPrice) || 0;
  const unitName = product.unitName || product.name;
  const outOfStock = product.inStock === false;

  const detailLine = product.badge || product.description || `${formatPrice(unitPrice)} cada uno · de ${step} en ${step}`;

  const buyBtn = outOfStock
    ? `<button type="button" class="btn-primary pack-card__buy text-sm px-4 py-3 rounded-full" disabled>Sin stock</button>`
    : `<button type="button" class="js-qty-buy btn-primary pack-card__buy text-sm px-4 py-3 rounded-full">Comprar</button>`;

  return `
    <article class="gem-card pack-card glass glow-border relative${outOfStock ? " pack-card--oos" : ""}"
             data-aos="fade-up" data-qty-card data-step="${step}" data-min="${min}" data-max="${max ?? ""}"
             data-unit-price="${unitPrice}" data-unit="${escapeHtml(unitName)}">
      ${outOfStock ? `<span class="stock-badge">Sin stock</span>` : ""}
      <div class="pack-card__media">${img}</div>
      <div class="pack-card__body">
        <h3 class="pack-card__title">${unitName.toUpperCase()}</h3>
        <p class="pack-card__detail">${detailLine}</p>
        <div class="qty-row">
          <button type="button" class="qty-btn js-qty-minus" ${outOfStock ? "disabled" : ""} aria-label="Restar">−</button>
          <span class="qty-value js-qty-value">${min}</span>
          <button type="button" class="qty-btn js-qty-plus" ${outOfStock ? "disabled" : ""} aria-label="Sumar">+</button>
        </div>
        <div class="pack-card__price-row"><span class="pack-card__price js-qty-price">${formatPrice(min * unitPrice)}</span></div>
        ${buyBtn}
      </div>
    </article>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function renderProducts() {
  const grid = $("#products-grid");
  if (!grid) return;

  const visible = PRODUCTS.filter((p) => p.visible !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!visible.length) {
    grid.innerHTML = `<p class="col-span-full text-center text-[var(--c-gray-soft)]">Pronto vamos a agregar productos. ¡Volvé más tarde!</p>`;
    return;
  }

  // Guardamos el índice real (dentro de PRODUCTS) en cada tarjeta para
  // poder recuperar el producto elegido cuando se abra el checkout.
  grid.innerHTML = visible
    .map((product) => productCardTemplate(product, PRODUCTS.indexOf(product)))
    .join("");

  $$(".js-buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = PRODUCTS[Number(btn.dataset.productIndex)];
      if (product) openCheckout(product);
    });
  });

  bindQuantityCards(grid);
}

// Engancha los selectores +/- de las tarjetas "por cantidad" (Tokens,
// Cajas, etc.): cada tarjeta guarda su propio estado en el DOM
// (data-step / data-min / data-max) para no depender de un índice
// global que se rompería si la grilla se vuelve a renderizar.
function bindQuantityCards(scope) {
  scope.querySelectorAll("[data-qty-card]").forEach((card) => {
    const step = Number(card.dataset.step) || 1;
    const min = Number(card.dataset.min) || step;
    const max = card.dataset.max ? Number(card.dataset.max) : null;
    const unitPrice = Number(card.dataset.unitPrice) || 0;
    const unit = card.dataset.unit || "";
    const valueEl = card.querySelector(".js-qty-value");
    const priceEl = card.querySelector(".js-qty-price");
    let qty = min;

    const updateUI = () => {
      valueEl.textContent = qty;
      priceEl.textContent = formatPrice(qty * unitPrice);
    };

    card.querySelector(".js-qty-minus")?.addEventListener("click", () => {
      if (qty - step >= min) {
        qty -= step;
        updateUI();
      }
    });

    card.querySelector(".js-qty-plus")?.addEventListener("click", () => {
      if (max == null || qty + step <= max) {
        qty += step;
        updateUI();
      }
    });

    card.querySelector(".js-qty-buy")?.addEventListener("click", () => {
      openCheckout({
        name: `${qty} ${unit}`,
        price: qty * unitPrice,
        discountPrice: null,
      });
    });
  });
}

// Se suscribe a la colección "products" de Firestore (precios de la
// tienda) y vuelve a renderizar la grilla cada vez que admin.html
// guarda un cambio, sin que el visitante tenga que recargar la
// página.
function subscribeProducts() {
  const grid = $("#products-grid");
  const q = query(collection(db, "products"), orderBy("order"));
  onSnapshot(
    q,
    (snap) => {
      PRODUCTS = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      renderProducts();
    },
    (err) => {
      console.error("Error al cargar productos:", err);
      if (grid) {
        grid.innerHTML = `<p class="col-span-full text-center text-[var(--c-gray-soft)]">No pudimos cargar los productos. Probá recargar la página.</p>`;
      }
    }
  );
}

/* ================= RENDER: REDES SOCIALES ================= */

function renderSocials() {
  const map = { instagram: "#link-instagram", whatsapp: "#link-whatsapp" };
  Object.entries(map).forEach(([key, sel]) => {
    $$(sel).forEach((el) => {
      if (SOCIALS[key]) el.href = SOCIALS[key];
    });
  });
}

/* ================= RENDER: COMUNIDAD DE WHATSAPP ================= */

function renderCommunity() {
  $$(".js-community-desc").forEach((el) => (el.textContent = COMMUNITY.description));
  $$(".js-community-main").forEach((el) => (el.href = COMMUNITY.mainGroupUrl));
  $$(".js-community-channel").forEach((el) => (el.href = COMMUNITY.channelUrl));

  const wrap = $("#community-groups");
  if (wrap && COMMUNITY.groups?.length) {
    wrap.innerHTML = COMMUNITY.groups
      .map(
        (g) => `
      <a href="${g.url}" target="_blank" rel="noopener"
         class="glass glow-border rounded-lg px-4 py-3 text-sm text-center text-gray-300 hover:text-electric transition-colors">
        ${g.label}
      </a>`
      )
      .join("");
  }
}

function bindGroupPopup() {
  const modal = $("#group-modal");
  if (!modal) return;

  const close = () => (modal.hidden = true);
  $$(".js-group-modal-close").forEach((btn) => btn.addEventListener("click", close));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // Se muestra una vez por sesión, sin molestar en cada recarga de página.
  if (!sessionStorage.getItem("ss_group_popup_shown")) {
    setTimeout(() => {
      modal.hidden = false;
      sessionStorage.setItem("ss_group_popup_shown", "1");
    }, 2500);
  }
}

/* ================= CHECKOUT: PASO 1 (UID + NICK) → PASO 2 (NARANJA X) ================= */

let checkoutProduct = null;
let checkoutBuyer = null;

function renderNaranjaXData() {
  $$(".js-pay-holder").forEach((el) => (el.textContent = PAYMENT_DATA.holder));
  $$(".js-pay-alias").forEach((el) => (el.textContent = PAYMENT_DATA.alias));
  $$(".js-pay-cvu").forEach((el) => (el.textContent = PAYMENT_DATA.cvu));
}

// Se suscribe a settings/payment en Firestore. Si el admin todavía no
// guardó nada desde el panel, se sigue mostrando el valor de config.js.
function subscribePayment() {
  onSnapshot(doc(db, "settings", "payment"), (snap) => {
    PAYMENT_DATA = snap.exists() ? snap.data() : NARANJAX;
    renderNaranjaXData();
  });
}

function openCheckout(product) {
  checkoutProduct = product;
  checkoutBuyer = null;

  const modal = $("#checkout-modal");
  const step1 = $("#checkout-step-1");
  const step2 = $("#checkout-step-2");
  if (!modal || !step1 || !step2) return;

  const summary = `${product.name} — ${formatPrice(finalPrice(product))}`;
  $("#checkout-product-summary").textContent = summary;
  $("#checkout-product-summary-2").textContent = summary;

  $("#checkout-form")?.reset();
  step1.hidden = false;
  step2.hidden = true;
  modal.hidden = false;
}

function closeCheckout() {
  const modal = $("#checkout-modal");
  if (modal) modal.hidden = true;
  checkoutProduct = null;
  checkoutBuyer = null;
}

function bindCheckout() {
  const modal = $("#checkout-modal");
  const step1 = $("#checkout-step-1");
  const step2 = $("#checkout-step-2");
  const form = $("#checkout-form");
  if (!modal || !form) return;

  $$(".js-checkout-close").forEach((btn) => btn.addEventListener("click", closeCheckout));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeCheckout();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const uid = $("#checkout-uid")?.value.trim();
    const nickname = $("#checkout-nickname")?.value.trim();
    if (!uid || !nickname) return;

    checkoutBuyer = { uid, nickname };
    step1.hidden = true;
    step2.hidden = false;
  });

  $("#checkout-back")?.addEventListener("click", () => {
    step2.hidden = true;
    step1.hidden = false;
  });

  $("#checkout-send-whatsapp")?.addEventListener("click", () => {
    if (!checkoutProduct || !checkoutBuyer) return;
    // Evento de Analytics: se dispara cuando alguien completa el
    // checkout y va a mandar el comprobante por WhatsApp. Es la señal
    // más cercana a una "intención de compra" que podemos medir sin
    // backend (la venta se confirma manualmente por WhatsApp).
    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        currency: "ARS",
        value: finalPrice(checkoutProduct),
        item_name: checkoutProduct.name,
      });
    }
    window.open(buildWhatsappLink(checkoutProduct, checkoutBuyer), "_blank", "noopener");
    closeCheckout();
  });
}

function bindCopyButtons() {
  $$(".js-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetSel = btn.dataset.copyTarget;
      const text = $(targetSel)?.textContent?.trim();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      showToast("Copiado");
      btn.classList.add("copied");
      setTimeout(() => btn.classList.remove("copied"), 1200);
    });
  });
}

/* ================= INTERACCIÓN: MENÚ MÓVIL ================= */

function bindMobileMenu() {
  const toggle = $("#menu-toggle");
  const menu = $("#mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menu.style.maxHeight = isOpen ? menu.scrollHeight + "px" : "0px";
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  $$("#mobile-menu a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      menu.style.maxHeight = "0px";
    })
  );
}

/* ================= MANTENIMIENTO ================= */

// Se activa/desactiva desde admin.html → pestaña "Mantenimiento", sin
// tocar código. Mientras está activa, tapa todo el sitio con una
// pantalla propia; el resto de la página sigue existiendo debajo
// pero queda inaccesible (scroll bloqueado).
function showMaintenanceOverlay(message) {
  let overlay = $("#maintenance-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "maintenance-overlay";
    overlay.innerHTML = `
      <div class="glass glow-border maintenance-card">
        <img src="${SETTINGS.logoUrl}" alt="${SETTINGS.storeName}" class="maintenance-logo" />
        <h1>Estamos en mantenimiento</h1>
        <p id="maintenance-message"></p>
      </div>`;
    document.body.appendChild(overlay);
  }
  $("#maintenance-message").textContent =
    message || "Estamos haciendo mejoras. Volvemos en breve, ¡gracias por tu paciencia!";
  document.body.classList.add("maintenance-active");
}

function hideMaintenanceOverlay() {
  $("#maintenance-overlay")?.remove();
  document.body.classList.remove("maintenance-active");
}

function subscribeMaintenance() {
  onSnapshot(doc(db, "settings", "maintenance"), (snap) => {
    const data = snap.exists() ? snap.data() : { active: false };
    if (data.active) {
      showMaintenanceOverlay(data.message);
    } else {
      hideMaintenanceOverlay();
    }
  });
}

/* ================= INIT ================= */

function init() {
  bindMobileMenu();
  bindCopyButtons();
  bindCheckout();
  bindGroupPopup();
  initParticles("particles-canvas");

  renderBrand();
  renderBanner();
  renderSocials();
  renderCommunity();
  renderNaranjaXData();
  subscribePayment();
  subscribeProducts();
  subscribeMaintenance();

  $$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

  if (window.AOS) {
    const isMobile = window.innerWidth < 768;
    window.AOS.init({
      once: true,
      duration: isMobile ? 450 : 700,
      easing: "ease-out-cubic",
      offset: isMobile ? 40 : 80,
      disableMutationObserver: false,
    });
  }

  if (window.gsap) {
    gsap.from("#productos .text-center", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out" });
  }

  document.body.classList.remove("opacity-0");
}

document.addEventListener("DOMContentLoaded", init);
