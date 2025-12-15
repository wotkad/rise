if ($('.swiper')) {
  import('swiper/css');
  import('swiper/css/pagination');
  import('swiper/css/grid');
  import('lightgallery/css/lightgallery-bundle.css');
  import('lightgallery/css/lightgallery.css');
}

import "highlight.js/scss/atom-one-dark.scss";

import "@styles/app.scss";

if (module.hot) {
  module.hot.accept();
}

$(function () {
  require("js/app");
});