/**
 * config.js   
 * ------------------------------------------------------------------
 * ÚNICO ARCHIVO QUE NECESITÁS EDITAR para actualizar la tienda:
 * productos, banner, redes sociales y datos bancarios.
 *
 * ------------------------------------------------------------------
 */

export const SETTINGS = {
  storeName: "Settings Store",
  // Logo propio (fondo transparente). Si más adelante querés cambiarlo,
  // reemplazá el archivo logo.png (o cambiá esta ruta) — se usa
  // en el header, el logo grande del Hero y el pop-up de la comunidad.
  logoUrl: "logo.png",
  whatsappNumber: "5493455286371", // solo números, con código de país (54 = Argentina)
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
  whatsapp: "https://wa.me/5493455286371",
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
 */
export const NARANJAX = {
  holder: "Jonathan Jehova Lagunas Arrieta",
  alias: "settings77",
  cvu: "4530000800010888788882",
};

/**
 * PRODUCTOS
 * ------------------------------------------------------------------
 * Para agregar un producto, copiá un bloque { ... } y pegalo antes
 * del cierre del array (agregá una coma después del bloque anterior).
 *
 * - order: define la posición en la grilla (menor = primero)
 * - visible: poné "false" para ocultar un producto sin borrarlo
 * - image: dejalo vacío ("") si todavía no tenés foto del paquete
 */
export const PRODUCTS = [
  {
    name: "110 Diamantes",
    diamonds: 110,
    price: 1300,
    image: "product-110.jpg",
    order: 1,
    visible: true,
  },
  {
    name: "341 Diamantes",
    diamonds: 341,
    price: 3800,
    image: "product-341.jpg",
    order: 2,
    visible: true,
  },
  {
    name: "572 Diamantes",
    diamonds: 572,
    price: 6000,
    image: "product-572.jpg",
    order: 3,
    visible: true,
  },
  {
    name: "1.166 Diamantes",
    diamonds: 1166,
    price: 11800,
    image: "product-1166.jpg",
    order: 4,
    visible: true,
  },
  {
    name: "2.398 Diamantes",
    diamonds: 2398,
    price: 22000,
    image: "product-2398.jpg",
    order: 5,
    visible: true,
  },
  {
    name: "6.160 Diamantes",
    diamonds: 6160,
    price: 56500,
    image: "product-6160.jpg",
    order: 6,
    visible: true,
  },
  {
    name: "Pase Booyah",
    diamonds: 0, // no aplica: es un pase, no diamantes sueltos
    badge: "PASE", // se muestra en vez de "X 💎" cuando diamonds es 0
    price: 2800,
    image: "product-booyah.jpg",
    order: 7,
    visible: true,
  },
];
