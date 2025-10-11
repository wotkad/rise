import hljs from 'highlight.js/lib/core';
import html from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';

hljs.registerLanguage('html', html);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);

function updateMetaImages(theme) {
  $('meta[property="og:image"]').remove();
  $('meta[name="twitter:image"]').remove();
  const imageName = theme === 'dark' ? 'banner-dark.png' : 'banner-light.png';
  const imageUrl = `https://shevelev.agency/assets/images/${imageName}`;
  $('<meta>', { property: 'og:image', content: imageUrl }).appendTo('head');
  $('<meta>', { name: 'twitter:image', content: imageUrl }).appendTo('head');
}

function applyHljsTheme(theme) {
  const hlTheme = theme === 'dark' ? 'atom-one-dark' : 'github';
  $('link[data-hljs-theme]').remove();
  $('<link>', {
    rel: 'stylesheet',
    href: `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${hlTheme}.min.css`,
    'data-hljs-theme': true
  }).appendTo('head').on('load', () => {
    $('pre code').each(function () {
      delete this.dataset.highlighted;
    });
    hljs.highlightAll();
  });
}

export function setTheme(theme) {
  const body = $('html, body');
  const button = $('.header__theme');
  const bodyEl = $('body');

  // Добавляем класс, чтобы временно отключить transition у ссылок
  bodyEl.addClass('theme-changing');

  // Переключаем тему
  body.toggleClass('dark', theme === 'dark');
  button.toggleClass('active', theme === 'dark');
  $('meta[name="theme-color"]').attr(
    'content',
    theme === 'dark' ? '#111928' : '#ffffff'
  );

  localStorage.setItem('theme', theme);
  applyHljsTheme(theme);
  updateMetaImages(theme);

  // Убираем временный класс после завершения transition
  setTimeout(() => {
    bodyEl.removeClass('theme-changing');
  }, 300); // 0.3s — столько же, сколько transition в SCSS
}

export function initTheme() {
  const button = $('.header__theme');
  const body = $('html, body');

  const savedTheme = localStorage.getItem('theme');
  const systemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeToSet = savedTheme || (systemThemeDark ? 'dark' : 'light');

  setTheme(themeToSet);

  // Назначаем клик только один раз
  if (!button.data('theme-initialized')) {
    button.on('click', () => {
      const newTheme = body.hasClass('dark') ? 'light' : 'dark';
      setTheme(newTheme);
    });
    button.data('theme-initialized', true);
  }

  // Отслеживание системной темы, если пользователь вручную не выбирал
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

initTheme();
