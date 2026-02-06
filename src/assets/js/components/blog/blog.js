import Swiper from "swiper";
import { Pagination } from 'swiper/modules';

export default function sliderBlog() {
  if ($('.swiper-blog').length == 0) {
    return;
  }
  
  new Swiper('.swiper-blog', {
    modules: [Pagination],
    spaceBetween: 32,
    grabCursor: true,
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 2,
      }
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      dynamicBullets: true,
      clickable: true,
    },
  });
}
sliderBlog();