const fs = require('fs');
const path = require('path');
const glob = require('glob');
const pa11y = require('pa11y');
const puppeteer = require('puppeteer');

const BUILD_DIR = path.resolve(__dirname, '../../build');
const HTML_PATTERN = `${BUILD_DIR}/**/*.html`;
const REPORT_DIR = path.resolve(__dirname, '../../reports/a11y');
const REPORT_FILE = path.join(REPORT_DIR, 'report.html');
const SCREENSHOT_DIR = path.join(REPORT_DIR, 'screenshots');

// --- Очищаем папку скриншотов перед запуском ---
if (fs.existsSync(SCREENSHOT_DIR)) {
  fs.readdirSync(SCREENSHOT_DIR).forEach(file => {
    fs.unlinkSync(path.join(SCREENSHOT_DIR, file));
  });
} else {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function auditPage(filePath, browser) {
  const url = `file://${filePath}`;
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load' });

  const results = await pa11y(url, {
    standard: 'WCAG2AA',
  });

  // подсветка проблемных элементов
  for (const issue of results.issues) {
    if (issue.selector) {
      await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        if (el) el.style.outline = '3px solid red';
      }, issue.selector);
    }
  }

  // формируем имя скриншота
  const relativePath = path.relative(BUILD_DIR, filePath); // e.g. blog/post/index.html
  let screenshotName;

  if (path.basename(filePath) === 'index.html') {
    const dirPath = path.dirname(relativePath);
    screenshotName = dirPath === '.' ? 'index' : dirPath.replace(/[\/\\]/g, '_');
  } else {
    screenshotName = relativePath.replace(/\.html$/, '').replace(/[\/\\]/g, '_');
  }
  screenshotName += '.png';

  const screenshotFile = path.join(SCREENSHOT_DIR, screenshotName);
  await page.screenshot({ path: screenshotFile, fullPage: true });
  await page.close();

  return { results, screenshotFile };
}

async function runAudit() {
  const files = glob.sync(HTML_PATTERN);
  if (!files.length) {
    console.log('❌ HTML файлов для проверки не найдено');
    return;
  }

  const browser = await puppeteer.launch({ defaultViewport: { width: 1200, height: 800 } });

  let reportHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Отчёт по доступности</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-900 p-8">
<h1 class="text-3xl font-bold text-center mb-8">Отчёт по доступности</h1>
`;

  for (const file of files) {
    const relativePath = path.relative(BUILD_DIR, file);
    console.log(`🔍 Проверка: ${relativePath}`);

    try {
      const { results, screenshotFile } = await auditPage(file, browser);

      reportHtml += `<h2 class="text-2xl font-semibold mt-6 mb-4">${relativePath} (${results.issues.length} ошибок)</h2>`;

      if (results.issues.length === 0) {
        reportHtml += `<p class="text-green-600 font-medium mb-4">Нет ошибок доступности</p>`;
      } else {
        reportHtml += `
<table class="min-w-full border border-gray-300 mb-6">
  <thead class="bg-gray-200">
    <tr>
      <th class="border px-3 py-2 text-left">Тип</th>
      <th class="border px-3 py-2 text-left">Сообщение</th>
      <th class="border px-3 py-2 text-left">Код</th>
      <th class="border px-3 py-2 text-left">Элемент</th>
      <th class="border px-3 py-2 text-left">Скриншот</th>
    </tr>
  </thead>
  <tbody>
`;

        results.issues.forEach(issue => {
          const typeColor = issue.type === 'error' ? 'text-red-600' : issue.type === 'warning' ? 'text-yellow-600' : 'text-green-600';
          const screenshotRel = path.relative(REPORT_DIR, screenshotFile).replace(/\\/g, '/');

          reportHtml += `
<tr>
  <td class="border px-3 py-2 ${typeColor} font-medium">${issue.type}</td>
  <td class="border px-3 py-2">${issue.message}</td>
  <td class="border px-3 py-2 font-mono">${issue.code}</td>
  <td class="border px-3 py-2 font-mono text-sm">${issue.selector || '-'}</td>
  <td class="border px-3 py-2"><a href="${screenshotRel}" target="_blank"><img src="${screenshotRel}" class="w-32 h-auto border"/></a></td>
</tr>`;
        });

        reportHtml += `</tbody></table>`;
      }
    } catch (err) {
      console.error(`Ошибка при проверке ${relativePath}:`, err);
      reportHtml += `<p class="text-red-600 font-bold">Ошибка проверки: ${err.message}</p>`;
    }
  }

  await browser.close();

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, reportHtml);
  console.log(`✅ Готово: отчёт сохранён в /reports/a11y`);
  console.log(`✅ Готово: скриншоты сохранены в /reports/a11y/screenshots`);
}

runAudit().catch(err => console.error(err));
