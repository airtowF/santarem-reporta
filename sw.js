const CACHE = "sr-v1";
const OFFLINE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./assets/logo.svg",
  "./js/pwa.js",
  "./pages/cidadao/login.html",
  "./pages/cidadao/home.html",
  "./pages/cidadao/reportar.html",
  "./pages/cidadao/minhas-denuncias.html",
  "./pages/servidor/login-servidor.html",
  "./pages/admin/login-admin.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(OFFLINE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)),
  );
});
