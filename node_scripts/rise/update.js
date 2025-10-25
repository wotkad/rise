#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = process.cwd();
const tempDir = path.join(projectDir, 'rise-temp');
const repoUrl = 'https://github.com/wotkad/rise.git';

// Файлы для обновления
const mergeFiles = [
  '.babelrc',
  '.editorconfig',
  '.gitignore',
  '.htaccess',
  '.nvmrc',
  '.prettierignore',
  '.stylelintrc.json',
  'LICENSE',
  'manifest.json',
  'package.json',
  'postcss.config.js',
  'prettier.config.js',
  'README.md',
  'robots-txt.config.js',
  'tailwind.config.js',
  'utils.js',
  'webpack.config.js',
  'yarn.lock'
];

// ======== Глубокое слияние JSON ========
function isObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function deepMerge(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    // Объединяем массивы, избегая дубликатов
    const merged = [...source];
    target.forEach(item => {
      if (!merged.some(i => JSON.stringify(i) === JSON.stringify(item))) {
        merged.push(item);
      }
    });
    return merged;
  } else if (isObject(target) && isObject(source)) {
    const merged = { ...source };
    Object.keys(target).forEach(key => {
      if (key in source) {
        merged[key] = deepMerge(target[key], source[key]);
      } else {
        merged[key] = target[key];
      }
    });
    return merged;
  }
  return target;
}

function mergeJsonFiles(localPath, templatePath) {
  const localData = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
  const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
  const merged = deepMerge(localData, templateData);
  fs.writeFileSync(localPath, JSON.stringify(merged, null, 2));
}

// ======== Слияние текстовых файлов (с сохранением пустых строк) ========
function mergeTextFiles(localPath, templatePath) {
  const localData = fs.existsSync(localPath) ? fs.readFileSync(localPath, 'utf-8').split(/\r?\n/) : [];
  const templateData = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf-8').split(/\r?\n/) : [];

  const mergedLines = [...templateData];
  localData.forEach(line => {
    if (!mergedLines.includes(line)) {
      mergedLines.push(line);
    }
  });

  fs.writeFileSync(localPath, mergedLines.join('\n'));
}

// ======== Копирование и слияние файлов ========
function copyAndMergeFiles(srcDir, destDir) {
  mergeFiles.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    if (!fs.existsSync(srcPath)) return;

    if (file.endsWith('.json')) {
      // JSON-файлы — глубокое слияние
      if (fs.existsSync(destPath)) {
        mergeJsonFiles(destPath, srcPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    } else if (file.startsWith('.')) {
      // Текстовые конфиги — объединение строк
      mergeTextFiles(destPath, srcPath);
    } else {
      // JS-файлы и другие — если нет локального файла, копируем из шаблона
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  });
}

// ======== Основная функция обновления ========
function updateTemplate() {
  try {
    console.log('Клонируем шаблон...');
    execSync(`git clone --quiet ${repoUrl} ${tempDir}`);

    console.log('Обновляем файлы проекта...');
    copyAndMergeFiles(tempDir, projectDir);

    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Шаблон успешно обновлён!');
  } catch (err) {
    console.error('Ошибка при обновлении шаблона:', err.message);
  }
}

// ======== Запуск ========
updateTemplate();
