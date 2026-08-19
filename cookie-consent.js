/**
 * COOKIE-CONSENT.JS
 * ------------------------------------------------------------------
 * Banner de cookies + Google Consent Mode v2 para Settings Store.
 *
 * Se incluye ANTES del script de gtag.js en cada página que carga
 * Google Analytics (por ahora: index.html y terminos.html). Hace dos
 * cosas:
 *
 * 1. Define el consentimiento por defecto de Analytics como
 *    "denegado" hasta que la persona decida, o lo deja como estaba
 *    guardado de una visita anterior. Esto es lo que pide Google
 *    (Consent Mode v2) para poder seguir usando gtag/Analytics de
 *    forma correcta.
 * 2. Si todavía no decidió nada, muestra un banner simple para
 *    aceptar o rechazar. La decisión queda guardada en localStorage
 *    (clave "cookie_consent") y no se vuelve a preguntar.
 *
 * No junta datos de fingerprinting ni nada por el estilo: solo
 * prende/apaga Analytics según la respuesta.
 */
(function () {
  var STORAGE_KEY = "cookie_consent"; // "accepted" | "rejected"
  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* localStorage bloqueado (modo privado, etc.) — seguimos sin banner */
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  gtag("consent", "default", {
    analytics_storage: saved === "accepted" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (saved) return; // ya había decidido antes, no mostramos el banner de nuevo

  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.createElement("div");
    bar.id = "cookie-banner";
    bar.innerHTML =
      '<div class="cookie-banner-inner glass-strong">' +
      "<p>Usamos cookies propias y de Google Analytics para entender cómo se " +
      "usa el sitio, y almacenamiento del navegador para mantener tu sesión " +
      "iniciada. Podés aceptarlas " +
      'o rechazarlas. Más info en la <a href="privacidad.html">Política de privacidad</a>.</p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" id="cookie-reject" class="cookie-btn-ghost">Rechazar</button>' +
      '<button type="button" id="cookie-accept" class="cookie-btn-solid">Aceptar</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(bar);

    document.getElementById("cookie-accept").addEventListener("click", function () {
      try {
        localStorage.setItem(STORAGE_KEY, "accepted");
      } catch (e) {}
      gtag("consent", "update", { analytics_storage: "granted" });
      bar.remove();
    });

    document.getElementById("cookie-reject").addEventListener("click", function () {
      try {
        localStorage.setItem(STORAGE_KEY, "rejected");
      } catch (e) {}
      gtag("consent", "update", { analytics_storage: "denied" });
      bar.remove();
    });
  });
})();
