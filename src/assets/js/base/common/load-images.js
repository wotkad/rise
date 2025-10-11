import { imageCache } from '../../cache/image-cache';

function completeImageLoading($img, $parent, immediate = false) {
  if (immediate) {
    $parent.removeClass('loading');
  } else {
    setTimeout(() => {
      $parent.removeClass('loading');
    }, 300);
  }
}

export default function loadImages() {
  const $images = $('.loading img');

  $images.each(function() {
    const $img = $(this);
    const src = $img.attr('src');
    if (!src) return;

    const $parent = $img.parent();

    if (imageCache.has(src) && $img[0].complete) {
      completeImageLoading($img, $parent, true);
      return;
    }

    const handleLoad = () => {
      completeImageLoading($img, $parent);
      imageCache.add(src);
      $img.off('load', handleLoad);
    };

    if ($img[0].complete) {
      handleLoad();
    } else {
      $img.on('load', handleLoad);
    }
  });
}

// Вызов отдельно — только если нужно
loadImages();