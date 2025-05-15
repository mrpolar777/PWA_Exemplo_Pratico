const CACHE_NAME = "pwa-tarefas-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/css/style.css",
  "/src/js/script.js",
  "/src/icon/editar.png",
  "/src/icon/trash.png",
  "/src/json/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Interceptando requisição para:", event.request.url);

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("✔ Servindo do cache:", event.request.url);
        return response;
      }

      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          console.log("⚠ Offline - Servindo /index.html do cache");
          return caches.match("/index.html");
        }
      });
    })
  );
});

