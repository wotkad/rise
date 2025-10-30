#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.resolve(__dirname, "../../build");
const SRC_ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const SRC_VIEWS_DIR = path.resolve(__dirname, "../../src/views");
const REPORTS_DIR = path.resolve(__dirname, "../../reports/sizes");
const REPORT_FILE = path.join(REPORTS_DIR, "sizes.txt");
const CACHE_FILE = path.join(REPORTS_DIR, "cache.json");
const LOG_FILE = path.join(REPORTS_DIR, "log.txt");

function getFilesRecursive(dir, exts) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFilesRecursive(fullPath, exts));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (!exts || exts.includes(ext)) results.push({ path: fullPath, size: stat.size });
    }
  });
  return results;
}

function formatSize(size) {
  return (size / 1024).toFixed(2);
}

function formatDate() {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function calculateSizes(dir, exts) {
  const files = getFilesRecursive(dir, exts);

  const totals = { js: 0, css: 0, pug: 0, img: 0, other: 0 };
  files.forEach(f => {
    const ext = path.extname(f.path).toLowerCase();
    if ([".js"].includes(ext)) totals.js += f.size;
    else if ([".css", ".scss"].includes(ext)) totals.css += f.size;
    else if ([".pug"].includes(ext)) totals.pug += f.size;
    else if ([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"].includes(ext)) totals.img += f.size;
    else totals.other += f.size;
  });

  const totalAll = totals.js + totals.css + totals.pug + totals.img + totals.other;
  return { files, ...totals, total: totalAll };
}

function loadCache() {
  if (!fs.existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cacheData) {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), "utf8");
}

function makeReportSection(title, data, cacheSection, baseDir, isBuild = false) {
  if (!data.files || data.files.length === 0) {
    const summary = [
      title,
      `JS: ${formatSize(data.js)} КБ | CSS/SCSS: ${formatSize(data.css)} КБ | PUG: ${formatSize(data.pug)} КБ | IMG: ${formatSize(data.img)} КБ | Прочие: ${formatSize(data.other)} КБ`,
      `Итого: ${formatSize(data.total)} КБ`,
      "",
      "Файл | Размер (КБ) | Изменение",
      "-".repeat(30),
      isBuild ? "⚠️ Сборка не найдена." : "Нет файлов",
      "-".repeat(30),
      ""
    ].join("\n");

    const cacheSectionNew = isBuild ? { "⚠️ Сборка не найдена.": 0 } : {};

    return { summary, deleted: [], cacheSectionNew };
  }

  const rows = data.files
    .sort((a, b) => b.size - a.size)
    .map(f => {
      let rel;
      if (f.path.startsWith(BUILD_DIR)) {
        rel = "/build/" + path.relative(BUILD_DIR, f.path).replace(/\\/g, "/");
      } else if (f.path.startsWith(SRC_ASSETS_DIR)) {
        rel = "/src/assets/" + path.relative(SRC_ASSETS_DIR, f.path).replace(/\\/g, "/");
      } else if (f.path.startsWith(SRC_VIEWS_DIR)) {
        rel = "/src/views/" + path.relative(SRC_VIEWS_DIR, f.path).replace(/\\/g, "/");
      } else {
        rel = "/src/" + path.relative(path.resolve(__dirname, "../src"), f.path).replace(/\\/g, "/");
      }

      const sizeKB = parseFloat(formatSize(f.size));
      const oldSize = cacheSection[rel];
      let changeMark = "—";
      if (oldSize) {
        const oldKB = oldSize / 1024;
        const diff = ((sizeKB - oldKB) / oldKB) * 100;
        if (diff > 5) changeMark = `⚠️  +${diff.toFixed(1)}%`;
        else if (diff < -5) changeMark = `✅ ${diff.toFixed(1)}%`;
        else changeMark = "-";
      } else {
        changeMark = "🆕 Новый";
      }

      return { rel, sizeKB, changeMark };
    });

  const deleted = Object.keys(cacheSection).filter(oldFile => !rows.some(r => r.rel === oldFile));

  const maxNameLen = Math.max(...rows.map(r => r.rel.length), "Файл".length);
  const maxSizeLen = Math.max(...rows.map(r => r.sizeKB.toString().length + 3), "Размер (КБ)".length);

  const tableHeader = `${"Файл".padEnd(maxNameLen)} | ${"Размер (КБ)".padEnd(maxSizeLen)} | Изменение`;
  const divider = "-".repeat(tableHeader.length);

  const fileLines = rows
    .map(r => `${r.rel.padEnd(maxNameLen)} | ${r.sizeKB.toFixed(2).padStart(maxSizeLen)} | ${r.changeMark}`)
    .join("\n");

  let deletedLines = "";
  if (deleted.length > 0) {
    deletedLines =
      "\n\nУдалённые файлы:\n" +
      "-".repeat(40) +
      "\n" +
      deleted.map(f => `❌ ${f}`).join("\n") +
      "\n";
  }

  const summary = [
    title,
    `JS: ${formatSize(data.js)} КБ | CSS/SCSS: ${formatSize(data.css)} КБ | PUG: ${formatSize(data.pug)} КБ | IMG: ${formatSize(data.img)} КБ | Прочие: ${formatSize(data.other)} КБ`,
    `Итого: ${formatSize(data.total)} КБ`,
    "",
    tableHeader,
    divider,
    fileLines + deletedLines,
    divider,
    ""
  ].join("\n");

  const cacheSectionNew = Object.fromEntries(rows.map(r => [r.rel, Math.round(r.sizeKB * 1024)]));

  return { summary, deleted, cacheSectionNew };
}

function writeReport(buildData, srcData, cache) {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const dateStr = formatDate();
  const header = [
    "================= ОТЧЁТ СБОРКИ =================",
    `Дата: ${dateStr}`,
    "------------------------------------------------"
  ].join("\n");

  const buildSection = makeReportSection(
    "📦 Файлы сборки (build)",
    buildData,
    cache.build || {},
    BUILD_DIR,
    true
  );
  const srcSection = makeReportSection("🧩 Исходные файлы (src)", srcData, cache.src || {}, SRC_ASSETS_DIR + "|" + SRC_VIEWS_DIR);

  const footer = "\n\n";
  const output = `${header}\n${buildSection.summary}\n${srcSection.summary}${footer}`;

  let oldContent = "";
  if (fs.existsSync(REPORT_FILE)) oldContent = fs.readFileSync(REPORT_FILE, "utf8");
  fs.writeFileSync(REPORT_FILE, output + oldContent, "utf8");

  return {
    newCache: { build: buildSection.cacheSectionNew, src: srcSection.cacheSectionNew },
    deleted: [...buildSection.deleted, ...srcSection.deleted]
  };
}


function appendLog(buildData, srcData, deleted) {
  const dateStr = formatDate();
  const totalKB = ((buildData.total + srcData.total) / 1024).toFixed(2);

  const lines = [`[${dateStr}] Общий размер (build + src): ${totalKB} КБ`];

  lines.push("📦 Build:");
  if (!buildData.files || buildData.files.length === 0) {
    lines.push(" ⚠️ Сборка не найдена.");
  } else {
    buildData.files.forEach(f => {
      const rel = path.relative(BUILD_DIR, f.path).replace(/\\/g, "/");
      lines.push(`  + ${rel} (${formatSize(f.size)} КБ)`);
    });
  }

  lines.push("🧩 Src:");
  if (!srcData.files || srcData.files.length === 0) {
    lines.push(" ⚠️ Исходные файлы не найдены.");
  } else {
    srcData.files.forEach(f => {
      let rel;
      if (f.path.startsWith(SRC_ASSETS_DIR)) rel = path.relative(SRC_ASSETS_DIR, f.path).replace(/\\/g, "/");
      else if (f.path.startsWith(SRC_VIEWS_DIR)) rel = path.relative(SRC_VIEWS_DIR, f.path).replace(/\\/g, "/");
      else rel = path.relative(path.resolve(__dirname, "../src"), f.path).replace(/\\/g, "/");
      lines.push(`  + ${rel} (${formatSize(f.size)} КБ)`);
    });
  }

  if (deleted.length) {
    lines.push("❌ Удалённые файлы:");
    deleted.forEach(f => lines.push(`  - ${f}`));
  }

  lines.push("");

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  let oldLog = "";
  if (fs.existsSync(LOG_FILE)) oldLog = fs.readFileSync(LOG_FILE, "utf8");
  fs.writeFileSync(LOG_FILE, lines.join("\n") + oldLog, "utf8");
}

function main() {
  const cache = loadCache();

  const buildExists = fs.existsSync(BUILD_DIR);
  const buildData = buildExists
    ? calculateSizes(BUILD_DIR, [".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"])
    : { files: [], js: 0, css: 0, pug: 0, img: 0, other: 0, total: 0 };
  const srcAssetsData = calculateSizes(SRC_ASSETS_DIR, [".js", ".scss", ".png", ".jpg", ".jpeg", ".svg", ".webp"]);
  const srcViewsData = calculateSizes(SRC_VIEWS_DIR, [".pug"]);
  const srcData = {
    files: [...srcAssetsData.files, ...srcViewsData.files],
    js: srcAssetsData.js,
    css: srcAssetsData.css,
    pug: srcViewsData.pug,
    img: srcAssetsData.img,
    other: srcAssetsData.other,
    total: srcAssetsData.total + srcViewsData.total
  };

  const { newCache, deleted } = writeReport(buildData, srcData, cache);
  saveCache(newCache);
  appendLog(buildData, srcData, deleted);

  console.log(`✅ Готово: отчёт о размерах файлов сохранён в (/reports/sizes)`);
}

main();
