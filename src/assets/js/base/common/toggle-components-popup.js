export default function toggleComponentsPopup() {
  const $previews = $('.preview');
  const $modal = $('.image-modal');
  const $modalImg = $('.image-modal__img');

  if (!$previews.length || !$modal.length || !$modalImg.length) {
    return;
  }

  $previews.on('click', function () {
    $modalImg.attr('src', $(this).attr('src'));
    $modal.addClass('active');
  });

  $modal.on('click', function () {
    $modal.removeClass('active');
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $modal.hasClass('active')) {
      $modal.removeClass('active');
    }
  });

  const $codeBlocks = $('.code-block');

  if (!$codeBlocks.length) return;

  $codeBlocks.each(function () {
    const $block = $(this);
    const $button = $block.find('button');
    const $code = $block.find('code');

    $button.on('click', function () {
      const text = $code.text().trim();

      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        $block.addClass('active');

        setTimeout(() => {
          $block.removeClass('active');
        }, 300);
      }).catch(() => {
        console.error('Ошибка копирования');
      });
    });
  });
}

toggleComponentsPopup();