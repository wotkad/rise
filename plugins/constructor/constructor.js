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
};

if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Компонент ${name}-${version} не найден в ${sourceDir}`);
  process.exit(0);
}

const targetDirs = {
  js: path.join(basePaths.js, name),
  styles: path.join(basePaths.styles, name),
  views: path.join(basePaths.views, name),
};

const appScssPath = path.join(rootDir, "src/assets/styles/app.scss");
const appJsPath = path.join(rootDir, "src/assets/js/app.js");

const importScssLine = `@use "@s-components/${name}/${name}";`;
const importJsLine = `import "@s-components/${name}/${name}";`;

function removeImportLines(filePath, name) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/\r\n/g, "\n");

  const scssRegex = new RegExp(`^\\s*@use\\s+["']@s-components\\/${name}\\/${name}["'];?\\s*\\n?`, "gm");
  const jsRegex = new RegExp(`^\\s*import\\s+["']@s-components\\/${name}\\/${name}["'];?\\s*\\n?`, "gm");

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
      fs.copyFileSync(srcFile, path.join(targetDirs.js, file));
    } else if (ext === ".scss" || ext === ".sass") {
      fs.copyFileSync(srcFile, path.join(targetDirs.styles, file));
    } else if (ext === ".pug" || ext === ".jade" || ext === ".html") {
      fs.copyFileSync(srcFile, path.join(targetDirs.views, file));
    }
  }

  removeImportLines(appScssPath, name);
  removeImportLines(appJsPath, name);

  appendImportLine(appScssPath, importScssLine);
  appendImportLine(appJsPath, importJsLine);

  console.log(`✅ Компонент ${name} успешно создан и подключён!`);
}
