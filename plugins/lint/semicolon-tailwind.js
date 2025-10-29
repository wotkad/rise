const fs = require('fs');
const path = require('path');

/**
 * Recursively searches for all .scss files in a directory.
 * @param {string} dir - The directory to search in.
 * @returns {string[]} - Array of .scss file paths.
 */
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

/**
 * Adds a semicolon at the end of lines starting with @apply if not already present.
 * @param {string} filePath - Path to the .scss file.
 */
function processScssFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updatedContent = content.split('\n').map(line => {
        if (line.trim().startsWith('@apply') && !line.trim().endsWith(';')) {
            return line.trimEnd() + ';';
        }
        return line;
    }).join('\n');

    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`Processed: ${filePath}`);
}

/**
 * Main function to process all .scss files in a directory.
 * @param {string} dir - Directory containing .scss files.
 */
function addSemicolonsToScss(dir) {
    const scssFiles = findScssFiles(dir);

    scssFiles.forEach(filePath => {
        processScssFile(filePath);
    });
}

// Replace './scss-directory' with the path to your SCSS files directory
const directoryToProcess = path.join(__dirname, '../../src/assets/styles');
addSemicolonsToScss(directoryToProcess);
