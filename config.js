/**
 * config.js
 * ------------------------------------------------------------------
 * ÚNICO ARCHIVO QUE NECESITÁS EDITAR para actualizar la tienda:
 * productos, banner, redes sociales y datos bancarios.
 * ------------------------------------------------------------------
 */

export const SETTINGS = {
  storeName: "Settings Store",
  // Logo propio (fondo transparente). Si más adelante querés cambiarlo,
  // reemplazá el archivo logo.png (o cambiá esta ruta) — se usa
  // en el header, el logo grande del Hero y el pop-up de la comunidad.
  logoUrl: "logo.png",
  whatsappNumber: "5493454309950", // solo números, con código de país (54 = Argentina)
};

export const BANNER = {
  title: "Settings Store",
  subtitle: "Diamantes Free Fire",
  text: "Entrega inmediata · +3 años de experiencia",
  // Fotos de fondo del Hero. Se elige una según el tamaño de pantalla:
  // imageUrlMobile en celulares y imageUrlDesktop en pantallas más
  // grandes. Para cambiarlas, reemplazá los archivos o estas rutas.
  imageUrlMobile: "hero-bg-mobile.jpg",
  imageUrlDesktop: "hero-bg-desktop.jpg",
};

export const SOCIALS = {
  instagram: "https://instagram.com/settingsstore",
  whatsapp: "https://wa.me/5493454309950",
};

/**
 * COMUNIDAD DE WHATSAPP
 * ------------------------------------------------------------------
 * - mainGroupUrl / channelUrl → los dos accesos principales (se usan
 *   en el pop-up de bienvenida y en la sección "Comunidad").
 * - groups → grupos temáticos puntuales (recargas, compra y venta,
 *   diamantes). Agregá o sacá bloques según necesites.
 */
export const COMMUNITY = {
  description:
    "Recargas de diamantes, Pase Booyah, tokens, cajas, cuentas premium y servicios para redes sociales. +20.000 referencias reales y +3 años en el mercado.",
  mainGroupUrl: "https://chat.whatsapp.com/KVHQnrqLJfZGUWk5I6ATKC?s=cl&p=a&ilr=1",
  channelUrl: "https://whatsapp.com/channel/0029VbDCn6i17Emtd3Z5eM28",
  groups: [
    {
      label: "Grupo oficial de recargas",
      url: "https://chat.whatsapp.com/DXLnt4nf6MZ3NK6z14vTFB?s=cl&p=a&ilr=1",
    },
    {
      label: "Compra y venta",
      url: "https://chat.whatsapp.com/EO1yP8w3TiG9xO7ubeWSe8?s=cl&p=a&ilr=1",
    },
    {
      label: "Grupo de diamantes",
      url: "https://chat.whatsapp.com/EjxyTmWCJHHHvaLktqS4eI?s=cl&p=a&ilr=1",
    },
  ],
};

/**
 * NARANJA X
 * ------------------------------------------------------------------
 * Estos datos YA NO se muestran en la página principal. Se le
 * entregan al comprador recién en el paso 2 del formulario de compra,
 * después de que carga su ID y nombre de jugador.
 *
 * IMPORTANTE: esto ahora es solo el valor de RESPALDO inicial. El
 * titular/alias/CVU reales se editan desde admin.html → pestaña
 * "Datos de pago" (quedan guardados en Firestore) y se actualizan en
 * vivo en la web sin tocar este archivo. Estos valores de acá solo se
 * usan si todavía no se guardó nada desde el panel.
 */
export const NARANJAX = {
  holder: "Jonathan Jehova Lagunas Arrieta",
  alias: "settings88",
  cvu: "4530000800010888788882",
};

/**
 * ALIAS PARA REVENDEDORES
 * ------------------------------------------------------------------
 * Igual que NARANJAX, pero para /revendedores.html. Vive por separado
 * a propósito: así el alias que ve un comprador normal y el que ve un
 * revendedor NUNCA se mezclan, aunque los dos se editen (por
 * separado) desde admin.html → pestaña "Datos de pago".
 *
 * Este bloque es solo el valor de RESPALDO inicial. El real se edita
 * desde el panel y queda guardado en Firestore (settings/paymentReseller).
 */
export const NARANJAX_RESELLER = {
  holder: "Jonathan Jehova Lagunas Arrieta",
  alias: "settings88-rev",
  cvu: "4530000800010888788882",
};

/**
 * ALIAS PARA REVENDEDORES — MODALIDAD "STOCK"
 * ------------------------------------------------------------------
 * Datos de pago que se muestran SOLO cuando un revendedor compra desde
 * el apartado "Stock" (productos de carga limitada, una unidad por
 * carga según disponibilidad). Viven por separado del alias de
 * "Ilimitado" (NARANJAX_RESELLER de arriba), así nunca se mezclan.
 *
 * Este bloque es solo el valor de RESPALDO inicial. El real se edita
 * desde admin.html → pestaña "Datos de pago" → sección "Revendedores
 * — Stock" y queda guardado en Firestore (settings/paymentResellerStock).
 */
export const NARANJAX_RESELLER_STOCK = {
  holder: "Andrés Velozo",
  alias: "recargas22",
  cvu: "",
  note: "Todo por ID",
};

/**
 * PRODUCTOS Y PRECIOS
 * ------------------------------------------------------------------
 * Los productos y sus precios YA NO viven acá. Ahora están en
 * Firestore, en dos lugares separados para que el precio de la
 * tienda y el de revendedores nunca se mezclen:
 *
 *   - colección "products"        → catálogo + precio de la TIENDA
 *   - colección "resellerPricing" → precio de REVENDEDORES (mismo ID
 *                                    que el producto correspondiente)
 *
 * Para agregar productos, cambiar precios o activar descuentos
 * (tanto de tienda como de revendedores), entrá a admin.html con tu
 * cuenta de admin → pestaña "Productos". No hace falta tocar código
 * ni volver a publicar el sitio: los cambios se ven al instante.
 */
