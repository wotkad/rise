import "styles/_app.scss";

$(function () {
  require("js/preloader/index");
  require("js/linksChecker/isCurrentPage/index");
  require("js/linksChecker/checkInternalLinks/index");
  require("js/routing/index");
  require("js/scroll/smoothScroll/index");
  require("js/scroll/scrollReveal/index");
  require("js/app");
});
