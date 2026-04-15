self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => clients.claim());

// Não intercepta fetch → não mexe nos dados do Supabase
