const fs = require('fs');
const path = require('path');

function findScssFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(findScssFiles(filePath));
    } else if (path.extname(file) === '.scss') {
      results.push(filePath);
    }
  });

  return results;
}

function processScssFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // добавляем ; в конце @apply если нужно
  let updated = content.split('\n').map(line => {
    if (line.trim().startsWith('@apply') && !line.trim().endsWith(';')) {
      return line.trimEnd() + ';';
    }
    return line;
  });

  // УДАЛЯЕМ пустые строки в конце файла
  while (updated.length > 0 && updated[updated.length - 1].trim() === '') {
    updated.pop();
  }

  const finalContent = updated.join('\n');

  fs.writeFileSync(filePath, finalContent, 'utf-8');
  console.log(`Processed: ${filePath}`);
}

function addSemicolonsToScss(dir) {
  const scssFiles = findScssFiles(dir);

  scssFiles.forEach(filePath => {
    processScssFile(filePath);
  });
}

const directoryToProcess = path.join(__dirname, '../../src/assets/styles');
addSemicolonsToScss(directoryToProcess);
