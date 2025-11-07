export default function validationOffline() {
  const $banner = $('<div class="offline-banner">Вы офлайн</div>').hide().appendTo('body');
  let hideTimeout = null;

  function updateOnlineStatus() {
    if (navigator.onLine) {
      // Отменяем предыдущий таймаут, если есть
      if (hideTimeout) clearTimeout(hideTimeout);

      // Скрываем баннер с небольшой задержкой
      hideTimeout = setTimeout(() => {
        $banner.hide();
      }, 500); // 500 мс задержка
    } else {
      // Если офлайн, показываем баннер сразу
      if (hideTimeout) clearTimeout(hideTimeout);
      $banner.show();
    }
  }

  updateOnlineStatus();

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

validationOffline();
