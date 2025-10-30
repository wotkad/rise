const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

const VIEWS_DIR = path.join(__dirname, '../../src/views');

function findPugFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(findPugFiles(filePath));
        } else if (path.extname(file) === '.pug') {
            results.push(filePath);
        }
    });

    return results;
}

function formatValue(value, indent) {
    if (Array.isArray(value)) {
        const items = value
            .map((item) => `${indent}  ${formatValue(item, `${indent}  `)},`)
            .join('\n');
        return `[
${items}
${indent}]`;
    } else if (typeof value === 'object' && value !== null) {
        const entries = Object.keys(value)
            .sort()
            .map((key) => `${indent}  ${key}: ${formatValue(value[key], `${indent}  `)},`)
            .join('\n');
        return `{
${entries}
${indent}}`;
    } else if (typeof value === 'string') {
        return `'${value.replace(/'/g, "\\'")}'`;
    } else {
        return String(value);
    }
}

function formatMixinCalls(content) {
    return content.replace(/^([ \t]*)\+(\w+)\((\{[\s\S]*?\})\)/gm, (match, indent, mixinName, attributes) => {
        try {
            const attrObject = JSON5.parse(attributes);
            const formattedAttributes = formatValue(attrObject, indent);
            return `${indent}+${mixinName}(${formattedAttributes})`;
        } catch (err) {
            console.error('Ошибка при обработке миксина:', match, err);
            return match;
        }
    });
}

function processPugFiles() {
    const files = findPugFiles(VIEWS_DIR);

    files.forEach((file) => {
        console.log(`Обрабатываем файл: ${file}`);
        const content = fs.readFileSync(file, 'utf8');
        const formattedContent = formatMixinCalls(content);
        fs.writeFileSync(file, formattedContent, 'utf8');
    });

    console.log('Обработка завершена.');
}

processPugFiles();
