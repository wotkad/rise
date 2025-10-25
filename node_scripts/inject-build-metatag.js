const fs = require('fs');
const path = require('path');

function getBuildInfo() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  let commit = '';
  try {
    const { execSync } = require('child_process');
    commit = execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    commit = 'unknown';
  }

  const localDateTime = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  return `${localDateTime} (commit ${commit})`;
}

function injectBuildMeta(filePath, buildInfo) {
  const html = fs.readFileSync(filePath, 'utf8');
  const metaTag = `<meta name="build" content="${buildInfo}">`;
  let output;

  if (html.includes('meta name="build"')) {
    output = html.replace(/<meta name="build" content="[^"]*">/, metaTag);
  } else {
    output = html.replace(/<\/head>/i, `  ${metaTag}\n</head>`);
  }

  fs.writeFileSync(filePath, output, 'utf8');
}

function processDir(dir, buildInfo) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      processDir(fullPath, buildInfo);
    } else if (item.isFile() && item.name.endsWith('.html')) {
      injectBuildMeta(fullPath, buildInfo);
    }
  }
}

function injectBuildMetaAll(buildDir) {
  if (!fs.existsSync(buildDir)) {
    console.error(`❌ Директория не найдена: ${buildDir}`);
    process.exit(1);
  }

  const buildInfo = getBuildInfo();
  processDir(buildDir, buildInfo);
  console.log(`✅ Build metatag добавлен!`);
}

const targetDir = 'build';
injectBuildMetaAll(targetDir);
