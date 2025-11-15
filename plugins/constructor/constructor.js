#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("❌ Использование: rise constructor <component-v1> [--rewrite|--remove]");
  process.exit(0);
}

const componentArg = args[0];
const flags = args.slice(1);

const [name, version] = componentArg.split("-");

if (!name || !version) {
  console.error("❌ Неверный формат. Используйте: component-v1");
  process.exit(0);
}

const rootDir = path.resolve(__dirname, "../..");

// исходники версии (pug, scss и т.д.) находятся в plugins/constructor/components/<name>/<version>
const sourceDir = path.join(__dirname, "components", name, version);

// общий (без версии) JS-файл для компонента: plugins/constructor/js/<name>.js
const commonJsSource = path.join(__dirname, "js", `${name}.js`);

const basePaths = {
  // где хранятся общие (без версии) js для компонентов
  js: path.join(rootDir, "src/assets/js/components"),
  styles: path.join(rootDir, "src/assets/styles/components"),
  views: path.join(rootDir, "src/views/components"),
  images: path.join(rootDir, "src/assets/images/components"),
};

if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Компонент ${name}-${version} не найден в ${sourceDir}`);
  process.exit(0);
}

const componentFolderName = `${name}-${version}`; // header-v1
const fileBaseName = `${name}-${version}`; // header-v1

const targetDirs = {
  // SCSS / views / images — кладём в папку с версией
  styles: path.join(basePaths.styles, componentFolderName),
  views: path.join(basePaths.views, componentFolderName),
  images: path.join(basePaths.images, componentFolderName),
  // JS — кладём в папку без версии: src/assets/js/components/<name>/<name>.js
  commonJs: path.join(basePaths.js, name),
};

const appScssPath = path.join(rootDir, "src/assets/styles/app.scss");
const appJsPath = path.join(rootDir, "src/assets/js/app.js");

// импорт scss версии (например: @use "@components/header-v1/header-v1";)
const importScssLine = `@use "@s-components/${componentFolderName}/${fileBaseName}";`;
// НЕ импортируем версию JS (требование) — вместо этого подключаем общий js ниже

// импорт общего JS (без версии): import "@components/header/header.js";
const importCommonJsLine = `import "@components/${name}/${name}";`;

/**
 * Удаляет строки импортов из файла (scss/js).
 * Очищает:
 *  - @use "@components/<name>-vX/<name>-vX";
 *  - import "@components/<name>-vX/<name>-vX";
 *  - import "@components/<name>/<name>.js";
 */
function removeImportLines(filePath, name) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

  // @use "@components/<name>-vX/<name>-vX";
  const scssRegex = new RegExp(
    `^\\s*@use\\s+["']@s-components\\/${name}-v\\d+\\/${name}-v\\d+["'];?\\s*\\n?`,
    "gm"
  );

  // import "@components/<name>-vX/<name>-vX";
  const jsVersionedRegex = new RegExp(
    `^\\s*import\\s+["']@components\\/${name}-v\\d+\\/${name}-v\\d+["'];?\\s*\\n?`,
    "gm"
  );

  // import "@components/<name>/<name>.js";
  const commonJsRegex = new RegExp(
    `^\\s*import\\s+["']@components\\/${name}\\/${name}["'];?\\s*\\n?`,
    "gm"
  );

  content = content
    .replace(scssRegex, "")
    .replace(jsVersionedRegex, "")
    .replace(commonJsRegex, "")
    .replace(/\s+$/, "");

  fs.writeFileSync(filePath, content, "utf8");
}

function appendImportLine(filePath, line) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(line)) {
    if (!content.endsWith("\n")) content += "\n";
    content += line;
    fs.writeFileSync(filePath, content, "utf8");
  }
}

function removeEmptyParent(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    try {
      fs.rmdirSync(dir);
    } catch (e) {
      // ignore if cannot remove
    }
  }
}

/**
 * Удаляем таргеты:
 *  - папки версий (styles, views, images)
 *  - общий js для компонента (src/assets/js/components/<name>/<name>.js)
 *  - чистим импорты в app.scss и app.js
 */
function removeTargetDirs() {
  // версии
  const versionDirs = [targetDirs.styles, targetDirs.views, targetDirs.images];
  for (const dir of versionDirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      removeEmptyParent(path.dirname(dir));
    }
  }

  // общий js
  const commonJsFile = path.join(targetDirs.commonJs, `${name}.js`);
  if (fs.existsSync(commonJsFile)) {
    fs.rmSync(commonJsFile, { force: true });
    removeEmptyParent(targetDirs.commonJs);
  }

  // удаляем импорты
  removeImportLines(appScssPath, name);
  removeImportLines(appJsPath, name);
}

function rewriteTargetDirs() {
  // переписываем: удаляем версии и общий js, затем создадим заново
  removeTargetDirs();
}

let alreadyExists = false;

// считаем что компонент "существует", если есть либо версия (styles/views), либо общий js
if (
  (fs.existsSync(targetDirs.styles) && fs.readdirSync(targetDirs.styles).length > 0) ||
  (fs.existsSync(targetDirs.views) && fs.readdirSync(targetDirs.views).length > 0) ||
  (fs.existsSync(targetDirs.images) && fs.readdirSync(targetDirs.images).length > 0) ||
  (fs.existsSync(path.join(targetDirs.commonJs, `${name}.js`)))
) {
  alreadyExists = true;
}

if (flags.includes("--rewrite")) {
  if (!alreadyExists) {
    console.log(`🚫 Компонент ${name} не существует.`);
    process.exit(0);
  } else {
    console.log(`♻️ Компонент ${name} перезаписан.`);
    rewriteTargetDirs();
    createComponent();
    process.exit(0);
  }
}

if (flags.includes("--remove")) {
  if (!alreadyExists) {
    console.log(`🚫 Компонент ${name} не существует.`);
    process.exit(0);
  } else {
    removeTargetDirs();
    console.log(`🗑️ Компонент ${name} удалён.`);
    process.exit(0);
  }
}

if (alreadyExists) {
  console.log(`🚫 Компонент ${name} не создан, так как уже существует (используйте --rewrite для перезаписи)`);
  process.exit(0);
}

createComponent();

function createComponent() {
  // создаём папки для версии (styles/views/images)
  for (const key of ["styles", "views", "images"]) {
    const dir = targetDirs[key];
    const parent = path.dirname(dir);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  }

  // создаём папку для общего js: src/assets/js/components/<name>
  if (!fs.existsSync(targetDirs.commonJs)) {
    fs.mkdirSync(targetDirs.commonJs, { recursive: true });
  }

  // читаем исходники версии
  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const srcFile = path.join(sourceDir, file);

    // Примечание: мы НЕ копируем JS из версии (чтобы не создавать versioned js).
    // Все JS-файлы общего назначения берутся из /plugins/constructor/js/<name>.js
    if (ext === ".js") {
      // пропускаем — общий js копируется отдельно ниже
      continue;
    } else if (ext === ".scss" || ext === ".sass") {
      // сохраняем scss под именем <name>-vX.scss
      fs.copyFileSync(srcFile, path.join(targetDirs.styles, `${fileBaseName}${ext}`));
    } else if (ext === ".pug" || ext === ".jade" || ext === ".html") {
      fs.copyFileSync(srcFile, path.join(targetDirs.views, `${fileBaseName}${ext}`));
    } else {
      // любые другие файлы (например JSON/инфо) копируем в папку версии
      // (можно убрать, если не нужно)
      const targetOther = path.join(targetDirs.views, file);
      try {
        fs.copyFileSync(srcFile, targetOther);
      } catch (e) {
        // ignore
      }
    }
  }

  // копируем изображения, если есть
  const imagesDir = path.join(sourceDir, "images");
  if (fs.existsSync(imagesDir)) {
    const targetImagesDir = targetDirs.images;
    if (!fs.existsSync(targetImagesDir)) fs.mkdirSync(targetImagesDir, { recursive: true });

    for (const img of fs.readdirSync(imagesDir)) {
      const srcImg = path.join(imagesDir, img);
      const destImg = path.join(targetImagesDir, img);
      fs.copyFileSync(srcImg, destImg);
    }
  }

  // копируем общий JS (если существует)
  if (fs.existsSync(commonJsSource)) {
    const destCommonJs = path.join(targetDirs.commonJs, `${name}.js`);
    fs.copyFileSync(commonJsSource, destCommonJs);
  }

  // обновляем импорты:
  //  - в app.scss добавляем @use "@components/<name>-vX/<name>-vX";
  //  - в app.js добавляем только import "@components/<name>/<name>.js";
  removeImportLines(appScssPath, name);
  removeImportLines(appJsPath, name);

  appendImportLine(appScssPath, importScssLine);

  // добавляем только общий js, НИКАКОГО import версии js
  appendImportLine(appJsPath, importCommonJsLine);

  console.log(`✅ Компонент ${name}-${version} успешно создан и подключён!`);
}
