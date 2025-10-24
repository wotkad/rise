#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Путь к проекту
const projectDir = process.cwd();
const excludeDirName = 'src';

// Временная папка для клонирования
const tempDir = path.join(projectDir, 'rise-temp');

// URL репозитория
const repoUrl = 'https://github.com/wotkad/rise.git';

// Копирование файлов, исключая src
function copyFiles(src, dest) {
  fs.readdirSync(src).forEach((file) => {
    if (file === excludeDirName) return;

    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }

    fs.renameSync(srcPath, destPath);
  });
}

// Основная функция
function updateTemplate() {
  try {
    execSync(`git clone ${repoUrl} ${tempDir}`, { stdio: 'inherit' });

    copyFiles(tempDir, projectDir);

    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log('Шаблон успешно обновлён!');
  } catch (err) {
    console.error('Ошибка при обновлении шаблона:', err.message);
  }
}

// Запуск
updateTemplate();
