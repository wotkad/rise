export default function textareaAutoheight() {
  const $textareas = $('textarea.auto-height');

  const style = `
    <style>
      textarea.auto-height {
        overflow-y: hidden;
        resize: none;
        transition: height 0.15s ease;
      }
    </style>
  `;
  $('head').append(style);

  function adjustHeight($el) {
    $el.css('height', 'auto');
    $el.css('height', $el[0].scrollHeight + 'px');
  }

  $textareas.each(function () {
    adjustHeight($(this));
  });

  $(document).on('input', 'textarea.auto-height', function () {
    adjustHeight($(this));
  });

  $(window).on('resize', function () {
    $textareas.each(function () {
      adjustHeight($(this));
    });
  });
}
textareaAutoheight();