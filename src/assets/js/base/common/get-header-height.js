function getHeaderHeight() {
  let height = $('.header-offset').outerHeight();
  document.documentElement.style.setProperty('--header-offset', `${height}px`);
}
getHeaderHeight();

$(window).on('resize', function() {
  getHeaderHeight();
});