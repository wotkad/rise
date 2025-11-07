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

function safeParseJSON5(str) {
  const templates = [];
  const replaced = str.replace(/`([^`\\]*(\\.[^`\\]*)*)`/g, (match) => {
    const key = `__TEMPLATE_LITERAL_${templates.length}__`;
    templates.push(match);
    return `'${key}'`;
  });

  const obj = JSON5.parse(replaced);

  function restoreTemplates(value) {
    if (typeof value === 'string') {
      const match = value.match(/^__TEMPLATE_LITERAL_(\d+)__$/);
      return match ? templates[+match[1]] : value;
    } else if (Array.isArray(value)) {
      return value.map(restoreTemplates);
    } else if (value && typeof value === 'object') {
      const restored = {};
      for (const key of Object.keys(value)) {
        restored[key] = restoreTemplates(value[key]);
      }
      return restored;
    }
    return value;
  }

  return restoreTemplates(obj);
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
    if (value.startsWith('`') && value.endsWith('`')) {
      return value;
    }
    return `'${value.replace(/'/g, "\\'")}'`;
  } else {
    return String(value);
  }
}

function formatMixinCalls(content) {
  return content.replace(
    /^([ \t]*)\+(\w+)\((\{[\s\S]*?\})\)/gm,
    (match, indent, mixinName, attributes) => {
      try {
        const attrObject = safeParseJSON5(attributes);
        const formattedAttributes = formatValue(attrObject, indent);
        return `${indent}+${mixinName}(${formattedAttributes})`;
      } catch (err) {
        console.error('Ошибка при обработке миксина:', match, err.message);
        return match;
      }
    }
  );
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
