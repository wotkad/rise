function loadImages() {
  let $images = $('img.blured')
  $images.addClass('blur')

  $images.each(function() {
    let $img = $(this);

    $img.on('load', function() {
      setTimeout(function() {
        $img.css('transition', 'filter 0.3s');
        $img.removeClass('blur');
        $img.removeClass('blured');
      }, 300, function() {
        $img.removeAttr('style');
      });
    });

    if ($img[0].complete) {
      setTimeout(function() {
        $img.css('transition', 'filter 0.3s');
        $img.removeClass('blur');
        $img.removeClass('blured');
      }, 300, function() {
        $img.removeAttr('style');
      });
    }
  });
}
loadImages();