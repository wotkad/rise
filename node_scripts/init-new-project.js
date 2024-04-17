const fs = require('fs-extra');
const path = require('path');

const yarnlockPath = path.join(__dirname, '..', 'yarn.lock');
const readmePath = path.join(__dirname, '..', 'README.md');
const tailwindConfigPath = path.join(__dirname, '..', 'tailwind.config.js');
const fontawesomePath = path.join(__dirname, '..', 'src', 'assets', 'fonts', 'fontawesome');
const checksPath = path.join(__dirname, '..', 'src', 'assets', 'js', 'base', 'checks');
const appJsPath = path.join(__dirname, '..', 'src', 'assets', 'js', 'app.js');
const pagesPath = path.join(__dirname, '..', 'src', 'views', 'pages');
const webpackConfigPath = path.join(__dirname, '..', 'webpack.config.js');
const packagePath = path.join(__dirname, '..', 'package.json');
const stylelintrcPath = path.join(__dirname, '..', '.stylelintrc.json');
const markdownCompilerPath = path.join(__dirname, '..', 'node_scripts', 'markdown-compiler.mjs');
const markdownPagesPath = path.join(__dirname, '..', 'src', 'markdown');
const postcssConfigPath = path.join(__dirname, '..', 'postcss.config.js');
const prettierConfigPath = path.join(__dirname, '..', 'prettier.config.js');
const appcssPath = path.join(__dirname, '..', 'src', 'assets', 'styles', 'app.scss');
const bundlePath = path.join(__dirname, '..', 'src', 'bundle.js');
const notFoundPageUpdatePath = path.join(__dirname, '..', 'node_scripts', 'not-found-page-update.js');

const webpackPagesLines = [
  '...utils.pages(MODE),',
  '...utils.pages(MODE, "blog"),'
];

const packageTailwindLines = [
  '"prettier-plugin-tailwindcss": "^0.2.4",',
  '"stylelint-config-tailwindcss": "^0.0.7",',
  '"tailwindcss": "^3.2.7",'
];

const appJsLines = [
  'import "./base/checks/check-internal-links";',
  'import "./base/checks/check-target";'
];

const prettierConfigLines = [
  '"tailwindConfig": "./tailwind.config.js",',
  '"prettier-plugin-tailwindcss"'
];

const packageMarkdownLines = [
  '"markdown-it": "^13.0.1",',
  '"markdown-it-meta": "^0.0.1",',
  '"highlight.js": "^11.7.0",'
];

const packageLinesLanding = [
  '"@barba/core": "^2.9.7",',
];

const bundleLines = [
  'import "highlight.js/scss/atom-one-dark.scss";',
];

// Получение аргументов командной строки
const args = process.argv.slice(2);

// const rmLinters = args.includes('-rm-lint');
// const clearPug = args.includes('-clear-pug');
// const clearScss = args.includes('-clear-scss');

const createLanding = args.includes('-landing');
const createCorporate = args.includes('-corporate');

if (createLanding) {
  // fs.remove('.git', (err) => {
  //   if (err) {
  //     console.error('Ошибка при удалении папка:', err);
  //     return;
  //   }
  //   console.log('Папка ".git" успешно удалена.');
  // });

  fs.readFile(packagePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении package.json:', err);
      return;
    }

    data = data.replace(
      '"build": "yarn compile-md && rimraf build && webpack --env mode=production --config ./webpack.config.js --progress && node ./node_scripts/sitemap-update && node ./node_scripts/not-found-page-update && rimraf ./build/404",', 
      '"build": "yarn compile-md && rimraf build && webpack --env mode=production --config ./webpack.config.js --progress && node ./node_scripts/sitemap-update",');

    data = data.replace(
      '"build": "yarn compile-md && rimraf build && webpack --env mode=production --config ./webpack.config.js --progress && node ./node_scripts/sitemap-update",', 
      '"build": "rimraf build && webpack --env mode=production --config ./webpack.config.js --progress && node ./node_scripts/sitemap-update && node ./node_scripts/not-found-page-update && rimraf ./build/404",');
    
    data = data.replace(
      '"dev": "yarn compile-md && yarn develop",', 
      '"dev": "yarn develop",');

    data = data.replace(
      '"compile-md": "yarn rimraf ./src/views/pages/blog/ && node ./node_scripts/markdown-compiler.mjs && node ./node_scripts/pug-clear",', 
      '');

    packageMarkdownLines.forEach((line) => {
      data = data.replace(line, '');
    });

    packageLinesLanding.forEach((line) => {
      data = data.replace(line, '');
    });

    packageTailwindLines.forEach((line) => {
      data = data.replace(line, '');
    });

    data = data.replace(/^\s*[\r\n]/gm, '');

    fs.writeFile(packagePath, data, 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при записи в package.json:', err);
        return;
      }
      console.log('Файл package.json успешно обновлён.');
    });
  });

  fs.remove(notFoundPageUpdatePath, (err) => {
    if (err) {
      console.error('Ошибка при удалении файла:', err);
      return;
    }
    console.log('Файл "not-found-page-update.js" успешно удален.');
  });

  fs.remove(markdownCompilerPath, (err) => {
    if (err) {
      console.error('Ошибка при удалении файла:', err);
      return;
    }
    console.log('Файл "markdown-compiler.mjs" успешно удален.');
  });

  fs.remove(markdownPagesPath, (err) => {
    if (err) {
      console.error('Ошибка при удалении папки:', err);
      return;
    }
    console.log('Папка "/markdown/" успешно удалена.');
  });

  fs.readFile(bundlePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении bundle.js:', err);
      return;
    }

    // Удаление строк из bundle.js
    bundleLines.forEach((line) => {
      const regex = new RegExp(`\\s*${line}\\s*`, 'g');
      data = data.replace(regex, '\n\n');
    });

    // Запись изменений обратно в bundle.js
    fs.writeFile(bundlePath, data, 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при записи в bundle.js:', err);
        return;
      }
      console.log('Файл bundle.js успешно обновлён.');
    });
  });

  fs.remove(yarnlockPath, (err) => {
    if (err) {
      console.error('Ошибка при удалении файла:', err);
      return;
    }
    console.log('Файл yarn.lock успешно удален.');
  });

  fs.remove(fontawesomePath, (err) => {
    if (err) {
      console.error('Ошибка при удалении папки:', err);
      return;
    }
    console.log('Папка "/fontawesome/" успешно удалена.');
  });

  fs.readFile(readmePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении README.md:', err);
      return;
    }

    // Удаление содержимого README.md
    fs.writeFile(readmePath, '', 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при очистке README.md:', err);
        return;
      }
      console.log('Файл README.md успешно очищен.');
    });
  });

  fs.readFile(appJsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении app.js:', err);
      return;
    }

    // Удаление строк из app.js
    appJsLines.forEach((line) => {
      const regex = new RegExp(`\\s*${line}\\s*`, 'g');
      data = data.replace(regex, '\n\n');
    });

    // Запись изменений обратно в app.js
    fs.writeFile(appJsPath, data, 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при записи в app.js:', err);
        return;
      }
      console.log('Файл app.js успешно обновлён.');
    });
  });

  fs.remove(checksPath, (err) => {
    if (err) {
      console.error('Ошибка при удалении папки:', err);
      return;
    }
    console.log('Папка "/checks/" успешно удалена.');
  });
  
  let removeEmptyLineAfter = false;

  // Чтение содержимого webpack.config.js
  fs.readFile(webpackConfigPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении webpack.config.js:', err);
      return;
    }

    // Split the file content into an array of lines
    const lines = data.split('\n');

    const filteredLines = lines.filter(line => {
      if (removeEmptyLineAfter && line.trim() === '') {
          removeEmptyLineAfter = false;
          return false;
      }

      if (webpackPagesLines.includes(line.trim())) {
          removeEmptyLineAfter = true;
      }

      return !webpackPagesLines.includes(line.trim());
  });

    // Join the filtered lines back into a single string
    const updatedContent = filteredLines.join('\n');


    // Запись изменений обратно в webpack.config.js
    fs.writeFile(webpackConfigPath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при записи в webpack.config.js:', err);
        return;
      }
      console.log('Файл webpack.config.js успешно обновлён.');
    });
  });

  fs.remove(pagesPath, (err) => {
    if (err) {
      console.error('Ошибка при удалении папки:', err);
      return;
    }
    console.log('Папка "/pages/" успешно удалена.');
  });

  fs.remove(tailwindConfigPath, (err) => {
    if (err) {
      console.error('Ошибка при удалении файла:', err);
      return;
    }
    console.log('Файл "tailwind.config.js" успешно удален.');
  });

  // Чтение содержимого .stylelintrc.json
  fs.readFile(stylelintrcPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении package.json:', err);
      return;
    }

    // Удаление строк из stylelintrcPath.json
    data = data.replace(
      '  "extends": ["stylelint-config-recommended-scss", "stylelint-config-tailwindcss", "stylelint-scss"]', 
      '  "extends": ["stylelint-config-recommended-scss", "stylelint-scss"]');

    // Запись изменений обратно в .stylelintrc.json
    fs.writeFile(stylelintrcPath, data, 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при записи в .stylelintrc.json:', err);
        return;
      }
      console.log('Файл .stylelintrc.json успешно обновлён.');
    });
  });

  // Чтение содержимого postcss.config.js
  fs.readFile(postcssConfigPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении postcss.config.js:', err);
      return;
    }
    
    data = data.replace(
      "require('tailwindcss')({}),", 
      "");

    // Запись изменений обратно в postcss.config.js
    fs.writeFile(postcssConfigPath, data, 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при записи в postcss.config.js:', err);
        return;
      }
      console.log('Файл postcss.config.js успешно обновлён.');
    });
  });

  // Чтение содержимого prettier.config.js
  fs.readFile(prettierConfigPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении prettier.config.js:', err);
      return;
    }
    
    // Удаление строк из prettier.config.js
    prettierConfigLines.forEach((line) => {
      const regex = new RegExp(`\\s*${line}\\s*`, 'g');
      data = data.replace(regex, '\n  ');
    });

    // Запись изменений обратно в prettier.config.js
    fs.writeFile(prettierConfigPath, data, 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при записи в prettier.config.js:', err);
        return;
      }
      console.log('Файл prettier.config.js успешно обновлён.');
    });
  });

  fs.readFile(appcssPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении app.scss:', err);
      return;
    }

    data = data.replace('// @import "./utils/reset"; // Если "@tailwind base" подключён ниже, то этот импорт не нужен.', '@import "./utils/reset";');
    
    // Удаление строк с комментарием Tailwind и строк с tailwind directives
    const regexTailwindComment = /\/\*\s*Tailwind\s*\*\//g;
    const regexTailwindDirectives = /\s*@tailwind\s+(base|components|utilities);*/g;
    data = data.replace(regexTailwindComment, ' ');
    data = data.replace(regexTailwindDirectives, ' ');
  
    // Запись изменений обратно в app.scss
    fs.writeFile(appcssPath, data, 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при записи в app.scss:', err);
        return;
      }
      console.log('Файл app.scss успешно обновлён.');
    });
  });
}