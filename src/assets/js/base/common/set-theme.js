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
  const imageUrl = `http://localhost:8080/assets/images/${imageName}`;
  $('<meta>', { property: 'og:image', content: imageUrl }).appendTo('head');
  $('<meta>', { name: 'twitter:image', content: imageUrl }).appendTo('head');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function applyHljsTheme(theme) {
  const hlTheme = theme === 'dark' ? 'atom-one-dark' : 'github';

  // Удаляем старую тему
  $('link[data-hljs-theme]').remove();

  // Подключаем новую тему
  $('<link>', {
    rel: 'stylesheet',
    href: `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${hlTheme}.min.css`,
    'data-hljs-theme': true
  }).appendTo('head').on('load', () => {
    
    // Обрабатываем все <pre><code>
    $('pre code').each(function () {
      const $code = $(this);

      // Если код уже подсвечен, сбрасываем HTML к исходному тексту
      if ($code.data('highlighted')) {
        $code.text($code.text());
        $code.removeData('highlighted');
      }

      // Экранируем HTML внутри кода (если есть)
      const rawCode = $code.text();
      $code.html(escapeHtml(rawCode));

      // Подсветка
      hljs.highlightElement(this);

      // Отмечаем, что элемент подсвечен
      $code.data('highlighted', true);
    });
  });
}

export function setTheme(theme) {
  const body = $('html, body');
  const button = $('.header__theme');

  body.toggleClass('dark', theme === 'dark');
  button.toggleClass('active', theme === 'dark');
  $('meta[name="theme-color"]').attr(
    'content',
    theme === 'dark' ? '#111928' : '#ffffff'
  );

  localStorage.setItem('theme', theme);
  applyHljsTheme(theme);
  updateMetaImages(theme);
}

export function initTheme() {
  const button = $('.header__theme');
  const body = $('html, body');

  const savedTheme = localStorage.getItem('theme');
  const systemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeToSet = savedTheme || (systemThemeDark ? 'dark' : 'light');

  setTheme(themeToSet);

  if (!button.data('theme-initialized')) {
    button.on('click', () => {
      const newTheme = body.hasClass('dark') ? 'light' : 'dark';
      setTheme(newTheme);
    });
    button.data('theme-initialized', true);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

initTheme();
