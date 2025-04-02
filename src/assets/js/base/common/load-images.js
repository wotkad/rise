export default function checkImages() {
  let $images = $('img.blur, .blur img')

  // Проверяем каждое изображение
  $images.each(function() {

    let $img = $(this);

    // Когда изображение загружено, убираем класс с блюром
    $img.on('load', function() {
      setTimeout(function() {
        $img.removeClass('blur');
      }, 300);
    });

    // Если изображение уже загружено (например, кешированное), убираем блюр сразу
    if ($img[0].complete) {
      setTimeout(function() {
        $img.removeClass('blur');
      }, 300);
    }
  });
}
checkImages();