const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

// Путь к папке
const targetDirectory = './src/assets/js/_defaults';

/**
 * Рекурсивно обходит папки и возвращает список всех JS файлов
 * @param {string} dir - Путь к папке
 * @returns {string[]} - Массив путей к JS файлам
 */
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

/**
 * Сортирует свойства объекта по алфавиту
 * @param {string} content - Содержимое файла
 * @returns {string} - Обновленное содержимое файла
 */
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

/**
 * Рекурсивная функция для форматирования объектов и массивов
 * @param {*} value - Значение для форматирования
 * @param {string} indent - Отступ
 * @returns {string} - Отформатированное значение
 */
function formatValue(value, indent) {
  if (Array.isArray(value)) {
    // Форматируем массив
    const items = value
      .map((item) => `${indent}  ${formatValue(item, `${indent}  `)},`)
      .join('\n');
    return `[
${items}
${indent}]`;
  } else if (typeof value === 'object' && value !== null) {
    // Форматируем объект
    const entries = Object.keys(value)
      .sort()
      .map((key) => {
        const val = value[key];
        if (typeof val === 'function') {
          // Если значение — это функция, записываем её как есть
          return `${indent}  ${val.toString()},`;
        }
        return `${indent}  ${key}: ${formatValue(val, `${indent}  `)},`;
      })
      .join('\n');
    return `{
${entries}
${indent}}`;
  } else if (typeof value === 'string') {
    return `'${value.replace(/'/g, "\\'")}'`; // Экранируем одиночные кавычки
  } else {
    return String(value); // Для чисел и других примитивов
  }
}

/**
 * Форматирует содержимое файлов
 * @param {string} content - Содержимое файла
 * @returns {string} - Отформатированное содержимое
 */
function formatDefaults(content) {
  try {
    // Парсим файл как модуль
    const moduleExports = eval(content); // Используем eval для обработки module.exports

    if (moduleExports && typeof moduleExports === 'object') {
      const formattedObject = formatValue(moduleExports, '');
      return `module.exports = ${formattedObject};`;
    } else {
      throw new Error('Файл не содержит корректный объект для module.exports');
    }
  } catch (err) {
    console.error('Ошибка при обработке файла:', err);
    return content; // Возвращаем исходное содержимое в случае ошибки
  }
}

/**
 * Обновляет все JS файлы в папке, сортируя свойства и форматируя содержимое
 */
function processJsFiles() {
  const jsFiles = getJsFiles(targetDirectory);

  jsFiles.forEach((file) => {
    console.log(`Обрабатываем файл: ${file}`);

    // Читаем содержимое файла
    const content = fs.readFileSync(file, 'utf8');

    // Сортируем свойства объекта
    const sortedContent = sortObjectProperties(content);

    // Форматируем содержимое
    const formattedContent = formatDefaults(sortedContent);

    // Записываем обратно в файл
    fs.writeFileSync(file, formattedContent, 'utf8');
  });

  console.log('Обработка завершена.');
}

processJsFiles();
