# Cantoral — Parroquia San Juan Bautista, Urda

Cancionero litúrgico con acordes. App web responsive e instalable (PWA) que
**funciona sin internet** tras abrirla una vez.

## Estructura
- `index.html` — la aplicación (plantilla + lógica).
- `support.js` — motor de render (usa React/Babel locales en `vendor/`).
- `vendor/` — React, ReactDOM y Babel (copias locales, sin CDN).
- `assets/` — imágenes, `fonts.css` y tipografías en `assets/fonts/`.
- `icons/` — iconos de la app.
- `manifest.json` + `service-worker.js` — capa PWA (instalable + offline).

## Publicar
Es un sitio estático: sirve la carpeta tal cual (Vercel, Netlify, GitHub Pages…).
No requiere build.
