import Swiper from "swiper";
import { Grid, Pagination } from 'swiper/modules';

export default function sliderTeam() {
  if ($('.swiper-team').length == 0) {
    return;
  }
  let swiperInstance = null;
  let windowWidth = window.innerWidth;
  
  function initSwiper() {
    swiperInstance = new Swiper('.swiper-team', {
      modules: [Pagination, Grid],
      grabCursor: true,
      spaceBetween: 32,
      breakpoints: {
        1280: {
          grid: {
            rows: 2,
            fill: 'row',
          },
          slidesPerView: 4,
        },
        768: {
          grid: {
            rows: 2,
            fill: 'row',
          },
          slidesPerView: 2,
        }
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
  initSwiper();
  
  function handleResize() {
    const newWindowWidth = window.innerWidth;
    
    if ($('.swiper-team').length > 0) {
      if ((windowWidth <= 1280 && newWindowWidth > 1280) || 
          (windowWidth > 1280 && newWindowWidth <= 1280)) {
        if (swiperInstance && swiperInstance.destroy) {
          swiperInstance.destroy(true, true);
        }
        initSwiper();
      }
    }
    
    windowWidth = newWindowWidth;
  }
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 0);
  });
}

sliderTeam();