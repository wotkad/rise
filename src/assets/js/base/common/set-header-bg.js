export default function setHeaderBg() {
  let header = $('.header');
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 0) {
      header.addClass('scrolled');
    } else {
      header.removeClass('scrolled');
    }
  });
  if ($(window).scrollTop() > 0) {
    header.addClass('scrolled');
  } else {
    header.removeClass('scrolled');
  }
}
setHeaderBg();