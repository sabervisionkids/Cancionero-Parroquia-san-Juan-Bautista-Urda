/* Cantoral — Service Worker. Cachea toda la app para funcionar SIN internet.
   Sube CACHE_VERSION cuando cambies archivos para forzar actualización. */
const CACHE = 'cantoral-v7';
const CORE = [
  "index.html",
  "manifest.json",
  "support.js?v=2",
  "assets/fonts.css?v=2",
  "vendor/react.production.min.js",
  "vendor/react-dom.production.min.js",
  "vendor/babel.min.js",
  "vendor/qrcode.min.js",
  "assets/portada-w.jpg",
  "assets/papel-w.jpg",
  "assets/escudo-w.png",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "assets/fonts/Amaranth-400-italic-latin.woff2",
  "assets/fonts/Amaranth-400-normal-latin.woff2",
  "assets/fonts/Amaranth-700-italic-latin.woff2",
  "assets/fonts/Amaranth-700-normal-latin.woff2",
  "assets/fonts/EBGaramond-400-italic-latin-ext.woff2",
  "assets/fonts/EBGaramond-400-italic-latin.woff2",
  "assets/fonts/EBGaramond-400-normal-latin-ext.woff2",
  "assets/fonts/EBGaramond-400-normal-latin.woff2",
  "assets/fonts/EBGaramond-700-italic-latin-ext.woff2",
  "assets/fonts/EBGaramond-700-italic-latin.woff2",
  "assets/fonts/EBGaramond-700-normal-latin-ext.woff2",
  "assets/fonts/EBGaramond-700-normal-latin.woff2",
  "assets/fonts/PlayfairDisplay-400-italic-latin-ext.woff2",
  "assets/fonts/PlayfairDisplay-400-italic-latin.woff2",
  "assets/fonts/PlayfairDisplay-400-normal-latin-ext.woff2",
  "assets/fonts/PlayfairDisplay-400-normal-latin.woff2",
  "assets/fonts/PlayfairDisplay-700-italic-latin-ext.woff2",
  "assets/fonts/PlayfairDisplay-700-italic-latin.woff2",
  "assets/fonts/PlayfairDisplay-700-normal-latin-ext.woff2",
  "assets/fonts/PlayfairDisplay-700-normal-latin.woff2",
  "assets/fonts/PlayfairDisplay-900-normal-latin-ext.woff2",
  "assets/fonts/PlayfairDisplay-900-normal-latin.woff2",
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // solo mismo origen (YouTube, etc. van directos)

  // HTML / navegación: RED primero (para recibir actualizaciones al publicar cambios),
  // y caché como respaldo cuando no hay internet.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('index.html', copy));
        return res;
      }).catch(() => caches.match('index.html'))
    );
    return;
  }

  // Resto de recursos: CACHÉ primero (rápido y offline). Lo no cacheado se guarda al vuelo.
  e.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => Response.error())
    )
  );
});
