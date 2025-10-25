import { imageCache } from '../../cache/image-cache';

function extractDominantColor(imgSrc, callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imgSrc;

  img.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = Math.min(img.width, 64);
    const h = Math.min(img.height, 64);
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    try {
      const data = ctx.getImageData(0, 0, w, h).data;
      let r = 0, g = 0, b = 0, count = 0;

      for (let i = 0; i < data.length; i += 4 * 16) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      callback(`rgb(${r}, ${g}, ${b})`);
    } catch {
      callback('#ccc');
    } finally {
      callback(``);
    }
  };

  img.onerror = () => callback('#ccc');
}

function completeImageLoading($img, $parent, immediate = false) {
  if (immediate) {
    $parent.removeClass('loading');
  } else {
    setTimeout(() => $parent.removeClass('loading'), 300);
  }
}

export default function loadImages() {
  const $images = $('img');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const $img = $(entry.target);
      const src = $img.attr('src');
      const $parent = $img.parent();

      obs.unobserve(entry.target);
      if (!src) return;

      if (!$parent.hasClass('loading')) $parent.addClass('loading');

      extractDominantColor(src, color => {
        $parent.css({
          backgroundColor: color,
          filter: 'blur(10px)',
          transition: 'filter 0.3s ease'
        });

        if (imageCache.has(src) && $img[0].complete) {
          completeImageLoading($img, $parent, true);
          $parent.css('filter', 'none');
          return;
        }

        const handleLoad = () => {
          completeImageLoading($img, $parent);
          $parent.css('filter', 'none');
          imageCache.add(src);
          $img.off('load', handleLoad);
        };

        if ($img[0].complete) {
          handleLoad();
        } else {
          $img.on('load', handleLoad);
        }
      });
    });
  }, { threshold: 0.1 });

  $images.each(function () {
    observer.observe(this);
  });
}

loadImages();