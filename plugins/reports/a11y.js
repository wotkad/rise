#!/usr/bin/env node

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

  const results = await pa11y(url, { standard: 'WCAG2AA' });

  for (const issue of results.issues) {
    if (issue.selector) {
      await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        if (el) el.style.outline = '3px solid red';
      }, issue.selector);
    }
  }

  const relativePath = path.relative(BUILD_DIR, filePath);
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

console.log('🚀 Создание отчёта о доступности...');

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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Отчёт по доступности</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-900 p-8">
  <h1 class="text-3xl font-bold mb-6">Отчёт по доступности</h1>
`;

  for (const file of files) {
    const relativePath = path.relative(BUILD_DIR, file);

    try {
      const { results, screenshotFile } = await auditPage(file, browser);

      const issueCount = results.issues.length;
      const screenshotRel = path.relative(REPORT_DIR, screenshotFile).replace(/\\/g, '/');

      reportHtml += `
<section class="mb-10 bg-white shadow rounded-lg border border-gray-200 p-6">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-2xl font-semibold">${relativePath}</h2>
    <span class="text-sm text-gray-500">${issueCount} ошибок</span>
  </div>
`;

      if (issueCount === 0) {
        reportHtml += `<p class="text-green-600 font-medium">✅ Нет ошибок доступности</p>`;
      } else {
        reportHtml += `
<div class="overflow-x-auto rounded-lg border border-gray-300 mt-3">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Тип</th>
        <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Сообщение</th>
        <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Код</th>
        <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Элемент</th>
        <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Скриншот</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
`;

        results.issues.forEach(issue => {
          const typeColor =
            issue.type === 'error'
              ? 'text-red-600 font-semibold'
              : issue.type === 'warning'
              ? 'text-yellow-600 font-semibold'
              : 'text-green-600';

          reportHtml += `
<tr class="hover:bg-gray-50">
  <td class="px-4 py-2 ${typeColor}">${issue.type}</td>
  <td class="px-4 py-2">${issue.message}</td>
  <td class="px-4 py-2 font-mono text-sm text-gray-800">${issue.code}</td>
  <td class="px-4 py-2 font-mono text-xs text-gray-700">${issue.selector || '-'}</td>
  <td class="px-4 py-2 text-center">
    <a href="${screenshotRel}" target="_blank">
      <img src="${screenshotRel}" class="w-40 h-auto mx-auto border rounded shadow-sm"/>
    </a>
  </td>
</tr>`;
        });

        reportHtml += `
    </tbody>
  </table>
</div>
`;
      }

      reportHtml += `</section>`;
    } catch (err) {
      console.error(`Ошибка при проверке ${relativePath}:`, err);
      reportHtml += `
<section class="mb-10 bg-white shadow rounded-lg border border-gray-200 p-6">
  <h2 class="text-2xl font-semibold mb-3">${relativePath}</h2>
  <p class="text-red-600 font-bold">Ошибка проверки: ${err.message}</p>
</section>`;
    }
  }

  await browser.close();

  reportHtml += `
  <footer class="mt-10 text-center text-sm text-gray-500">
    Сгенерировано автоматически ${new Date().toLocaleString('ru-RU')}
  </footer>
</body>
</html>
`;

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, reportHtml);
  console.log(`✅ Готово: отчёт о доступности сохранён в /reports/a11y, скриншоты сохранены в /reports/a11y/screenshots`);
}

runAudit().catch(err => console.error(err));
