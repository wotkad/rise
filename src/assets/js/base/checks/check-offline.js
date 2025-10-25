export default function checkOffline() {
  const $banner = $('<div class="offline-banner">Вы офлайн</div>').hide().appendTo('body');
  const CACHE_KEY = 'offlineCacheData';
  const $dataContainer = $('main'); // контейнер с контентом, который нужно кешировать

  // --- Стили баннера ---
  const style = `
    <style>
      .offline-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff5555;
        color: #fff;
        text-align: center;
        padding: 10px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
    </style>
  `;
  $('head').append(style);

  // --- Функции ---
  function updateOnlineStatus() {
    if (navigator.onLine) {
      hideOfflineBanner();
      restoreData();
    } else {
      showOfflineBanner();
      cacheData();
    }
  }

  function showOfflineBanner() {
    $banner.stop(true, true).fadeIn(200);
  }

  function hideOfflineBanner() {
    $banner.stop(true, true).fadeOut(200);
  }

  function cacheData() {
    if ($dataContainer.length) {
      const html = $dataContainer.html();
      localStorage.setItem(CACHE_KEY, html);
    }
  }

  function restoreData() {
    if ($dataContainer.length) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        $dataContainer.html(cached);
      }
    }
  }

  // --- Инициализация ---
  updateOnlineStatus();

  // Отслеживание событий сети
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}
checkOffline();