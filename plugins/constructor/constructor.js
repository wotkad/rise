#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("❌ Укажите компонент, например: yarn create:component hero_v1");
  process.exit(1);
}

const componentArg = args[0];
const [name, version] = componentArg.split("_");

if (!name || !version) {
  console.error("❌ Неверный формат. Используйте: hero_v1 или services_v2");
  process.exit(1);
}

const rootDir = path.resolve(__dirname, "../../..");
const sourceDir = path.join(__dirname, "components", name, version);

// базовые директории проекта
const basePaths = {
  js: path.join(rootDir, "src/assets/js"),
  styles: path.join(rootDir, "src/assets/styles"),
  views: path.join(rootDir, "src/views"),
};

// целевые директории компонентов
const targetDirs = {
  js: path.join(basePaths.js, "components"),
  styles: path.join(basePaths.styles, "components"),
  views: path.join(basePaths.views, "components"),
};

// проверка, существует ли исходный компонент
if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Компонент ${name}_${version} не найден в ${sourceDir}`);
  process.exit(1);
}

// проверка, существует ли уже компонент
let alreadyExists = false;
for (const key in targetDirs) {
  const destFile = path.join(targetDirs[key], `${name}`);
  if (fs.existsSync(destFile) || fs.existsSync(`${destFile}.js`) || fs.existsSync(`${destFile}.scss`) || fs.existsSync(`${destFile}.pug`)) {
    console.log(`⚠️  Компонент ${name} уже существует в ${targetDirs[key]}`);
    alreadyExists = true;
  }
}

if (alreadyExists) {
  console.log("🚫 Компонент не создан, чтобы избежать перезаписи.");
  process.exit(0);
}

// создаем папки components, если их нет
for (const key in targetDirs) {
  if (!fs.existsSync(targetDirs[key])) {
    fs.mkdirSync(targetDirs[key], { recursive: true });
    console.log(`📁 Создана папка: ${targetDirs[key]}`);
  }
}

// копируем файлы по расширениям
const files = fs.readdirSync(sourceDir);
for (const file of files) {
  const ext = path.extname(file);
  const srcFile = path.join(sourceDir, file);

  if (ext === ".js") {
    fs.copyFileSync(srcFile, path.join(targetDirs.js, file));
    console.log(`✅ Скопирован JS: ${file}`);
  } else if (ext === ".scss") {
    fs.copyFileSync(srcFile, path.join(targetDirs.styles, file));
    console.log(`✅ Скопирован SCSS: ${file}`);
  } else if (ext === ".pug") {
    fs.copyFileSync(srcFile, path.join(targetDirs.views, file));
    console.log(`✅ Скопирован PUG: ${file}`);
  } else {
    console.log(`ℹ️  Пропущен файл: ${file}`);
  }
}

console.log(`🎉 Компонент ${name}_${version} успешно создан!`);
