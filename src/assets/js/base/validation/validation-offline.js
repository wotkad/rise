export default function validationOffline() {
  const $banner = $('<div class="offline-banner">Вы офлайн. Проверьте подключение к интернету.</div>').hide().appendTo('body');
  let hideTimeout = null;

  function updateOnlineStatus() {
    if (navigator.onLine) {
      if (hideTimeout) clearTimeout(hideTimeout);

      hideTimeout = setTimeout(() => {
        $banner.hide();
      }, 500);
    } else {
      if (hideTimeout) clearTimeout(hideTimeout);
      $banner.show();
    }
  }

  updateOnlineStatus();

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

validationOffline();
