#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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

// пути назначения
const targetDirs = {
  js: path.join(rootDir, "src/assets/js/components", name),
  styles: path.join(rootDir, "src/assets/styles/components", name),
  views: path.join(rootDir, "src/views/components", name),
};

// проверка, существует ли исходный компонент
if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Компонент ${name}_${version} не найден в ${sourceDir}`);
  process.exit(1);
}

// проверка, не существует ли уже компонент в целевых путях
let alreadyExists = false;
for (const key in targetDirs) {
  const destPath = path.join(targetDirs[key], version);
  if (fs.existsSync(destPath)) {
    console.log(`⚠️  ${key} уже содержит ${name}_${version} → ${destPath}`);
    alreadyExists = true;
  }
}

if (alreadyExists) {
  console.log("🚫 Компонент не создан, чтобы избежать перезаписи.");
  process.exit(0);
}

// копирование папок
for (const key in targetDirs) {
  const src = path.join(sourceDir, key);
  const dest = path.join(targetDirs[key], version);

  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    execSync(`cp -R "${src}" "${dest}"`);
    console.log(`✅ Скопировано: ${key} → ${dest}`);
  } else {
    console.log(`ℹ️  Пропущено: нет папки ${key} в ${sourceDir}`);
  }
}

console.log(`🎉 Компонент ${name}_${version} успешно создан!`);