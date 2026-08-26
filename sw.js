/* Periodic Puzzle — Service Worker (Offline PWA) */
const CACHE_NAME = 'periodic-puzzle-v2';
const CORE_ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './story_map.js',
    './icon.svg',
    './icon-maskable.svg',
    './manifest.json'
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: network-first for GitHub API/leaderboard, cache-first for local assets
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Always go to network for the leaderboard DB & fonts (fallback to cache offline)
    if (url.includes('api.github.com') || url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        event.respondWith(
            fetch(event.request)
                .then((res) => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for everything else (app shell)
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const fetchPromise = fetch(event.request).then((res) => {
                const clone = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return res;
            }).catch(() => cached);
            return cached || fetchPromise;
        })
    );
});
