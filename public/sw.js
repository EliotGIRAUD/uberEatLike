const CACHE_NAME = 'grosminos-v1';
const OFFLINE_URL = '/';

// Fichiers essentiels à mettre en cache lors de l'installation
const ESSENTIAL_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Mise en cache des ressources essentielles');
      return cache.addAll(ESSENTIAL_ASSETS);
    })
  );
  
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  if (url.pathname.startsWith('/_nuxt/') || 
      url.pathname.startsWith('/__') ||
      url.pathname.includes('hot-update')) {
    return;
  }
  
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        
        if (response.type === 'opaque') {
          return response;
        }
        
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
          console.log('[SW] ✅ Mise en cache:', url.pathname);
        }).catch((error) => {
          console.log('[SW] ❌ Erreur mise en cache:', error);
        });
        
        return response;
      })
      .catch(async () => {
        console.log('[SW] Réseau indisponible, recherche dans le cache...');
        
        const cachedResponse = await caches.match(event.request, {
          ignoreSearch: true,
          ignoreVary: true
        });
        
        if (cachedResponse) {
          console.log('[SW] Trouvé dans le cache:', event.request.url);
          return cachedResponse;
        }
        
        if (event.request.mode === 'navigate') {
          console.log('[SW] Navigation offline, tentative de charger la page d\'accueil...');
          
          const homeResponse = await caches.match(OFFLINE_URL);
          if (homeResponse) {
            return homeResponse;
          }
        }
        
        console.log('[SW] Rien dans le cache pour:', event.request.url);
        
        return new Response(
          `<!DOCTYPE html>
          <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Hors ligne - Grosmino's</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                }
                h1 { font-size: 2.5rem; margin-bottom: 1rem; }
                p { font-size: 1.2rem; opacity: 0.9; }
                .emoji { font-size: 4rem; margin-bottom: 1rem; }
                button {
                  margin-top: 2rem;
                  padding: 1rem 2rem;
                  font-size: 1rem;
                  background: white;
                  color: #667eea;
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  font-weight: bold;
                }
                button:hover {
                  opacity: 0.9;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="emoji">📡</div>
                <h1>Vous êtes hors ligne</h1>
                <p>Cette page n'est pas disponible en mode offline.</p>
                <p>Vérifiez votre connexion internet.</p>
                <button onclick="window.location.reload()">Réessayer</button>
              </div>
            </body>
          </html>`,
          {
            headers: { 'Content-Type': 'text/html; charset=UTF-8' },
            status: 503,
            statusText: 'Service Unavailable'
          }
        );
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

