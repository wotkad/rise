export default function loadImages() {
  let images = $('img');
  images.addClass('blur');
  
  $('img').each(function() {
    let img = $(this);

    img.on('load', function() {
      img.removeClass('blur');
    });

    if (img[0].complete) {
      img.removeClass('blur');
    }
  });
}
loadImages();