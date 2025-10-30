#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// ====== Конфиг ======
const PROJECT_ROOT = path.resolve(__dirname, '../../');
const REPORT_DIR = path.join(PROJECT_ROOT, 'reports/content');
fs.mkdirSync(REPORT_DIR, { recursive: true });

const SRC_DIRS = {
  pages: path.join(PROJECT_ROOT, 'src/views/pages'),
  scss: path.join(PROJECT_ROOT, 'src/assets/styles'),
  pug: path.join(PROJECT_ROOT, 'src/views'),
  images: path.join(PROJECT_ROOT, 'src/assets/images')
};

const TITLE_MAX_LENGTH = 60;
const DESCRIPTION_MAX_LENGTH = 160;

// ====== Утилиты ======
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function findFiles(pattern) {
  return glob.sync(pattern, { nodir: true });
}

// ====== Проверка title/description ======
function checkTitlesDescriptions() {
  const report = [];
  const pugFiles = [
    ...findFiles(`${SRC_DIRS.pug}/index.pug`),
    ...findFiles(`${SRC_DIRS.pages}/**/*.pug`)
  ];

  function checkContent(file, content, type = 'pug') {
    let title = null;
    let description = null;

    // === Ищем блок title ===
    const titleBlock = content.match(/block\s+title([\s\S]*?)(?=block\s+|$)/i);
    if (titleBlock) {
      // Вытаскиваем строку с `title ...`
      const titleLine = titleBlock[1].match(/^\s*title\s+(.+)$/m);
      if (titleLine) {
        title = titleLine[1].trim();
      }
    }

    // === Ищем блок basicSeo и description ===
    const seoBlock = content.match(/block\s+basicSeo([\s\S]*?)(?=block\s+|$)/i);
    if (seoBlock) {
      const descriptionMatch = seoBlock[1].match(/content\s*=\s*["']([^"']+)["'][^>]*name\s*=\s*["']description["']/);
      if (descriptionMatch) {
        description = descriptionMatch[1].trim();
      }
    }

    // === Проверки и добавление в отчёт ===
    if (!title) {
      report.push({ file, type, issue: 'missing_title' });
    } else if (title.length > TITLE_MAX_LENGTH) {
      report.push({
        file,
        type,
        issue: 'title_too_long',
        length: title.length,
        title
      });
    }

    if (!description) {
      report.push({ file, type, issue: 'missing_description' });
    } else if (description.length > DESCRIPTION_MAX_LENGTH) {
      report.push({
        file,
        type,
        issue: 'description_too_long',
        length: description.length,
        description
      });
    }
  }

  pugFiles.forEach(f => checkContent(f, readFile(f), 'pug'));
  return report;
}

// ====== Проверка SCSS ======
function checkScss() {
  const report = [];

  const variablesFile = path.join(SRC_DIRS.scss, 'base/variables.scss');
  const variables = readFile(variablesFile).match(/\$[\w-]+/g) || [];
  const scssFiles = findFiles(`${SRC_DIRS.scss}/**/*.scss`).filter(f => !f.endsWith('variables.scss'));

  // unused variables
  variables.forEach(v => {
    const used = scssFiles.some(f => readFile(f).includes(v));
    if (!used) report.push({ type: 'unusedVariable', variable: v });
  });

  return report;
}

// ====== Проверка alt у изображений ======
function checkImageAlts() {
  const report = [];
  const pugFiles = findFiles(`${SRC_DIRS.pug}/**/*.pug`);

  pugFiles.forEach(file => {
    const content = readFile(file);

    // ищем img() и HTML <img> с учётом вложенных конструкций
    const imgRegex = /img\s*\((?:[^()"'']+|["'][^"']*["']|\([^()]*\))*\)|<img\s+[^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const tag = match[0];

      // проверяем наличие alt=
      if (!/alt\s*=\s*["'][^"']*["']/.test(tag)) {
        const srcMatch = tag.match(/src\s*[:=]?\s*([^,)>\s]+)/i);
        report.push({ file, image: srcMatch ? srcMatch[1].trim() : '[unknown]' });
      }
    }
  });

  return report;
}

// ====== Генерация HTML отчёта ======
function generateHtmlReport(data) {
  const renderTable = (items) => {
    if (!items || items.length === 0) {
      return '<p class="text-green-600">✅ Нет проблем</p>';
    }

    const headers = Object.keys(items[0]);

    return `
    <div class="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            ${headers.map(h => `<th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          ${items.map(item => `
            <tr class="hover:bg-gray-50">
              ${headers.map(h => `<td class="px-4 py-2 text-sm text-gray-800">${item[h] ?? ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    `;
  };

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Отчёт проверки контента</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-900 p-8">
  <h1 class="text-3xl font-bold mb-6">Отчёт проверки контента</h1>

  ${Object.entries(data).map(([section, items]) => `
    <section class="mb-10 bg-white shadow rounded-lg border border-gray-200 p-6">
      <h2 class="text-2xl font-semibold mb-3 border-b pb-1">${section}</h2>
      ${renderTable(items)}
    </section>
  `).join('')}

  <footer class="mt-10 text-sm text-gray-500 text-center">
    Сгенерировано автоматически ${new Date().toLocaleString('ru-RU')}
  </footer>
</body>
</html>
  `;
}

// ====== Главная функция ======
async function run() {
  const titlesReport = checkTitlesDescriptions();
  const scssReport = checkScss();
  const imagesReport = checkImageAlts();

  const reportData = {
    Заголовки: titlesReport,
    SCSS: scssReport,
    Images: imagesReport
  };

  const htmlPath = path.join(REPORT_DIR, 'report.html');
  fs.writeFileSync(htmlPath, generateHtmlReport(reportData));
  console.log(`✅ Отчёт о контенте сохранён в /reports/content`);
}

run();