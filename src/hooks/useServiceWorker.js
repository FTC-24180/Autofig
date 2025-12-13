import { useEffect, useState } from 'react';

export function useServiceWorker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('[SW Hook] Service Worker not supported');
      return;
    }

    let swRegistration = null;

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[SW Hook] Service Worker registered');
        swRegistration = reg;
        setRegistration(reg);

        // Check for updates on page load
        reg.update();

        // Check for updates when page becomes visible (user returns to tab)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            console.log('[SW Hook] Page visible - checking for updates');
            reg.update();
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          console.log('[SW Hook] Update found');
          const newWorker = reg.installing;

          newWorker.addEventListener('statechange', () => {
            console.log('[SW Hook] New worker state:', newWorker.state);
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW Hook] New content available');
              setUpdateAvailable(true);
            }
          });
        });

        // Cleanup
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      })
      .catch((error) => {
        console.error('[SW Hook] Service Worker registration failed:', error);
      });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('[SW Hook] Message from SW:', event.data);
      
      if (event.data && event.data.type === 'SW_UPDATED') {
        console.log('[SW Hook] SW updated to version:', event.data.version);
        setCurrentVersion(event.data.version);
      }
    });

    // Listen for controller change (new SW took over)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW Hook] Controller changed - reloading');
      // Only reload if not already reloading
      if (!window.reloadingFromSW) {
        window.reloadingFromSW = true;
        window.location.reload();
      }
    });

    // Get current version
    if (navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data && event.data.version) {
          setCurrentVersion(event.data.version);
        }
      };
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const updateApp = () => {
    if (registration && registration.waiting) {
      console.log('[SW Hook] Activating waiting service worker');
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    updateAvailable,
    updateApp,
    currentVersion,
    registration
  };
}
