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
const sourceDir = path.join(__dirname, "components", name, version);

const basePaths = {
  js: path.join(rootDir, "src/assets/js/components"),
  styles: path.join(rootDir, "src/assets/styles/components"),
  views: path.join(rootDir, "src/views/components"),
  images: path.join(rootDir, "src/assets/images/components"), // ✅ добавлено
};

if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Компонент ${name}-${version} не найден в ${sourceDir}`);
  process.exit(0);
}

const componentFolderName = `${name}-${version}`;
const fileBaseName = `${name}-${version}`;

const targetDirs = {
  js: path.join(basePaths.js, componentFolderName),
  styles: path.join(basePaths.styles, componentFolderName),
  views: path.join(basePaths.views, componentFolderName),
  images: path.join(basePaths.images, componentFolderName),
};

const appScssPath = path.join(rootDir, "src/assets/styles/app.scss");
const appJsPath = path.join(rootDir, "src/assets/js/app.js");

const importScssLine = `@use "@components/${componentFolderName}/${fileBaseName}";`;
const importJsLine = `import "@components/${componentFolderName}/${fileBaseName}";`;

function removeImportLines(filePath, name) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/\r\n/g, "\n");

  const scssRegex = new RegExp(
    `^\\s*@use\\s+["']@components\\/${name}-v\\d+\\/${name}-v\\d+["'];?\\s*\\n?`,
    "gm"
  );

  const jsRegex = new RegExp(
    `^\\s*import\\s+["']@components\\/${name}-v\\d+\\/${name}-v\\d+["'];?\\s*\\n?`,
    "gm"
  );

  content = content.replace(scssRegex, "");
  content = content.replace(jsRegex, "");

  content = content.replace(/\s+$/, "");
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
    fs.rmdirSync(dir);
  }
}

function removeTargetDirs() {
  for (const key in targetDirs) {
    const dir = targetDirs[key];
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      removeEmptyParent(path.dirname(dir));
    }
  }

  // ✅ удаляем изображения компонента
  const componentImagesDir = targetDirs.images;
  if (fs.existsSync(componentImagesDir)) {
    fs.rmSync(componentImagesDir, { recursive: true, force: true });
    removeEmptyParent(path.dirname(componentImagesDir));
  }

  removeImportLines(appScssPath, name);
  removeImportLines(appJsPath, name);
}

function rewriteTargetDirs() {
  for (const key in targetDirs) {
    const dir = targetDirs[key];
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

let alreadyExists = false;
for (const key in targetDirs) {
  if (fs.existsSync(targetDirs[key])) {
    const entries = fs.readdirSync(targetDirs[key]);
    if (entries.length > 0) {
      alreadyExists = true;
      break;
    }
  }
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
  for (const key in targetDirs) {
    const dir = targetDirs[key];
    const parent = path.dirname(dir);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  }

  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    const ext = path.extname(file);
    const srcFile = path.join(sourceDir, file);

    if (ext === ".js") {
      fs.copyFileSync(srcFile, path.join(targetDirs.js, `${fileBaseName}${ext}`));
    } else if (ext === ".scss" || ext === ".sass") {
      fs.copyFileSync(srcFile, path.join(targetDirs.styles, `${fileBaseName}${ext}`));
    } else if (ext === ".pug" || ext === ".jade" || ext === ".html") {
      fs.copyFileSync(srcFile, path.join(targetDirs.views, `${fileBaseName}${ext}`));
    }
  }

  const imagesDir = path.join(sourceDir, "images");
  if (fs.existsSync(imagesDir)) {
    const targetImagesDir = targetDirs.images;
    if (!fs.existsSync(targetImagesDir)) fs.mkdirSync(targetImagesDir, { recursive: true });
    const imageFiles = fs.readdirSync(imagesDir);
    for (const img of imageFiles) {
      const srcImg = path.join(imagesDir, img);
      const destImg = path.join(targetImagesDir, img);
      fs.copyFileSync(srcImg, destImg);
    }
  }

  removeImportLines(appScssPath, name);
  removeImportLines(appJsPath, name);

  appendImportLine(appScssPath, importScssLine);
  appendImportLine(appJsPath, importJsLine);

  console.log(`✅ Компонент ${name} успешно создан и подключён!`);
}
