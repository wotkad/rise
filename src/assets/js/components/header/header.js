import { disablePageScroll, enablePageScroll } from 'scroll-lock';

// Main fucntion

export default function header() {
  let button = $('.burger');
  let menu = $('.nav');
  let items = $('.close-burger');
  button.on('click', function() {
    if ($(this).hasClass('active')) {
      menu.removeClass('active');
      enablePageScroll();
      $(this).removeClass('active');
    } else {
      menu.addClass('active');
      disablePageScroll();
      $(this).addClass('active');
    }
  });
  Array.from(items).forEach((item) => {
    $(item).on('click', function() {
      setTimeout(function() {
        button.removeClass('active');
        menu.removeClass('active');
        enablePageScroll();
      }, 300);
    });
  });
  $(window).on('resize', function() {
    if ($(window).width() >= 1280 && button.hasClass('active')) {
      button.removeClass('active');
      menu.removeClass('active');
      enablePageScroll();
    }
  });
}
header();

// Theme toggle

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

export function initTheme() {
  const button = $('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const metaTheme = $('meta[name="theme-color"]');
  const htmlBody = $('html, body');

  const apply = (theme) => {
    const isDark = theme === 'dark';

    htmlBody.toggleClass('dark', isDark);
    button.toggleClass('active', isDark);
    metaTheme.attr('content', isDark ? '#111928' : '#ffffff');

    localStorage.setItem('theme', theme);

    applyHljsTheme(theme);
    updateMetaImages(theme);
  };

  const savedTheme = localStorage.getItem('theme');
  apply(savedTheme || (prefersDark.matches ? 'dark' : 'light'));

  if (!button.data('theme-initialized')) {
    button.on('click', () => {
      const newTheme = htmlBody.hasClass('dark') ? 'light' : 'dark';
      apply(newTheme);
    });
    button.data('theme-initialized', true);
  }

  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      apply(e.matches ? 'dark' : 'light');
    }
  });
}

initTheme();
