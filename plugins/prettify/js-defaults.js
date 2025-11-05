const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

const targetDirectory = path.join(__dirname, '../../src/assets/js/_defaults');

function getJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJsFiles(filePath));
    } else if (file.endsWith('.js')) {
      results.push(filePath);
    }
  });
  return results;
}

function sortObjectProperties(content) {
  const regex = /module\.exports\s*=\s*\{[\s\S]*?mergeConfig\s*\((.*?)\)\s*\{[\s\S]*?return\s*\{([\s\S]*?)\}\s*\}/;
  const match = content.match(regex);

  if (match) {
    const returnBody = match[2];
    const properties = returnBody.split(',').map((prop) => prop.trim()).filter(Boolean);

    const sortedProperties = properties.sort((a, b) => {
      const keyA = a.split(':')[0].trim();
      const keyB = b.split(':')[0].trim();
      return keyA.localeCompare(keyB);
    });

    const sortedReturnBody = sortedProperties.join(',\n      ');
    return content.replace(returnBody, `\n      ${sortedReturnBody},\n    `);
  }

  return content;
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
      .map((key) => {
        const val = value[key];
        if (typeof val === 'function') {
          return `${indent}  ${val.toString()},`;
        }
        return `${indent}  ${key}: ${formatValue(val, `${indent}  `)},`;
      })
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

function formatDefaults(content) {
  try {
    const moduleExports = eval(content);

    if (moduleExports && typeof moduleExports === 'object') {
      const formattedObject = formatValue(moduleExports, '');
      return `module.exports = ${formattedObject};`;
    } else {
      throw new Error('Файл не содержит корректный объект для module.exports');
    }
  } catch (err) {
    console.error('Ошибка при обработке файла:', err);
    return content;
  }
}

function processJsFiles() {
  const jsFiles = getJsFiles(targetDirectory);

  jsFiles.forEach((file) => {
    console.log(`Обрабатываем файл: ${file}`);

    const content = fs.readFileSync(file, 'utf8');
    const sortedContent = sortObjectProperties(content);
    const formattedContent = formatDefaults(sortedContent);

    fs.writeFileSync(file, formattedContent, 'utf8');
  });

  console.log('Обработка завершена.');
}

processJsFiles();
