const fs = require('fs');
const path = require('path');

// Define the base directory
const baseDir = 'build'; // Assuming "build" is the parent folder

// Define the levels and their corresponding relative paths
const levels = {
  1: '.',
  2: '..',
  3: '../..',
};

// Define the target directory
const targetDir = '/assets';

// Recursive function to process files in the directory structure
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

// Start processing files from the base directory
processFilesInDirectory(baseDir, 1);
