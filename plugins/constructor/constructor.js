#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

// === Проверка аргументов ===
if (args.length === 0) {
  console.error("❌ Укажите компонент, например: yarn create:component component-v1 [--rewrite|--remove]");
  process.exit(1);
}

const componentArg = args[0];
const flags = args.slice(1); // дополнительные флаги

const [name, version] = componentArg.split("-");

if (!name || !version) {
  console.error("❌ Неверный формат. Используйте: component-v1");
  process.exit(1);
}

const rootDir = path.resolve(__dirname, "../..");
const sourceDir = path.join(__dirname, "components", name, version);

// базовые директории проекта
const basePaths = {
  js: path.join(rootDir, "src/assets/js/components"),
  styles: path.join(rootDir, "src/assets/styles/components"),
  views: path.join(rootDir, "src/views/components"),
};

// === Проверка, существует ли исходный компонент ===
if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Компонент ${name}-${version} не найден в ${sourceDir}`);
  process.exit(1);
}

// === Целевые директории ===
const targetDirs = {
  js: path.join(basePaths.js, name),
  styles: path.join(basePaths.styles, name),
  views: path.join(basePaths.views, name),
};

// Пути к app файлам
const appScssPath = path.join(rootDir, "src/assets/styles/app.scss");
const appJsPath = path.join(rootDir, "src/assets/js/app.js");

// Формы импортов (строки, которые добавляем/удаляем)
const importScssLine = `@use "@s-components/${name}/${name}";`;
const importJsLine = `import "@s-components/${name}/${name}";`;

// === Функции для работы с импортами ===
/**
 * Удаляет точные строки импорта из файла, не трогая остальные строки.
 * Регекс матчает полную строку с опциональной точкой с запятой и пробелами.
 */
function removeImportLines(filePath, name) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");
  // нормализуем переводы строк
  content = content.replace(/\r\n/g, "\n");

  const scssRegex = new RegExp(`^\\s*@use\\s+["']@s-components\\/${name}\\/${name}["'];?\\s*$`, "gm");
  const jsRegex = new RegExp(`^\\s*import\\s+["']@s-components\\/${name}\\/${name}["'];?\\s*$`, "gm");

  content = content.replace(scssRegex, "");
  content = content.replace(jsRegex, "");

  // Убираем возможные лишние пустые строки подряд (максимум по одному переводу строки)
  content = content.replace(/\n{3,}/g, "\n\n");

  // Трим в конце файла
  content = content.replace(/\s+$/, "") + "\n";

  fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Добавляет import-строку в конец файла, если её там ещё нет.
 */
function appendImportLine(filePath, line) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(line)) {
    // гарантируем, что файл заканчивается переводом строки
    if (!content.endsWith("\n")) content += "\n";
    content += line + "\n";
    fs.writeFileSync(filePath, content, "utf8");
  }
}

// === Функция удаления папок компонента ===
function removeTargetDirs() {
  for (const key in targetDirs) {
    if (fs.existsSync(targetDirs[key])) {
      fs.rmSync(targetDirs[key], { recursive: true, force: true });
      console.log(`🗑️ Удалена папка: ${targetDirs[key]}`);
    }
  }
  // Также аккуратно удалим импорты из app файлов
  removeImportLines(appScssPath, name);
  removeImportLines(appJsPath, name);
  console.log(`🧹 Импорты для ${name} удалены из app.scss и app.js (если были).`);
}

// === Флаг --remove ===
if (flags.includes("--remove")) {
  removeTargetDirs();
  console.log(`🗑️ Компонент ${name} удалён.`);
  process.exit(0);
}

// === Проверка существования ===
let alreadyExists = false;
for (const key in targetDirs) {
  if (fs.existsSync(targetDirs[key])) {
    // если папка существует и в ней есть файлы — считаем, что компонент есть
    const stats = fs.statSync(targetDirs[key]);
    // Если папка не пуста (содержит файлы или подпапки)
    const entries = fs.readdirSync(targetDirs[key]);
    if (entries.length > 0) {
      alreadyExists = true;
      break;
    } else {
      // папка пуста — не считаем за существующий компонент (будем писать)
      // но оставим папку как есть (или можно удалить и создать заново)
    }
  }
}

// === Флаг --rewrite (перезапись) ===
if (alreadyExists && flags.includes("--rewrite")) {
  console.log(`♻️ Перезаписываю компонент ${name}...`);
  // удалить старые папки и импорты
  removeTargetDirs();
  alreadyExists = false;
}

// === Если компонент уже существует и не указан rewrite ===
if (alreadyExists) {
  console.log("🚫 Компонент не создан, так как уже существует (используйте --rewrite для перезаписи)");
  process.exit(0);
}

// === Создание папок ===
for (const key in targetDirs) {
  fs.mkdirSync(targetDirs[key], { recursive: true });
}

// === Копирование файлов ===
const files = fs.readdirSync(sourceDir);

for (const file of files) {
  const ext = path.extname(file);
  const srcFile = path.join(sourceDir, file);

  if (ext === ".js") {
    fs.copyFileSync(srcFile, path.join(targetDirs.js, file));
    console.log(`✅ Скопирован JS: ${file}`);
  } else if (ext === ".scss" || ext === ".sass") {
    fs.copyFileSync(srcFile, path.join(targetDirs.styles, file));
    console.log(`✅ Скопирован style: ${file}`);
  } else if (ext === ".pug" || ext === ".jade" || ext === ".html") {
    fs.copyFileSync(srcFile, path.join(targetDirs.views, file));
    console.log(`✅ Скопирован view: ${file}`);
  } else {
    // копируем все остальные файлы в папку компонента views (если нужно можно изменить)
    // fs.copyFileSync(srcFile, path.join(targetDirs.views, file));
    console.log(`ℹ️  Пропущен файл (не js/scss/pug): ${file}`);
  }
}

// === Добавление импортов в app.scss и app.js ===
// Перед добавлением уберём возможные старые дубликаты (на случай rewrite/удаления)
removeImportLines(appScssPath, name);
removeImportLines(appJsPath, name);

// Добавляем, если файловые app существуют
appendImportLine(appScssPath, importScssLine);
appendImportLine(appJsPath, importJsLine);

console.log(`✅ Компонент ${name} успешно создан и подключён!`);
