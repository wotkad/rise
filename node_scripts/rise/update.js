#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Путь к проекту
const projectDir = process.cwd();
const excludeDirName = 'src';
const tempDir = path.join(projectDir, 'rise-temp');
const repoUrl = 'https://github.com/wotkad/rise.git';

// Функция для копирования файлов, исключая src и package.json
function copyFiles(src, dest) {
  fs.readdirSync(src).forEach((file) => {
    if (file === excludeDirName || file === 'package.json') return;

    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }

    fs.renameSync(srcPath, destPath);
  });
}

// Функция для слияния package.json
function mergePackageJson(templatePath, projectPath) {
  const templatePkg = JSON.parse(fs.readFileSync(templatePath));
  const projectPkg = JSON.parse(fs.readFileSync(projectPath));

  const mergeDeps = (base, update) => ({ ...update, ...base }); // текущие изменения важнее

  projectPkg.dependencies = mergeDeps(projectPkg.dependencies || {}, templatePkg.dependencies || {});
  projectPkg.devDependencies = mergeDeps(projectPkg.devDependencies || {}, templatePkg.devDependencies || {});
  projectPkg.scripts = mergeDeps(projectPkg.scripts || {}, templatePkg.scripts || {});

  fs.writeFileSync(projectPath, JSON.stringify(projectPkg, null, 2));
}

// Основная функция обновления
function updateTemplate() {
  try {
    execSync(`git clone --quiet ${repoUrl} ${tempDir}`);

    const extractedPath = tempDir; // все файлы находятся сразу в tempDir

    // Обновляем package.json
    const templatePkgPath = path.join(extractedPath, 'package.json');
    const projectPkgPath = path.join(projectDir, 'package.json');
    if (fs.existsSync(templatePkgPath) && fs.existsSync(projectPkgPath)) {
      mergePackageJson(templatePkgPath, projectPkgPath);
    }

    // Копируем остальные файлы
    copyFiles(extractedPath, projectDir);

    // Удаляем временную папку
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log('Шаблон успешно обновлён!');
  } catch (err) {
    console.error('Ошибка при обновлении шаблона:', err.message);
  }
}

// Запуск
updateTemplate();
