import Swiper from "swiper";
import { Grid, Pagination } from 'swiper/modules';

import lightGallery from "lightgallery";
import lgPager from 'lightgallery/plugins/pager'
import { clearQueueScrollLocks, disablePageScroll, enablePageScroll } from "scroll-lock";

export default function contentGallery() {
  if ($('.swiper-content-gallery').length === 0) return;

  let swiperInstance = null;
  let windowWidth = window.innerWidth;

  function initSwiper() {
    if (window.innerWidth <= 1024) {
      swiperInstance = new Swiper('.swiper-content-gallery', {
        modules: [Pagination, Grid],
        grabCursor: true,
        spaceBetween: 16,
        breakpoints: {
          1024: {
            grid: { rows: 2, fill: 'row' },
            slidesPerView: 2,
          },
          1280: {
            grid: { rows: 2, fill: 'row' },
            slidesPerView: 4,
          },
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          dynamicBullets: true,
          clickable: true,
        },
        on: {
          init(swiper) {
            requestAnimationFrame(() => {
              swiper.update();
              swiper.pagination.render();
              swiper.pagination.update();
            });
          }
        }
      });
    }
  }
  initSwiper();

  function handleResize() {
    const newWindowWidth = window.innerWidth;

    if ((windowWidth <= 1024 && newWindowWidth > 1024) ||
        (windowWidth > 1024 && newWindowWidth <= 1024)) {

      if (swiperInstance && swiperInstance.destroy) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
      }
      initSwiper();
    }

    windowWidth = newWindowWidth;
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 0);
  });

  const gallery = document.querySelector('.swiper-content-gallery .swiper-wrapper');

  if (gallery) {
    lightGallery(gallery, {
      licenseKey: 'UNLICENSED',
      controls: true,
      download: false,
      getCaptionFromTitleOrAlt: false,
      plugins: [lgPager],
    });
  }

  $('.swiper-content-gallery, .lg-outer').on('click', function() {
    if ($('html').hasClass('lg-on')) {
      disablePageScroll();
    } else {
      clearQueueScrollLocks();
      enablePageScroll();
    }
  });

  $(document).on('keydown', function(e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      clearQueueScrollLocks();
      enablePageScroll();
    }
  });
}

contentGallery();
