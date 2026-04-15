self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("app-cache").then(async (cache) => {
      try {
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      } catch {
        return cache.match(event.request);
      }
    })
  );
});
