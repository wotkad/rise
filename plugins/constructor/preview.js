#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const pug = require("pug");
const { compile } = require("sass");
const puppeteer = require("puppeteer");

const COMPONENTS_ROOT = path.resolve(__dirname, "./components");
const REPORT_DIR = path.resolve(__dirname, "../../reports/constructor");
const SCREENSHOT_DIR = path.join(REPORT_DIR, "screenshots");

const SCSS_ALIASES = {
  "@s-base": path.resolve(__dirname, "../../src/assets/styles/base"),
  "@s-mixins": path.resolve(__dirname, "../../src/assets/styles/mixins"),
  "@fonts": path.resolve(__dirname, "../../src/assets/fonts"),
};

const IMAGES_PATH = path.resolve(__dirname, "../../src/assets/images");

const GLOBAL_SCSS = [
  path.resolve(__dirname, "../../src/assets/styles/utils/reset.scss"),
  path.resolve(__dirname, "../../src/assets/styles/base/fonts.scss"),
  path.resolve(__dirname, "../../src/assets/styles/base/global.scss"),
];

fs.rmSync(REPORT_DIR, { recursive: true, force: true });
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

console.log("🚀 Генерация превью компонентов...");

function findComponents() {
  const dirs = glob.sync(path.join(COMPONENTS_ROOT, "*/*/"), { absolute: true });
  const components = [];

  dirs.forEach((dir) => {
    const pugFiles = glob.sync(path.join(dir, "*.pug"));
    if (!pugFiles.length) return;

    const parts = dir.split(path.sep);
    const compName = parts[parts.length - 2];
    const version = parts[parts.length - 1];

    const pugFile = pugFiles[0];
    const scssFile = glob.sync(path.join(dir, "*.scss"))[0] || null;

    components.push({
      name: `${compName}-${version}`,
      pugFile,
      scssFile,
      compName,
      version,
    });
  });

  return components;
}

function replaceImageAliases(pugFile) {
  const componentDir = path.dirname(pugFile);               // /components/header/v1
  const compName = path.basename(componentDir);             // v1
  const parentName = path.basename(path.dirname(componentDir)); // header
  let content = fs.readFileSync(pugFile, "utf-8");

  content = content.replace(/require\(["']@images\/([^\s'")]+)["']\)/g, (_match, p1) => {

    // убираем components/header/ если есть
    p1 = p1.replace(new RegExp(`^components/${parentName}/`), "");

    // путь к папке картинок: /components/header/v1/header/
    const localPath = path.join(componentDir, parentName, p1);

    if (fs.existsSync(localPath)) {
      return encodeFileToBase64(localPath);
    }

    const globalPath = path.join(IMAGES_PATH, p1);
    if (fs.existsSync(globalPath)) {
      return encodeFileToBase64(globalPath);
    }

    console.warn(`⚠️ Картинка не найдена: ${p1}`);
    return '""';
  });

  return content;
}

function encodeFileToBase64(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = getMime(ext);
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString("base64");
  return `"data:${mime};base64,${base64}"`;
}

function getMime(ext) {
  switch (ext) {
    case ".svg": return "image/svg+xml";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".webp": return "image/webp";
    case ".gif": return "image/gif";
    default: return "application/octet-stream";
  }
}

function compileScss(file) {
  let css = compile(file, {
    importers: [
      {
        findFileUrl(url) {
          for (const alias in SCSS_ALIASES) {
            if (url.startsWith(alias + "/")) {
              const realPath = path.resolve(
                SCSS_ALIASES[alias],
                url.replace(alias + "/", "") + ".scss"
              );
              return new URL(`file://${realPath}`);
            }
          }
          return null;
        },
      },
    ],
  }).css;

  return css.replace(/url\(["']?([^"')]+)["']?\)/g, (match, p1) => {
    if (p1.startsWith("file://")) {
      const localPath = new URL(p1);
      const relPath = path.relative(REPORT_DIR, localPath).replace(/\\/g, "/");
      return `url("${relPath}")`;
    }
    return match;
  });
}

function renderComponent(component) {
  const { pugFile, scssFile } = component;

  const scssFilesToCompile = [...GLOBAL_SCSS];
  if (scssFile) scssFilesToCompile.push(scssFile);

  let css = "";
  scssFilesToCompile.forEach((file) => {
    css += compileScss(file) + "\n";
  });

  const pugContent = replaceImageAliases(pugFile);
  const htmlBody = pug.compile(pugContent)();

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
${css}

/* Отключаем fixed элементы только для скриншота */
* {
  position: relative !important;
}
body { background: #fff; }
</style>
</head>
<body>
<div id="root">
${htmlBody}
</div>
</body>
</html>`;
}
(async function run() {
  const components = findComponents();
  console.log(`📦 Найдено компонентов: ${components.length}`);

  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1470, height: 1200 },
  });

  const report = [];

  for (const comp of components) {
    try {
      console.log(`⏳ Рендерим ${comp.name}`);
      const html = renderComponent(comp);
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.waitForSelector("#root", { visible: true });

      const el = await page.$("#root");
      let box = await el.boundingBox();

      const screenshotName = `${comp.compName}-${comp.version}.webp`;
      const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);

      if (!box || box.height === 0 || box.width === 0) {
        console.warn(`⚠️ ${comp.name} пустой или fixed, делаем fullPage скрин`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
          type: "webp",
          quality: 100,
        });
      } else {
        await page.screenshot({
          path: screenshotPath,
          clip: box,
          type: "webp",
          quality: 100,
        });
      }

      await page.close();
      report.push({ name: `${comp.compName}-${comp.version}`, screenshot: screenshotName });
      console.log(`📸 Скриншот "${comp.name}" готов!`);
    } catch (err) {
      console.error(`❌ Ошибка при генерации ${comp.name}:`, err);
    }
  }

  await browser.close();

  let htmlReport = `
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

// сортировка по алфавиту и версии
report.sort((a, b) => {
  const parse = (name) => {
    const [comp, ver] = name.split("-v");
    return { comp, version: Number(ver) };
  };

  const A = parse(a.name);
  const B = parse(b.name);

  if (A.comp < B.comp) return -1;
  if (A.comp > B.comp) return 1;

  return A.version - B.version;
});

// генерация HTML
for (const item of report) {
  htmlReport += `
<tr class="border-b hover:bg-gray-50">
<td class="px-4 py-2 font-semibold min-w-64">${item.name}</td>
<td class="px-4 py-2 text-center">
  <img src="screenshots/${item.screenshot}" class="border rounded shadow object-contain w-full h-full">
</td>
</tr>`;
}

  htmlReport += `
</tbody></table>
</body>
</html>`;

  fs.writeFileSync(path.join(REPORT_DIR, "report.html"), htmlReport);
  console.log(`✅ Готово: отчёт о компонентах доступен в (/reports/constructor)`);
})();
