export default function placeholderImages(placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=') {
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