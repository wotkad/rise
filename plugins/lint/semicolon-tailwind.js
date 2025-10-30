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
    const updatedContent = content.split('\n').map(line => {
        if (line.trim().startsWith('@apply') && !line.trim().endsWith(';')) {
            return line.trimEnd() + ';';
        }
        return line;
    }).join('\n');

    fs.writeFileSync(filePath, updatedContent, 'utf-8');
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
