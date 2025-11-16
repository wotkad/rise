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
  console.error("❌ Неверный формат. Используйте версию: component-[v1|v2]");
  process.exit(0);
}

const rootDir = path.resolve(__dirname, "../..");
const sourceDir = path.join(__dirname, "components", name, version);
const commonJsSource = path.join(__dirname, "js", `${name}.js`);

const basePaths = {
  js: path.join(rootDir, "src/assets/js/components"),
  styles: path.join(rootDir, "src/assets/styles/components"),
  views: path.join(rootDir, "src/views/components"),
  images: path.join(rootDir, "src/assets/images/components"),
};

if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Компонент ${name}-${version} не найден в ${sourceDir}`);
  process.exit(0);
}

const targetDirs = {
  styles: path.join(basePaths.styles, name),
  views: path.join(basePaths.views, name),
  images: path.join(basePaths.images, name),
  commonJs: path.join(basePaths.js, name),
};

const appScssPath = path.join(rootDir, "src/assets/styles/app.scss");
const appJsPath = path.join(rootDir, "src/assets/js/app.js");
const importScssLine = `@use "@s-components/${name}/${name}" as *;`;
const importCommonJsLine = `import "@components/${name}/${name}";`;

function removeImportLines(filePath, name) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

  const scssRegex = new RegExp(
    `^\\s*@use\\s+["']@s-components\\/${name}\\/${name}["']\\s+as\\s+\\*;?\\s*\\n?`,
    "gm"
  );

  const commonJsRegex = new RegExp(
    `^\\s*import\\s+["']@components\\/${name}\\/${name}["'];?\\s*\\n?`,
    "gm"
  );

  content = content
    .replace(scssRegex, "")
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
    } catch (_) {}
  }
}

function removeTargetDirs() {
  const folders = [targetDirs.styles, targetDirs.views, targetDirs.images];
  for (const dir of folders) {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    removeEmptyParent(path.dirname(dir));
  }

  const commonJsFile = path.join(targetDirs.commonJs, `${name}.js`);
  if (fs.existsSync(commonJsFile)) {
    fs.rmSync(commonJsFile);
    removeEmptyParent(targetDirs.commonJs);
  }

  removeImportLines(appScssPath, name);
  removeImportLines(appJsPath, name);
}

function rewriteTargetDirs() {
  removeTargetDirs();
}

let alreadyExists = false;

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
  }
  console.log(`♻️ Компонент ${name} перезаписан.`);
  rewriteTargetDirs();
  createComponent();
  process.exit(0);
}

if (flags.includes("--remove")) {
  if (!alreadyExists) {
    console.log(`🚫 Компонент ${name} не существует.`);
    process.exit(0);
  }
  removeTargetDirs();
  console.log(`🗑️ Компонент ${name} удалён.`);
  process.exit(0);
}

if (alreadyExists) {
  console.log(`🚫 Компонент ${name} уже создан — используйте флаг --rewrite`);
  process.exit(0);
}

createComponent();

function createComponent() {
  let hasCommonJs = false;

  for (const key of ["styles", "views", "images"]) {
    const dir = targetDirs[key];
    const parent = path.dirname(dir);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  }

  if (fs.existsSync(commonJsSource)) {
    if (!fs.existsSync(targetDirs.commonJs)) {
      fs.mkdirSync(targetDirs.commonJs, { recursive: true });
    }

    fs.copyFileSync(
      commonJsSource,
      path.join(targetDirs.commonJs, `${name}.js`)
    );

    hasCommonJs = true;
  }

  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const srcFile = path.join(sourceDir, file);

    if (ext === ".js") continue;

    if (ext === ".scss" || ext === ".sass") {
      fs.copyFileSync(srcFile, path.join(targetDirs.styles, `${name}${ext}`));
    }

    else if (ext === ".pug" || ext === ".jade" || ext === ".html") {
      fs.copyFileSync(srcFile, path.join(targetDirs.views, file));
    }

  }

  const imagesDir = path.join(sourceDir, "images");
  if (fs.existsSync(imagesDir)) {
    for (const img of fs.readdirSync(imagesDir)) {
      fs.copyFileSync(
        path.join(imagesDir, img),
        path.join(targetDirs.images, img)
      );
    }
  }

  if (fs.existsSync(commonJsSource)) {
    fs.copyFileSync(
      commonJsSource,
      path.join(targetDirs.commonJs, `${name}.js`)
    );
    hasCommonJs = true;
  }

  removeImportLines(appScssPath, name);
  removeImportLines(appJsPath, name);

  appendImportLine(appScssPath, importScssLine);
  if (hasCommonJs) {
    appendImportLine(appJsPath, importCommonJsLine);
  }
  if (!alreadyExists) {
    console.log(`✅ Компонент ${name}-${version} успешно создан и подключён!`);
  }
}
