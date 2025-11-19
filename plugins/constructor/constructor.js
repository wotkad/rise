#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("❌ Использование: rise constructor <component-v1> [--rewrite|--remove]");
  process.exit(0);
}

const componentArg = args[0]; // например header-v1
const flags = args.slice(1);

const componentParts = componentArg.split("-");
if (componentParts.length < 2) {
  console.error("❌ Неверный формат. Используйте возможные версии: component-v1 (например header-v1)");
  process.exit(0);
}

const name = componentParts.slice(0, -1).join("-"); // header (поддерживает имена с дефисами)
const version = componentParts[componentParts.length - 1]; // v1
const componentFileName = `${name}-${version}`; // header-v1

const rootDir = path.resolve(__dirname, "../..");
const sourceDir = path.join(__dirname, "components", name, version); // исходник остаётся components/<name>/<version>
const commonJsSource = path.join(__dirname, "js", `${name}.js`);

// целевые базовые папки
const basePaths = {
  js: path.join(rootDir, "src/assets/js/components"),
  styles: path.join(rootDir, "src/assets/styles/components"),
  views: path.join(rootDir, "src/views/components"),
  images: path.join(rootDir, "src/assets/images/components"),
};

const targetDirs = {
  styles: basePaths.styles, // файлы будут как styles/components/<componentFileName>.scss
  views: basePaths.views,   // views/components/<componentFileName>.pug
  images: path.join(basePaths.images, componentFileName), // images/components/<componentFileName>/*
  commonJs: path.join(basePaths.js, name), // js по-прежнему в components/<name>/<name>.js
};

const appScssPath = path.join(rootDir, "src/assets/styles/app.scss");
const appJsPath = path.join(rootDir, "src/assets/js/app.js");

// строки импорта — SCSS теперь с версией в имени, JS остаётся по имени компонента (без версии)
const importScssLine = `@use "@s-components/${componentFileName}" as *;`;
const importCommonJsLine = `import "@components/${name}/${name}";`;

// ---------- вспомогательные функции ----------
function removeImportLines(filePath, nameOrComponentFileName) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

  // удаляем как старый формат с папкой (например @s-components/header/header), так и новый формат с версией (@s-components/header-v1)
  const patterns = [
    // старый SCSS: @use "@s-components/header/header" as *;
    new RegExp(`^\\s*@use\\s+["']@s-components\\/${escapeRegExp(nameOrComponentFileName)}\\/${escapeRegExp(nameOrComponentFileName)}["']\\s+as\\s+\\*;?\\s*\\n?`, "gm"),
    // новый SCSS: @use "@s-components/header-v1" as *;
    new RegExp(`^\\s*@use\\s+["']@s-components\\/${escapeRegExp(nameOrComponentFileName)}["']\\s+as\\s+\\*;?\\s*\\n?`, "gm"),
    // старый JS: import "@components/header/header";
    new RegExp(`^\\s*import\\s+["']@components\\/${escapeRegExp(nameOrComponentFileName)}\\/${escapeRegExp(nameOrComponentFileName)}["'];?\\s*\\n?`, "gm"),
    // старый JS variant (if someone used import "@components/header"; ) - be conservative
    new RegExp(`^\\s*import\\s+["']@components\\/${escapeRegExp(nameOrComponentFileName)}["'];?\\s*\\n?`, "gm"),
  ];

  for (const regex of patterns) {
    content = content.replace(regex, "");
  }

  // очистка хвостовых пробельных строк
  content = content.replace(/\s+$/g, "");

  fs.writeFileSync(filePath, content, "utf8");
}

function appendImportLine(filePath, line) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(line)) {
    if (!content.endsWith("\n")) content += "\n";
    content += line + "\n";
    fs.writeFileSync(filePath, content, "utf8");
  }
}

function removeEmptyParent(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    const files = fs.readdirSync(dir);
    if (files.length === 0) {
      fs.rmdirSync(dir);
    }
  } catch (e) {
    // молча
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------- удаление целевых директорий/файлов для конкретного componentFileName ----------
function removeTargetDirs() {
  // стили и views — файлы с точным именем
  const styleFiles = [
    `${componentFileName}.scss`,
    `${componentFileName}.sass`,
  ];
  for (const sf of styleFiles) {
    const fp = path.join(targetDirs.styles, sf);
    if (fs.existsSync(fp)) {
      fs.rmSync(fp, { force: true });
    }
  }

  const viewFiles = [
    `${componentFileName}.pug`,
    `${componentFileName}.jade`,
    `${componentFileName}.html`,
  ];
  for (const vf of viewFiles) {
    const fp = path.join(targetDirs.views, vf);
    if (fs.existsSync(fp)) {
      fs.rmSync(fp, { force: true });
    }
  }

  // изображения — удаляем папку images/components/<componentFileName>
  if (fs.existsSync(targetDirs.images)) {
    fs.rmSync(targetDirs.images, { recursive: true, force: true });
    removeEmptyParent(path.dirname(targetDirs.images)); // пробуем удалить parent если пуст
  }

  // общий JS — path: src/assets/js/components/<name>/<name>.js
  const commonJsFile = path.join(targetDirs.commonJs, `${name}.js`);
  if (fs.existsSync(commonJsFile)) {
    fs.rmSync(commonJsFile, { force: true });
    removeEmptyParent(targetDirs.commonJs);
  }

  // убираем строчки импорта (удаляем и старые и новые шаблоны)
  removeImportLines(appScssPath, componentFileName);
  removeImportLines(appScssPath, name); // на всякий случай — старый формат
  removeImportLines(appJsPath, name);
}

// ---------- переписывание (удаление старой версии + создание новой) ----------
function rewriteTargetDirs() {
  removeTargetDirs();
}

// ---------- проверяем наличие точных целевых файлов/папок (чтобы понять alreadyExists) ----------
let alreadyExists = false;
// стиль
const styleExists = ["scss", "sass"].some(ext => fs.existsSync(path.join(targetDirs.styles, `${componentFileName}.${ext}`)));
// view
const viewExists = ["pug", "jade", "html"].some(ext => fs.existsSync(path.join(targetDirs.views, `${componentFileName}.${ext}`)));
// images directory
const imagesExists = fs.existsSync(targetDirs.images) && fs.statSync(targetDirs.images).isDirectory();
// common js file (по имени компонента без версии)
const commonJsExists = fs.existsSync(path.join(targetDirs.commonJs, `${name}.js`));

if (styleExists || viewExists || imagesExists || commonJsExists) {
  alreadyExists = true;
}

if (flags.includes("--rewrite")) {
  if (!alreadyExists) {
    console.log(`🚫 Компонент ${componentFileName} не существует.`);
    process.exit(0);
  }
  console.log(`♻️ Компонент ${componentFileName} перезаписан.`);
  rewriteTargetDirs();
  createComponent();
  process.exit(0);
}

if (flags.includes("--remove")) {
  if (!alreadyExists) {
    console.log(`🚫 Компонент ${componentFileName} не существует.`);
    process.exit(0);
  }
  removeTargetDirs();
  console.log(`🗑️ Компонент ${componentFileName} удалён.`);
  process.exit(0);
}

if (alreadyExists) {
  console.log(`🚫 Компонент ${componentFileName} уже создан — используйте флаг --rewrite`);
  process.exit(0);
}

// ---------- создание компонента ----------
createComponent();

function createComponent() {
  let hasCommonJs = false;

  // создаём директории, если их нет (styles и views принимают файлы напрямую)
  if (!fs.existsSync(targetDirs.styles)) fs.mkdirSync(targetDirs.styles, { recursive: true });
  if (!fs.existsSync(targetDirs.views)) fs.mkdirSync(targetDirs.views, { recursive: true });
  if (!fs.existsSync(path.dirname(targetDirs.images))) fs.mkdirSync(path.dirname(targetDirs.images), { recursive: true });

  // копируем общий JS компонента (в папку components/<name>/<name>.js)
  if (fs.existsSync(commonJsSource)) {
    if (!fs.existsSync(targetDirs.commonJs)) {
      fs.mkdirSync(targetDirs.commonJs, { recursive: true });
    }

    fs.copyFileSync(commonJsSource, path.join(targetDirs.commonJs, `${name}.js`));
    hasCommonJs = true;
  }

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Исходник компонента ${name}-${version} не найден в ${sourceDir}`);
    process.exit(0);
  }

  const files = fs.readdirSync(sourceDir);

  // копируем scss/sass -> styles/components/<componentFileName>.scss
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const srcFile = path.join(sourceDir, file);

    if (ext === ".js") continue; // исходный js игнорируем (мы копируем общий js отдельно)

    if (ext === ".scss" || ext === ".sass") {
      const destName = `${componentFileName}${ext}`;
      fs.copyFileSync(srcFile, path.join(targetDirs.styles, destName));
    } else if (ext === ".pug" || ext === ".jade" || ext === ".html") {
      const destName = `${componentFileName}${ext}`;
      fs.copyFileSync(srcFile, path.join(targetDirs.views, destName));
    }
    // остальные файлы (картинки и т.п.) обработаем рекурсивно
  }

  // рекурсивно копируем все изображения/ресурсы, игнорируя исходники кода
  copyImagesRecursively(sourceDir, targetDirs.images);

  // удаляем старые строки импорта и добавляем новые
  // удаляем возможные старые строки (и со старым форматом и с новым)
  removeImportLines(appScssPath, componentFileName);
  removeImportLines(appScssPath, name);
  removeImportLines(appJsPath, name);

  // добавляем новую строку импорта для scss (с версией в имени)
  appendImportLine(appScssPath, importScssLine);

  // добавляем импорт общего js (если есть)
  if (hasCommonJs) {
    appendImportLine(appJsPath, importCommonJsLine);
  }

  console.log(`✅ Компонент ${componentFileName} успешно создан и подключён!`);
}

// функция для рекурсивного копирования изображений/ресурсов
function copyImagesRecursively(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;

  const entries = fs.readdirSync(srcDir);

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // рекурсивно копируем папки (сохраняя структуру внутри destDir/<subdirs> )
      copyImagesRecursively(srcPath, destDir);
    } else {
      const ext = path.extname(entry).toLowerCase();
      // игнорируем исходники компонента
      if ([".js", ".scss", ".sass", ".pug", ".jade", ".html"].includes(ext)) continue;

      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      // имя файла оставляем как в исходнике (внутри images/components/<componentFileName>/)
      const destPath = path.join(destDir, entry);
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
