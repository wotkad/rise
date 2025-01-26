const fs = require('fs');
const path = require('path');

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

// Функция для форматирования вызова миксинов
function formatMixinCalls(content) {
    return content.replace(/^(\s*)\+(\w+)\((\{[\s\S]*?\})\)/gm, (match, indent, mixinName, attributes) => {
        try {
            // Преобразуем атрибуты в объект
            const attrObject = eval(`(${attributes})`);

            // Сортируем ключи по алфавиту
            const sortedAttributes = Object.keys(attrObject)
                .sort()
                .map(
                    (key) => `${indent}  ${key}: '${attrObject[key]}',`
                )
                .join('\n');

            // Формируем отформатированную строку с сохранением отступа
            return `${indent}+${mixinName}({\n${sortedAttributes}\n${indent}})`;
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
