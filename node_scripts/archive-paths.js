const fs = require('fs');
const path = require('path');

const baseDir = 'build';

const levels = {
  1: '.',
  2: '..',
  3: '../..',
};

const targetDir = '/assets';

function processFilesInDirectory(dir, level) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processFilesInDirectory(filePath, level + 1);
    } else if (stat.isFile() && (file.endsWith('.html') || file.endsWith('.css'))) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const updatedContents = fileContents.replace(new RegExp(targetDir, 'g'), `${levels[level]}${targetDir}`);
      fs.writeFileSync(filePath, updatedContents);
      console.log(`Updated: ${filePath}`);
    }
  });
}

processFilesInDirectory(baseDir, 1);
