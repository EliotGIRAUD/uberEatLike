/**
 * PWA Plugin - Service Worker Registration
 * Handles the installation and update of the Service Worker for offline support
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return;
  
  if ('serviceWorker' in navigator) {
    console.log('[PWA] Initialisation du Service Worker...');
    
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[PWA] Service Worker enregistré :', registration.scope)
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('Nouvelle version du Service Worker disponible');
                  
                  if (confirm('Une nouvelle version est disponible. Recharger la page ?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] Nouvelle version disponible');
                
                if (confirm('Une nouvelle version est disponible. Recharger ?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[PWA] Erreur enregistrement:', error);
      });
    
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] Nouveau Service Worker actif');
    });
  } else {
    console.warn('[PWA] Service Workers non supportés');
  }
});

