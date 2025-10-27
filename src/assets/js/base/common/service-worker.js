if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => console.log('[SW] Registered', reg))
      .catch(err => console.error('[SW] Registration failed', err));
  });
}