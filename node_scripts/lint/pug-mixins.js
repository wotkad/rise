const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

// Папка с файлами .pug
const VIEWS_DIR = path.resolve('./src/views');

// Функция для рекурсивного поиска файлов .pug
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

// Рекурсивная функция для форматирования объектов и массивов
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
            .map((key) => `${indent}  ${key}: ${formatValue(value[key], `${indent}  `)},`)
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

// Функция для форматирования вызова миксинов
function formatMixinCalls(content) {
    return content.replace(/^([ \t]*)\+(\w+)\((\{[\s\S]*?\})\)/gm, (match, indent, mixinName, attributes) => {
        try {
            // Парсим атрибуты с помощью JSON5
            const attrObject = JSON5.parse(attributes);

            // Рекурсивно форматируем объект атрибутов
            const formattedAttributes = formatValue(attrObject, indent);

            // Формируем отформатированную строку с сохранением отступа
            return `${indent}+${mixinName}(${formattedAttributes})`;
        } catch (err) {
            console.error('Ошибка при обработке миксина:', match, err);
            return match; // Возвращаем исходную строку в случае ошибки
        }
    });
}

// Функция для обработки всех файлов
function processPugFiles() {
    const files = findPugFiles(VIEWS_DIR);

    files.forEach((file) => {
        console.log(`Обрабатываем файл: ${file}`);

        // Читаем содержимое файла
        const content = fs.readFileSync(file, 'utf8');

        // Форматируем содержимое
        const formattedContent = formatMixinCalls(content);

        // Записываем обратно в файл
        fs.writeFileSync(file, formattedContent, 'utf8');
    });

    console.log('Обработка завершена.');
}

processPugFiles();
