const CACHE_NAME = 'queet-weed-v3';
const urlsToCache = [
	'/',
	'/manifest.json',
	'/icon-192x192.png',
	'/icon-512x512.png',
	'/apple-touch-icon.png',
	'/favicon.ico',
	'/sw.js'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						console.log('Deleting old cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	const isIconOrManifest =
		url.pathname.startsWith('/icon-') ||
		url.pathname === '/manifest.json' ||
		url.pathname === '/apple-touch-icon.png';

	if (isIconOrManifest) {
		event.respondWith(
			fetch(event.request, { cache: 'reload' })
				.then((response) => {
					const respClone = response.clone();
					caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
					return response;
				})
				.catch(() => caches.match(event.request))
		);
		return;
	}

	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) return response;
			return fetch(event.request);
		})
	);
});
