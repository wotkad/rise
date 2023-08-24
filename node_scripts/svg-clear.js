const fs = require('fs');
const path = require('path');
const html2pug = require('html2pug');
function removeCommasWithinAttributes(input) {
    const regex = /([a-zA-Z-]+)="([^"]+)",?\s*/g;
    return input.replace(regex, '$1="$2" ');
}
function processPugFile(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    const outputLines = [];
    let indent = '';
    let converted = false;
    for (const line of lines) {
        if (line.includes('<svg')) {
            indent = line.match(/^\s*/)[0];
            const modifiedSvgLine = line.replace(/,(\s*[^=]+="[^"]*")/g, '$1');
            const pugCode = html2pug(modifiedSvgLine.trim(), { fragment: true, doubleQuotes: true });
            const cleanedPugCode = removeCommasWithinAttributes(pugCode)
                .replace(/\( /g, '(')
                .replace(/ \)/g, ')');
            const pugLines = cleanedPugCode.split('\n').map(pugLine => indent + pugLine).join('\n');
            outputLines.push(pugLines);
            if (pugCode !== cleanedPugCode) {
                converted = true;
            }
        } else {
            outputLines.push(line);
        }
    }
    if (converted) {
        const newContent = outputLines.join('\n');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Converted inline <svg> tags into PUG in: ${filePath}`);
    }
    const newContent = outputLines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
}
function processDirectory(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            processDirectory(filePath);
        } else if (path.extname(filePath) === '.pug') {
            processPugFile(filePath);
        }
    });
}
const targetDirectory = path.join(__dirname, '../src/views');
processDirectory(targetDirectory);