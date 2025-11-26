export default function validationOffline() {
  let $banner = null;
  let hideTimeout = null;

  function showBanner() {
    if (!$banner) {
      $banner = $('<div class="offline-banner">Вы офлайн. Проверьте подключение к интернету.</div>')
        .appendTo('body');
    }
    $banner.show();
  }

  function hideBanner() {
    if (!$banner) return;
    $banner.remove();
  }

  function updateOnlineStatus() {
    if (navigator.onLine) {
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(hideBanner, 500);
    } else {
      if (hideTimeout) clearTimeout(hideTimeout);
      showBanner();
    }
  }

  updateOnlineStatus();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

validationOffline();
