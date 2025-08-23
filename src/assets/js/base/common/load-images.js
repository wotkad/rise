import { imageCache } from '../../cache/image-cache';

export default function loadImages() {
  const $images = $('.loading img');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const $img = $(entry.target);
        const src = $img.attr('src');
        const $parent = $img.parent();

        // Если уже загружено из кеша и есть в imageCache
        if (imageCache.has(src) && $img[0].complete) {
          completeImageLoading($img, $parent, true);
          obs.unobserve($img[0]);
          return;
        }

        const handleLoad = () => {
          completeImageLoading($img, $parent);
          imageCache.add(src);
          obs.unobserve($img[0]); // больше не нужно отслеживать
        };

        $img.on('load', handleLoad);

        // Если уже загружено (браузерный кеш)
        if ($img[0].complete) {
          handleLoad();
        }
      }
    });
  }, {
    root: null,      // окно браузера
    rootMargin: '0px',
    threshold: 0.1   // хотя бы 10% изображения видно
  });

  $images.each(function() {
    observer.observe(this);
  });
}

function completeImageLoading($img, $parent, immediate = false) {
  if (immediate) {
    $parent.removeClass('loading');
  } else {
    setTimeout(() => {
      $parent.removeClass('loading');
    }, 300);
  }
}

loadImages();
