# Settings Store 💎 (versión simple, sin Firebase)

Sitio web para venta de diamantes de Free Fire. Solo HTML5 + CSS3 +
JavaScript vanilla (ES6) + Tailwind CSS (CDN). Sin backend, sin base de
datos, sin login, sin API de pagos — el catálogo, los datos bancarios y
las redes sociales viven en un solo archivo de configuración. Los
pedidos se coordinan por WhatsApp.

```
/
├── index.html          → todo el sitio
├── terminos.html        → términos y condiciones
├── privacidad.html       → política de privacidad
├── css/styles.css       → diseño (tokens, glassmorphism, glow)
├── js/app.js             → renderiza el contenido en la página
├── js/config.js          → ⭐ ÚNICO archivo que editás para actualizar la tienda
├── js/particles.js       → fondo de partículas del Hero
├── assets/logo.svg       → logo vectorial propio
├── robots.txt / sitemap.xml
└── README.md
```

---

## 1. Editar el contenido de la tienda

Abrí `js/config.js`. Ahí está todo:

- **SETTINGS** → nombre de la tienda, logo, número de WhatsApp
- **BANNER** → título, subtítulo, texto del Hero y foto de fondo opcional
- **SOCIALS** → links de Instagram y WhatsApp
- **COMMUNITY** → link de la comunidad principal, del canal, y de los grupos temáticos (pop-up + sección "Comunidad")
- **MERCADOPAGO** → titular, alias y CBU (se muestran recién en el paso 2 del checkout, nunca en la página principal)
- **PRODUCTS** → un array con cada paquete de diamantes (y el Pase Booyah)

### Logo y fondo del Hero

`assets/logo.jpg` y `assets/hero-bg.jpg` son las artes que subiste. El
logo se usa en el header, el logo grande del Hero y el pop-up de la
comunidad; el fondo se usa como imagen del Hero completo. Para
cambiarlos más adelante, reemplazá esos mismos archivos por otros
(mismo nombre) o cambiá las rutas en `SETTINGS.logoUrl` /
`BANNER.imageUrl`.

Para agregar un producto nuevo, copiá un bloque `{ ... }` dentro del
array `PRODUCTS` y cambiá los valores. Para ocultar uno sin borrarlo,
poné `visible: false`. El campo `order` define en qué posición aparece
(menor número = primero).

No hace falta ninguna cuenta, API key ni configuración adicional —
es JavaScript plano.

---

## 2. Probar en tu computadora

Como el sitio usa módulos ES6 (`type="module"`), no podés abrir
`index.html` con doble clic — necesitás un servidor local simple:

```bash
npx serve .
# o
python3 -m http.server 8080
```

Y entrás a `http://localhost:8080`.

---

## 3. Publicar gratis en GitHub Pages

1. Creá un repositorio en GitHub y subí todo el contenido de esta carpeta.
2. Andá a **Settings → Pages**.
3. En "Build and deployment", elegí **Deploy from a branch**, rama `main`, carpeta `/root`.
4. Guardá. En un par de minutos tu sitio va a estar en:
   `https://tu-usuario.github.io/tu-repositorio/`
5. Actualizá `canonical` (en `index.html`) y `sitemap.xml` con esa URL real.

---

## 4. Cómo funciona el botón "Comprar"

Abre un formulario en 2 pasos (no procesa pagos, solo ordena la
coordinación manual):

1. **Paso 1**: le pide al comprador su ID de jugador (UID) y su
   nickname.
2. **Paso 2**: le muestra el alias y CBU de Mercado Pago (`MERCADOPAGO`
   en `config.js`), con botones para copiar cada dato. Al tocar
   "Ya transferí, enviar comprobante" se abre WhatsApp
   (`https://wa.me/`) con un mensaje pre-cargado que incluye el
   producto, el precio, el UID y el nickname, usando el número de
   `SETTINGS.whatsappNumber`.

## 5. Comunidad de WhatsApp

A los pocos segundos de entrar al sitio aparece un pop-up invitando a
unirse a la comunidad (`COMMUNITY.mainGroupUrl`) o a seguir el canal
(`COMMUNITY.channelUrl`), una sola vez por sesión. Más abajo en la
página queda una sección fija "Comunidad" con esos mismos accesos y
los grupos temáticos puntuales (`COMMUNITY.groups`: recargas, compra
y venta, diamantes) para quien cierre el pop-up y quiera unirse más
tarde.

## 6. Términos y privacidad

`terminos.html` y `privacidad.html` son dos páginas simples, con el
mismo estilo del sitio, enlazadas desde el pie de página. Son un
punto de partida razonable para una tienda chica que coordina todo
por WhatsApp, pero no reemplazan una revisión legal: si querés, hacé
que un abogado las revise antes de tomarlas como definitivas,
sobre todo la política de reembolsos.

---

## 7. Próximos pasos (cuando quieras sumarlos)

Este proyecto está pensado para poder crecer sin rehacer nada desde
cero:

- **Dominio propio**: comprás el dominio y lo apuntás a GitHub Pages
  (o a donde termines alojando el sitio) desde el panel de tu proveedor.
- **API de pagos** (Mercado Pago, etc.): esto va a requerir un pequeño
  backend (por ejemplo una función serverless en Vercel o Netlify,
  gratis y sin tarjeta) porque las claves de pago no pueden vivir en
  el código público del sitio.
- **API de preparación/entrega automática de producto**: si en algún
  momento conseguís acceso a una API mayorista de recargas, se conecta
  desde ese mismo backend, y ahí sí tendría sentido retomar algo como
  el panel de administración que armamos antes.

Avisame cuando quieras sumar cualquiera de estos y lo construimos
sobre esta misma base.

---

## 8. Notas técnicas

- **Sin frameworks**: HTML/CSS/JS puro + Tailwind por CDN.
- **Animaciones**: AOS (scroll reveal) y GSAP (entrada del Hero), por CDN.
- **Diseño**: negro (`#050505`) + azul eléctrico (`#00A8FF`), glassmorphism,
  bordes con glow, tarjetas con corte de diamante (`.gem-card`) como
  elemento de identidad visual propio.
- **Rendimiento**: `loading="lazy"` en imágenes de producto, código
  modular por archivo, sin dependencias innecesarias.
- **Accesibilidad**: foco visible, `prefers-reduced-motion` respetado.
