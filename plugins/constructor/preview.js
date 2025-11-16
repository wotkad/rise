#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const pug = require("pug");
const sass = require("sass");
const puppeteer = require("puppeteer");

// === ПУТИ ПОД ТВОЮ СТРУКТУРУ ===

const COMPONENTS_ROOT = path.resolve(__dirname, "./components");

const REPORT_DIR = path.resolve(__dirname, "../../reports/constructor-preview");
const SCREENSHOT_DIR = path.join(REPORT_DIR, "screenshots");

// Чистим результат
fs.rmSync(REPORT_DIR, { recursive: true, force: true });
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

console.log("🚀 Генерация превью компонентов...");

// =====================================================
// Функция поиска pug + scss под твою структуру
// =====================================================

function findComponents() {
  const dirs = glob.sync(
    path.join(COMPONENTS_ROOT, "**/*/*/*/"), 
    { absolute: true }
  );

  const components = [];

  dirs.forEach(dir => {
    const pugFile = glob.sync(path.join(dir, "*.pug"))[0];
    const scssFile = glob.sync(path.join(dir, "*.scss"))[0];
    if (!pugFile) return;

    // Структура: <components>/<name>/<version>/<name>/
    const parts = dir.split(path.sep);
    const compName = parts[parts.length - 3];  // breadcrumbs / header / hero
    const version = parts[parts.length - 2];   // v1 / v2

    const name = `${compName}-${version}`;

    components.push({
      name,
      pugFile,
      scssFile,
    });
  });

  return components;
}

// =====================================================
// Компиляция одного компонента в HTML
// =====================================================

async function renderComponent(component) {
  const { name, pugFile, scssFile } = component;

  // SCSS → CSS
  let css = "";
  if (scssFile) {
    const result = sass.compile(scssFile);
    css = result.css;
  }

  // Pug → HTML
  const htmlBody = pug.compileFile(pugFile)();

  // Полный HTML
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
${css}
body {
  margin: 40px;
}
</style>
</head>
<body>
<div id="root">
${htmlBody}
</div>
</body>
</html>`;
}

// =====================================================
// Основной запуск
// =====================================================

async function run() {
  const components = findComponents();

  console.log(`📦 Найдено компонентов: ${components.length}`);

  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1600, height: 1200 },
  });

  const report = [];

  for (const comp of components) {
    const html = await renderComponent(comp);

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const el = await page.$("#root");
    const box = await el.boundingBox();

    const screenshotName = `${comp.name}.png`;
    const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);

    await page.screenshot({
      path: screenshotPath,
      clip: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      },
    });

    await page.close();

    report.push({
      name: comp.name,
      screenshot: screenshotName,
    });

    console.log(`📸 ${comp.name}`);
  }

  await browser.close();

  // Генерация HTML отчёта

  let html = `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Превью компонентов</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
<h1 class="text-3xl font-bold mb-6">UI Компоненты — Превью</h1>

<table class="min-w-full bg-white shadow rounded-lg overflow-hidden">
<thead class="bg-gray-200">
<tr>
<th class="px-4 py-2 text-left">Компонент</th>
<th class="px-4 py-2 text-left">Превью</th>
</tr>
</thead>
<tbody>
`;

  for (const item of report) {
    html += `
<tr class="border-b hover:bg-gray-50">
<td class="px-4 py-2 font-semibold">${item.name}</td>
<td class="px-4 py-2 text-center">
  <img src="screenshots/${item.screenshot}" class="w-60 border rounded shadow">
</td>
</tr>`;
  }

  html += `
</tbody></table>
</body>
</html>`;

  fs.writeFileSync(path.join(REPORT_DIR, "index.html"), html);

  console.log(`\n✅ Готово: /reports/constructor-preview/index.html`);
}

run();
