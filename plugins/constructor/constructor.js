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
  mixinsViews: path.join(rootDir, "src/views/mixins"),
  mixinsStyles: path.join(rootDir, "src/assets/styles/mixins"),
  defaults: path.join(rootDir, "src/assets/js/_defaults"),
};

const targetDirs = {
  styles: basePaths.styles,
  views: basePaths.views,
  images: path.join(basePaths.images, componentFileName),
  commonJs: path.join(basePaths.js, name),
  mixinViews: path.join(basePaths.mixinsViews, componentFileName),
  mixinStyles: path.join(basePaths.mixinsStyles, componentFileName),
  defaults: path.join(basePaths.defaults, componentFileName),
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
    content += line;
    fs.writeFileSync(filePath, content, "utf8");
  }
}

function removeEmptyParent(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    const items = fs.readdirSync(dir).filter(i => i !== "." && i !== "..");
    if (items.length === 0) {
      fs.rmdirSync(dir);
    }
  } catch (_) {}
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
  }

  // после удаления папки компонента, удаляем /src/assets/images/components если она пуста
  removeIfDirEmpty(basePaths.images);

  // общий JS — path: src/assets/js/components/<name>/<name>.js
  const commonJsFile = path.join(targetDirs.commonJs, `${name}.js`);
  if (fs.existsSync(commonJsFile)) {
    fs.rmSync(commonJsFile, { force: true });
    removeEmptyParent(targetDirs.commonJs);
  }

  // миксины pug
  if (fs.existsSync(targetDirs.mixinViews)) {
    fs.rmSync(targetDirs.mixinViews, { recursive: true, force: true });
    removeIfDirEmpty(basePaths.mixinsViews);
  }
  // миксины scss
  if (fs.existsSync(targetDirs.mixinStyles)) {
    fs.rmSync(targetDirs.mixinStyles, { recursive: true, force: true });
    removeIfDirEmpty(basePaths.mixinsStyles);
  }
  // _defaults
  if (fs.existsSync(targetDirs.defaults)) {
    fs.rmSync(targetDirs.defaults, { recursive: true, force: true });
    removeIfDirEmpty(basePaths.defaults);
  }

  // миксины pug/styles: ищем папки миксинов внутри компонента
  const mixinDirs = fs.existsSync(sourceDir)
    ? fs.readdirSync(sourceDir).filter(d => {
        const fullPath = path.join(sourceDir, d);
        return fs.statSync(fullPath).isDirectory() && d !== name; // игнорируем папку компонента
      })
    : [];

  for (const mixinDir of mixinDirs) {
    const mixinFolderName = `${mixinDir}-${version}`;
    const mixinTargetViews = path.join(basePaths.mixinsViews, mixinFolderName);
    const mixinTargetStyles = path.join(basePaths.mixinsStyles, mixinFolderName);
    const mixinTargetDefaults = path.join(basePaths.defaults, mixinFolderName);

    if (fs.existsSync(mixinTargetViews)) fs.rmSync(mixinTargetViews, { recursive: true, force: true });
    if (fs.existsSync(mixinTargetStyles)) fs.rmSync(mixinTargetStyles, { recursive: true, force: true });
    if (fs.existsSync(mixinTargetDefaults)) fs.rmSync(mixinTargetDefaults, { recursive: true, force: true });

    // удаляем подключение миксина в app.scss
    const mixinFiles = fs.existsSync(path.join(sourceDir, mixinDir))
      ? fs.readdirSync(path.join(sourceDir, mixinDir)).filter(f => f.endsWith(".scss"))
      : [];
    for (const mf of mixinFiles) {
      removeMixinFromAppScss(mixinFolderName, mf);
    }
  }

  function removeIfDirEmpty(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir).filter(i => i !== "." && i !== "..");
    if (items.length === 0) {
      try {
        fs.rmdirSync(dir);
      } catch (_) {}
    }
  }

  // убираем строчки импорта (удаляем и старые и новые шаблоны)
  removeImportLines(appScssPath, componentFileName);
  removeImportLines(appScssPath, name); // на всякий случай — старый формат
  removeImportLines(appJsPath, name);

  // удаление пустых директорий /components
  removeIfDirEmpty(basePaths.styles);
  removeIfDirEmpty(basePaths.views);
  removeIfDirEmpty(basePaths.js);
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

function removeMixinFromAppScss(mixinName, mixinFile) {
  const filePath = appScssPath;
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const lines = content.split("\n");

  const importBase = mixinFile.replace(/\.scss$/i, "");
  const importLine = `@use "@s-mixins/${mixinName}/${importBase}" as *;`;

  const filtered = lines.filter(line => line !== importLine);

  if (filtered.length !== lines.length) {
    fs.writeFileSync(filePath, filtered.join("\n"), "utf8");
  }
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

  // миксины pug/styles: ищем папки миксинов внутри компонента
  const mixinDirs = fs.existsSync(sourceDir)
    ? fs.readdirSync(sourceDir).filter(d => {
        const fullPath = path.join(sourceDir, d);
        // проверяем, что это папка и не совпадает с именем компонента
        return fs.statSync(fullPath).isDirectory() && d !== name;
      })
    : [];

  // ---------- внутри createComponent(), после копирования файлов миксина ----------
  for (const mixinDir of mixinDirs) {
    const mixinSourcePath = path.join(sourceDir, mixinDir);
    const mixinFolderName = `${mixinDir}-${version}`;
    const mixinTargetViews = path.join(basePaths.mixinsViews, mixinFolderName);
    const mixinTargetStyles = path.join(basePaths.mixinsStyles, mixinFolderName);
    const mixinTargetDefaults = path.join(basePaths.defaults, mixinFolderName);

    if (!fs.existsSync(mixinTargetViews)) fs.mkdirSync(mixinTargetViews, { recursive: true });
    if (!fs.existsSync(mixinTargetStyles)) fs.mkdirSync(mixinTargetStyles, { recursive: true });
    if (!fs.existsSync(mixinTargetDefaults)) fs.mkdirSync(mixinTargetDefaults, { recursive: true });

    const mixinFiles = fs.readdirSync(mixinSourcePath);
    for (const mf of mixinFiles) {
      const ext = path.extname(mf).toLowerCase();
      const srcFile = path.join(mixinSourcePath, mf);

      if ([".pug", ".jade", ".html"].includes(ext)) {
        fs.copyFileSync(srcFile, path.join(mixinTargetViews, mf));
      } else if ([".scss", ".sass"].includes(ext)) {
        fs.copyFileSync(srcFile, path.join(mixinTargetStyles, mf));
        if (mf.endsWith(".scss")) appendMixinToAppScss(mixinFolderName, mf);
      } else if (mf === "_defaults.js") {
        fs.copyFileSync(srcFile, path.join(mixinTargetDefaults, "_defaults.js"));
      }
    }
  }

  // ---------- функция для подключения миксина в app.scss ----------
  function appendMixinToAppScss(mixinName, mixinFile) {
    const filePath = appScssPath;
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
    const lines = content.split("\n");

    // убираем расширение и добавляем as *;
    const importBase = mixinFile.replace(/\.scss$/i, "");
    const newImportLine = `@use "@s-mixins/${mixinName}/${importBase}" as *;`;

    if (!lines.includes(newImportLine)) {
      let lastUseIndex = -1;

      lines.forEach((line, i) => {
        if (line.includes(`@use "@s-mixins/`)) lastUseIndex = i;
      });

      if (lastUseIndex !== -1) {
        lines.splice(lastUseIndex + 1, 0, newImportLine);
      } else {
        // если не найдено ни одного @use "@s-mixins/", вставляем в начало файла
        lines.unshift(newImportLine);
      }

      // удаляем пустые строки в конце файла
      while (lines.length && lines[lines.length - 1].trim() === "") {
        lines.pop();
      }

      fs.writeFileSync(filePath, lines.join("\n"), "utf8");
    }
  }


  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const srcFile = path.join(sourceDir, file);

    if (ext === ".js") continue;

    // SCSS миксин
    if (file === `${name}${ext}` && (ext === ".scss" || ext === ".sass")) {
      fs.copyFileSync(
        srcFile,
        path.join(targetDirs.styles, `${componentFileName}${ext}`)
      );
    }
    // PUG миксин
    else if (file === `${name}${ext}` && (ext === ".pug" || ext === ".jade" || ext === ".html")) {
      fs.copyFileSync(
        srcFile,
        path.join(targetDirs.views, `${componentFileName}${ext}`)
      );
    }
    // SCSS mixin (имя: <componentFileName>.scss)
    else if (file === `${componentFileName}${ext}` && (ext === ".scss" || ext === ".sass")) {
      fs.copyFileSync(
        srcFile,
        path.join(targetDirs.mixinStyles, `${componentFileName}${ext}`)
      );
    }
    // PUG mixin (имя: <componentFileName>.pug)
    else if (file === `${componentFileName}${ext}` && (ext === ".pug" || ext === ".jade" || ext === ".html")) {
      fs.copyFileSync(
        srcFile,
        path.join(targetDirs.mixinViews, `${componentFileName}${ext}`)
      );
    }
    // _defaults.js
    else if (file === "_defaults.js") {
      fs.copyFileSync(
        srcFile,
        path.join(targetDirs.defaults, "_defaults.js")
      );
    }
    // обычные стили/views (старый формат)
    else if (ext === ".scss" || ext === ".sass") {
      fs.copyFileSync(
        srcFile,
        path.join(targetDirs.styles, `${componentFileName}${ext}`)
      );
    } else if (ext === ".pug" || ext === ".jade" || ext === ".html") {
      fs.copyFileSync(
        srcFile,
        path.join(targetDirs.views, `${componentFileName}${ext}`)
      );
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
