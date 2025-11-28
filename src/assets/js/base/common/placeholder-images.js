export default function placeholderImages(placeholderSrc = 'https://placehold.co/600x400') {
  $('img').each(function () {
    const $img = $(this);

    $img.one('error', function () {
      $img.attr('src', placeholderSrc);
    });

    if (this.complete && this.naturalWidth === 0) {
      $img.trigger('error');
    }
  });
}

placeholderImages();