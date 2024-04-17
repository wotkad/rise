const fs = require('fs-extra');
const path = require('path');

const yarnlockPath = path.join(__dirname, '..', 'yarn.lock');
const readmePath = path.join(__dirname, '..', 'README.md');
const tailwindConfigPath = path.join(__dirname, '..', 'tailwind.config.js');
const fontawesomePath = path.join(__dirname, '..', 'src', 'assets', 'fonts', 'fontawesome');
const checksPath = path.join(__dirname, '..', 'src', 'assets', 'js', 'base', 'checks');
const appJsPath = path.join(__dirname, '..', 'src', 'assets', 'js', 'app.js');
const htaccessPath = path.join(__dirname, '..', '.htaccess');
const pagesPath = path.join(__dirname, '..', 'src', 'views', 'pages');
const webpackConfigPath = path.join(__dirname, '..', 'webpack.config.js');
const packagePath = path.join(__dirname, '..', 'package.json');
const stylelintrcPath = path.join(__dirname, '..', '.stylelintrc.json');
const markdownCompilerPath = path.join(__dirname, '..', 'node_scripts', 'markdown-compiler.mjs');
const postcssConfigPath = path.join(__dirname, '..', 'postcss.config.js');
const prettierConfigPath = path.join(__dirname, '..', 'prettier.config.js');
const appcssPath = path.join(__dirname, '..', 'src', 'assets', 'styles', 'app.scss');

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

const postcssConfigLines = [
  "require('tailwindcss')({}),",
];

const prettierConfigLines = [
  '"tailwindConfig": "./tailwind.config.js",',
  '"prettier-plugin-tailwindcss"'
];

const appcssLines = [
  '/*',
  '  Tailwind',
  '*/',
  '@tailwind base;',
  '@tailwind components;',
  '@tailwind utilities;'
];

const packageMarkdownLinesLanding = [
  '"markdown-it": "^13.0.1",',
  '"markdown-it-meta": "^0.0.1",'
];

const packageLinesLanding = [
  '"@barba/core": "^2.9.7",',
];

// Получение аргументов командной строки
const args = process.argv.slice(2);

const rmTw = args.includes('-rm-tw'); // +
const rmPages = args.includes('-rm-pages'); // +
const rmFontawesome = args.includes('-rm-fonts'); // +
const rmYarnlock = args.includes('-rm-yarnlock'); // +
const clearReadme = args.includes('-clear-readme'); // +
const clearJs = args.includes('-clear-js'); // +
const rmMd = args.includes('-rm-md'); // +
const rmErrorPage = args.includes('-rm-err');
const updWebpack = args.includes('-upd-webpack');
const rmLinters = args.includes('-rm-lint');
const rmHighlight = args.includes('-rm-highlight');
const clearPug = args.includes('-clear-pug');
const clearScss = args.includes('-clear-scss');

const createLanding = args.includes('-landing');
const createCorporate = args.includes('-corporate');

// if (rmMd) {
//   // Чтение содержимого package.json
//   fs.readFile(packagePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Ошибка при чтении package.json:', err);
//       return;
//     }

//     // Удаление строк из package.json
//     packageMarkdownLinesLanding.forEach((line) => {
//       data = data.replace(line, '');
//     });

//     data = data.replace(/^\s*[\r\n]/gm, '');

//     // Запись изменений обратно в package.json
//     fs.writeFile(packagePath, data, 'utf8', (err) => {
//       if (err) {
//         console.error('Ошибка при записи в package.json:', err);
//         return;
//       }
//       console.log('Файл package.json успешно обновлён.');
//     });
//   });

//   fs.remove(markdownCompilerPath, (err) => {
//     if (err) {
//       console.error('Ошибка при удалении файла:', err);
//       return;
//     }
//     console.log('Файл "markdown-compiler.mjs" успешно удален.');
//   });
// }

// if (createLanding) {
//   // Чтение содержимого package.json
//   fs.readFile(packagePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Ошибка при чтении package.json:', err);
//       return;
//     }

//     // Удаление строк из package.json
//     packageLinesLanding.forEach((line) => {
//       data = data.replace(line, '');
//     });

//     data = data.replace(/^\s*[\r\n]/gm, '');

//     // Запись изменений обратно в package.json
//     fs.writeFile(packagePath, data, 'utf8', (err) => {
//       if (err) {
//         console.error('Ошибка при записи в package.json:', err);
//         return;
//       }
//       console.log('Файл package.json успешно обновлён.');
//     });
//   });
// }

// if (rmYarnlock) {
//   fs.unlink(rmYarnlockPath, (err) => {
//     if (err) {
//       console.error('Ошибка при удалении файла:', err);
//       return;
//     }
//     console.log('Файл yarn.lock успешно удален.');
//   });
// }

// if (rmFontawesome) {
//   fs.remove(fontawesomePath, (err) => {
//     if (err) {
//       console.error('Ошибка при удалении папки:', err);
//       return;
//     }
//     console.log('Папка "/fontawesome/" успешно удалена.');
//   });
// }

// if (clearJs) {
//   fs.readFile(appJsPath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Ошибка при чтении app.js:', err);
//       return;
//     }

//     // Удаление строк из app.js
//     appJsLines.forEach((line) => {
//       const regex = new RegExp(`\\s*${line}\\s*`, 'g');
//       data = data.replace(regex, '\n\n');
//     });

//     // Запись изменений обратно в app.js
//     fs.writeFile(appJsPath, data, 'utf8', (err) => {
//       if (err) {
//         console.error('Ошибка при записи в app.js:', err);
//         return;
//       }
//       console.log('Файл app.js успешно обновлён.');
//     });
//   });

//   fs.remove(checksPath, (err) => {
//     if (err) {
//       console.error('Ошибка при удалении папки:', err);
//       return;
//     }
//     console.log('Папка "/checks/" успешно удалена.');
//   });
// }

// if (clearReadme) {
//   fs.readFile(readmePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Ошибка при чтении README.md:', err);
//       return;
//     }

//     // Удаление содержимого README.md
//     fs.writeFile(readmePath, '', 'utf8', (err) => {
//       if (err) {
//         console.error('Ошибка при очистке README.md:', err);
//         return;
//       }
//       console.log('Файл README.md успешно очищен.');
//     });
//   });
// }

// if (rmPages) {
//   // Чтение содержимого webpack.config.js
//   fs.readFile(webpackConfigPath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Ошибка при чтении webpack.config.js:', err);
//       return;
//     }

//     // Удаление строк из webpack.config.js
//     webpackPagesLines.forEach((line) => {
//       const regex = new RegExp(`\\s*${line}\\s*`, 'g');
//       data = data.replace(regex, '\n  \n      ');
//     });

//     // Запись изменений обратно в webpack.config.js
//     fs.writeFile(webpackConfigPath, data, 'utf8', (err) => {
//       if (err) {
//         console.error('Ошибка при записи в webpack.config.js:', err);
//         return;
//       }
//       console.log('Файл webpack.config.js успешно обновлён.');
//     });
//   });

//   fs.remove(pagesPath, (err) => {
//     if (err) {
//       console.error('Ошибка при удалении папки:', err);
//       return;
//     }
//     console.log('Папка "/pages/" успешно удалена.');
//   });
// }

// if (rmTw) {
  // // Чтение содержимого package.json
  // fs.readFile(packagePath, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Ошибка при чтении package.json:', err);
  //     return;
  //   }

  //   // Удаление строк из package.json
  //   packageTailwindLines.forEach((line) => {
  //     data = data.replace(line, '');
  //   });

  //   data = data.replace(/^\s*[\r\n]/gm, '');

  //   // Запись изменений обратно в package.json
  //   fs.writeFile(packagePath, data, 'utf8', (err) => {
  //     if (err) {
  //       console.error('Ошибка при записи в package.json:', err);
  //       return;
  //     }
  //     console.log('Файл package.json успешно обновлён.');
  //   });
  // });

  // // Чтение содержимого .stylelintrc.json
  // fs.readFile(stylelintrcPath, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Ошибка при чтении package.json:', err);
  //     return;
  //   }

  //   // Удаление строк из stylelintrcPath.json
  //   data = data.replace(
  //     '  "extends": ["stylelint-config-recommended-scss", "stylelint-config-tailwindcss", "stylelint-scss"]', 
  //     '  "extends": ["stylelint-config-recommended-scss", "stylelint-scss"]');

  //   // Запись изменений обратно в .stylelintrc.json
  //   fs.writeFile(stylelintrcPath, data, 'utf8', (err) => {
  //     if (err) {
  //       console.error('Ошибка при записи в .stylelintrc.json:', err);
  //       return;
  //     }
  //     console.log('Файл .stylelintrc.json успешно обновлён.');
  //   });
  // });

  // // Чтение содержимого postcss.config.js
  // fs.readFile(postcssConfigPath, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Ошибка при чтении postcss.config.js:', err);
  //     return;
  //   }
    
  //   // Удаление строк из postcss.config.js
  //   postcssConfigLines.forEach((line) => {
  //     const regex = new RegExp(`\\s*${line}\\s*`, 'g');
  //     data = data.replace(regex, '\n    ');
  //   });

  //   // Запись изменений обратно в postcss.config.js
  //   fs.writeFile(postcssConfigPath, data, 'utf8', (err) => {
  //     if (err) {
  //       console.error('Ошибка при записи в postcss.config.js:', err);
  //       return;
  //     }
  //     console.log('Файл postcss.config.js успешно обновлён.');
  //   });
  // });

  // // Чтение содержимого prettier.config.js
  // fs.readFile(prettierConfigPath, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Ошибка при чтении prettier.config.js:', err);
  //     return;
  //   }
    
  //   // Удаление строк из prettier.config.js
  //   prettierConfigLines.forEach((line) => {
  //     const regex = new RegExp(`\\s*${line}\\s*`, 'g');
  //     data = data.replace(regex, '\n  ');
  //   });

  //   // Запись изменений обратно в prettier.config.js
  //   fs.writeFile(prettierConfigPath, data, 'utf8', (err) => {
  //     if (err) {
  //       console.error('Ошибка при записи в prettier.config.js:', err);
  //       return;
  //     }
  //     console.log('Файл prettier.config.js успешно обновлён.');
  //   });
  // });

  // fs.readFile(appcssPath, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Ошибка при чтении app.scss:', err);
  //     return;
  //   }

  //   data = data.replace('// @import "./utils/reset"; // Если "@tailwind base" подключён ниже, то этот импорт не нужен.', '@import "./utils/reset";');
    
  //   // Удаление строк с комментарием Tailwind и строк с tailwind directives
  //   const regexTailwindComment = /\/\*\s*Tailwind\s*\*\//g;
  //   const regexTailwindDirectives = /\s*@tailwind\s+(base|components|utilities);*/g;
  //   data = data.replace(regexTailwindComment, ' ');
  //   data = data.replace(regexTailwindDirectives, ' ');
  
  //   // Запись изменений обратно в app.scss
  //   fs.writeFile(appcssPath, data, 'utf8', (err) => {
  //     if (err) {
  //       console.error('Ошибка при записи в app.scss:', err);
  //       return;
  //     }
  //     console.log('Файл app.scss успешно обновлён.');
  //   });
  // });
// }