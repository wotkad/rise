#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = process.cwd();
const tempDir = path.join(projectDir, 'rise-temp');
const repoUrl = 'https://github.com/wotkad/rise.git';

// Файлы, которые нужно обновлять/сливать
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

// Простейшее слияние JSON-файлов (объединяем ключи, локальные важнее)
function mergeJsonFiles(localPath, templatePath) {
  const localData = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
  const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

  const merged = { ...templateData, ...localData }; // локальные важнее
  fs.writeFileSync(localPath, JSON.stringify(merged, null, 2));
}

// Слияние текстовых файлов (например .gitignore, .editorconfig)
function mergeTextFiles(localPath, templatePath) {
  const localData = fs.existsSync(localPath) ? fs.readFileSync(localPath, 'utf-8').split('\n') : [];
  const templateData = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf-8').split('\n') : [];

  const mergedSet = new Set([...templateData, ...localData]);
  fs.writeFileSync(localPath, Array.from(mergedSet).join('\n'));
}

// Копирование и слияние файлов
function copyAndMergeFiles(srcDir, destDir) {
  mergeFiles.forEach((file) => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    if (!fs.existsSync(srcPath)) return;

    if (file.endsWith('.json')) {
      if (fs.existsSync(destPath)) {
        mergeJsonFiles(destPath, srcPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    } else {
      mergeTextFiles(destPath, srcPath);
    }
  });
}

function updateTemplate() {
  try {
    execSync(`git clone --quiet ${repoUrl} ${tempDir}`);

    copyAndMergeFiles(tempDir, projectDir);

    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Шаблон успешно обновлён!');
  } catch (err) {
    console.error('Ошибка при обновлении шаблона:', err.message);
  }
}

updateTemplate();
