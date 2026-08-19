# Settings Store 💎

Sitio web para venta de diamantes de Free Fire. HTML5 + CSS3 +
JavaScript vanilla (ES6) + Tailwind CSS (CDN), sin build step. Usa
**Firebase** (Firestore + Auth + Storage) solo para lo que necesita
actualizarse en vivo sin volver a publicar el sitio: el acceso de
revendedores, el catálogo y precios, las imágenes de producto, los
datos bancarios y las estadísticas de ventas. No hay pasarela de
pago ni entrega automática — los pedidos se coordinan por WhatsApp
como siempre.

```
/
├── index.html          → todo el sitio
├── admin.html            → panel de administración (login con Firebase Auth)
├── revendedores.html      → acceso y catálogo con precios de revendedor
├── terminos.html          → términos y condiciones
├── privacidad.html         → política de privacidad
├── firebase-init.js        → configuración central de Firebase (Firestore/Auth/Storage)
├── firestore.rules         → reglas de seguridad de Firestore
├── storage.rules            → reglas de seguridad de Storage (imágenes de producto)
├── styles.css              → diseño (tokens, glassmorphism, glow)
├── app.js                    → renderiza el contenido de index.html
├── config.js                 → ⭐ contenido fijo de la tienda (nombre, banner, redes, etc.)
├── particles.js               → fondo de partículas del Hero
├── logo.svg / logo.png          → logo propio
├── robots.txt / sitemap.xml
└── README.md
```

---

## 1. Editar el contenido de la tienda

Hay dos lugares distintos según qué quieras cambiar:

### a) Lo que se edita en `config.js` (código, sin login)

- **SETTINGS** → nombre de la tienda, logo, número de WhatsApp
- **BANNER** → título, subtítulo, texto del Hero y foto de fondo opcional
- **SOCIALS** → links de Instagram y WhatsApp
- **COMMUNITY** → link de la comunidad principal, del canal, y de los grupos temáticos (pop-up + sección "Comunidad")
- **NARANJAX** → titular/alias/CVU de *respaldo*, solo se usan hasta el primer guardado desde el panel (ver más abajo)

### b) Lo que se edita en `admin.html` (con tu cuenta, sin tocar código)

- **Productos y precios**: alta, baja, edición, precio tienda vs.
  precio revendedor, subida de imágenes.
- **Datos de pago**: titular, alias y CVU/CBU reales que ve el
  comprador en el paso 2 del checkout.
- **Revendedores**: código de acceso y quién está registrado/en línea.
- **Ventas revendedores**: pedidos por revendedor (hoy/semana/mes/total).

Ver el punto 6.1 más abajo para el detalle de cada pestaña del panel.

### Logo y fondo del Hero

`logo.png` y `hero-bg-mobile.jpg` / `hero-bg-desktop.jpg` son las
artes que subiste. El logo se usa en el header, el logo grande del
Hero y el pop-up de la comunidad; los fondos se usan en el Hero
completo (uno para celular, otro para pantallas más grandes). Para
cambiarlos más adelante, reemplazá esos mismos archivos por otros
(mismo nombre) o cambiá las rutas en `SETTINGS.logoUrl` /
`BANNER.imageUrlMobile` / `BANNER.imageUrlDesktop`.

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
2. **Paso 2**: le muestra el titular, alias y CVU/CBU cargados desde
   `admin.html` → "Datos de pago" (con respaldo en `NARANJAX` de
   `config.js` si todavía no guardaste nada), con botones para copiar
   cada dato. Al tocar "Ya transferí, enviar comprobante" se abre
   WhatsApp (`https://wa.me/`) con un mensaje pre-cargado que incluye
   el producto, el precio, el UID y el nickname, usando el número de
   `SETTINGS.whatsappNumber`. Si el pedido viene de `revendedores.html`,
   además queda registrado para las estadísticas de ventas del panel.

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

## 6.1 Panel de administración (admin.html)

Desde `admin.html` (con tu cuenta de Firebase Auth) podés manejar todo
sin tocar código:

- **Revendedores**: código de acceso, quién está en línea y quién se
  registró.
- **Ventas revendedores**: cuántos pedidos hizo cada revendedor hoy,
  esta semana, este mes y en total, más el monto vendido. Se arma solo
  a partir de cada pedido que un revendedor confirma en el paso 2 del
  checkout de `/revendedores.html`.
- **Productos y precios**: alta, baja y edición de productos, precio
  tienda y precio revendedor por separado, y **subida de imágenes**
  directamente desde tu computadora (se guardan en Firebase Storage,
  ya no hace falta subirlas al repo de GitHub). Tamaño recomendado:
  foto cuadrada (1:1) o 4:3, mínimo 800×800 px, formato JPG o WEBP,
  menos de 500 KB.
- **Datos de pago**: titular, alias y CVU/CBU que se le muestran al
  comprador en el paso 2 del checkout. Se actualiza al instante en el
  sitio.

Para que la subida de imágenes funcione hace falta habilitar
**Firebase Storage** en la consola del proyecto (Build → Storage →
Get started) y desplegar las reglas de `storage.rules` de este
repositorio (`firebase deploy --only storage`), igual que ya hacés con
`firestore.rules`.

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
