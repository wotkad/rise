if ($('.swiper')) {
  import('swiper/css');
  import('swiper/css/pagination');
  import('swiper/css/grid');
}

import "highlight.js/scss/atom-one-dark.scss";

import "@styles/app.scss";

if (module.hot) {
  module.hot.accept();
}

$(function () {
  require("js/app");
});