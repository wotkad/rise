const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = process.cwd();
const excludeDirName = 'src';
const tempDir = path.join(projectDir, 'rise-temp');
const repoUrl = 'https://github.com/wotkad/rise.git';

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

updateTemplate();