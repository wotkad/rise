#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ---------- Папка для отчётов ----------
const REPORTS_DIR = path.resolve(__dirname, "../../reports/lighthouse");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// ---------- Очистка старых отчётов ----------
fs.readdirSync(REPORTS_DIR)
  .filter(file => file.startsWith("lighthouse-report"))
  .forEach(file => fs.unlinkSync(path.join(REPORTS_DIR, file)));

console.log("🧹 Старые отчёты удалены.");

// ---------- Форматирование даты ----------
function formatDate(d) {
  const pad = (n) => String(n).padStart(2, "0");
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
}

const timestamp = formatDate(new Date());
const url = "http://localhost:8080";

// ---------- Конфигурации для двух режимов ----------
const configs = [
  { name: "mobile", flags: "" },
  { name: "desktop", flags: "--preset=desktop" }
];

// ---------- Запуск Lighthouse для каждого режима ----------
for (const { name, flags } of configs) {
  const reportFile = path.join(REPORTS_DIR, `lighthouse-report-${name}-${timestamp}.html`);

  const command = [
    "npx lighthouse",
    url,
    "--quiet",
    "--chrome-flags='--headless --no-sandbox --disable-gpu'",
    "--output html",
    `--output-path=${reportFile}`,
    "--only-categories=performance,accessibility,best-practices,seo",
    flags
  ].join(" ");

  console.log(`🚀 Запуск Lighthouse для ${name} версии...`);

  try {
    execSync(command, { stdio: "inherit" });
    console.log(`✅ ${name}-отчёт сохранён: /reports/lighthouse-report-${name}-${timestamp}.html`);
  } catch (err) {
    console.error(`❌ Ошибка при запуске Lighthouse (${name}):`, err.message);
  }
}

console.log("✅ Готово: отчёты сохранены в /reports/lighthouse");
