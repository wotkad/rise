if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/assets/js/base/common/service-worker.js')
      .then(reg => console.log('[SW] Registered'))
      .catch(err => console.error('[SW] Registration failed', err));
  });
}