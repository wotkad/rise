export default function translator() {
  const lang = $('html').attr('lang') || 'ru';
  const langFile = `/assets/lang/${lang}.json`;
  $.getJSON(langFile, function(translations) {
      $('[data-i18n]').each(function() {
          const $el = $(this);
          const key = $el.attr('data-i18n');
          if (translations[key]) {
              $el.text(translations[key]);
          }
      });
  }).fail(function() {
      console.warn(`Файл переводов ${langFile} не найден`);
  });
}
translator();