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

const webpackPagesLinesCorporate = [
  '...utils.pages(MODE, "blog"),'
];

const packageTailwindLines = [
  '"prettier-plugin-tailwindcss": "^0.2.4",',
  '"stylelint-config-tailwindcss": "^0.0.7",',
  '"tailwindcss": "^3.2.7",'
];

const appJsLines = [
  'import "./base/checks/check-internal-links";',
  'import "./base/checks/check-target";',
  'import "./base/routing/routing";'
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

const args = process.argv.slice(2);

const createOnePage = args.includes('-one-page');
const createMultiPage = args.includes('-multi-page');

if (createOnePage) {
  fs.readFile(packagePath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    data = data.replace(
      '"build": "yarn compile-md && rimraf build && webpack --env mode=production --config ./webpack.config.js --progress && node ./node_scripts/sitemap-update && node ./node_scripts/not-found-page-update && rimraf ./build/404",', 
      '"build": "yarn compile-md && rimraf build && webpack --env mode=production --config ./webpack.config.js --progress && node ./node_scripts/sitemap-update",');

    data = data.replace(
      '"build": "yarn compile-md && rimraf build && webpack --env mode=production --config ./webpack.config.js --progress && node ./node_scripts/sitemap-update",', 
      '"build": "rimraf build && webpack --env mode=production --config ./webpack.config.js --progress && node ./node_scripts/sitemap-update",');
    
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
        return;
      }
    });
  });

  fs.remove(notFoundPageUpdatePath, (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(markdownCompilerPath, (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(markdownPagesPath, (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(bundlePath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    const regex = new RegExp(`\\s*${'import "highlight.js/scss/atom-one-dark.scss";'}\\s*`, 'g');
    data = data.replace(regex, '\n\n');

    fs.writeFile(bundlePath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(yarnlockPath, (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(fontawesomePath, (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(readmePath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(readmePath, '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(appJsPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    appJsLines.forEach((line) => {
      const regex = new RegExp(`\\s*${line}\\s*`, 'g');
      data = data.replace(regex, '\n\n');
    });

    fs.writeFile(appJsPath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(checksPath, (err) => {
    if (err) {
      return;
    }
  });
  
  let removeEmptyLineAfter = false;

  fs.readFile(webpackConfigPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

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

    const updatedContent = filteredLines.join('\n');

    fs.writeFile(webpackConfigPath, updatedContent, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(pagesPath, (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(tailwindConfigPath, (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(stylelintrcPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    data = data.replace(
      '  "extends": ["stylelint-config-recommended-scss", "stylelint-config-tailwindcss", "stylelint-scss"]', 
      '  "extends": ["stylelint-config-recommended-scss", "stylelint-scss"]');

    fs.writeFile(stylelintrcPath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(postcssConfigPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    data = data.replace(
      "require('tailwindcss')({}),", 
      "");

    fs.writeFile(postcssConfigPath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(prettierConfigPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    prettierConfigLines.forEach((line) => {
      const regex = new RegExp(`\\s*${line}\\s*`, 'g');
      data = data.replace(regex, '\n  ');
    });

    fs.writeFile(prettierConfigPath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(path.join(__dirname, '..', '/src/assets/styles/components/blog.scss'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/assets/styles/components/hero.scss'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/assets/styles/components/not-found.scss'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/assets/styles/mixins'), (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/base/typography.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/base/typography.scss'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/base/fonts.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/base/fonts.scss'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/components/header.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/components/header.scss'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/components/footer.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/components/footer.scss'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(path.join(__dirname, '..', '/src/views/mixins'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/views/pages/blog'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/assets/views/pages/blog.pug'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/views/components/blog.pug'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/views/components/hero.pug'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/views/components/not-found.pug'), (err) => {
    if (err) {
      return;
    }
  });

  fs.writeFile(path.join(__dirname, '..', 'src/views/components/header.pug'), '', 'utf8', (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(path.join(__dirname, '..', '/src/views/components/footer.pug'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/views/components/footer.pug'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(path.join(__dirname, '..', '/src/assets/js/base/routing'), (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(appcssPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    data = data.replace('// @import "./utils/reset"; // Если "@tailwind base" подключён ниже, то этот импорт не нужен.', '@import "./utils/reset";');
    
    const regexTailwindComment = /\/\*\s*Tailwind\s*\*\//g;
    const regexTailwindDirectives = /\s*@tailwind\s+(base|components|utilities);*/g;
    data = data.replace(regexTailwindComment, ' ');
    data = data.replace(regexTailwindDirectives, ' ');

    const regexMixinsComment = /\/\*\s*Миксины\s*\*\//g;
    const regexMixinsDirectives = /\s*@import\s+"\.\/(mixins\/(?:title|article))";*/g
    data = data.replace(regexMixinsComment, ' ');
    data = data.replace(regexMixinsDirectives, ' ');

    const regexComponentsDirectives = /\s*@import\s+"\.\/(components\/(?:hero|blog|not-found))";*/g
    data = data.replace(regexComponentsDirectives, ' ');

    fs.writeFile(appcssPath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/views/layouts/master.pug'), 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    data = data.replace(/block content/g, 'block content\n\n    include ../components/footer');
    data = data.replace(/include \.\.\/mixins\/(?:title|article)\n*/g, '');
    data = data.replace(/\n\s*(\s*)include \.\.\/components\/header/g, '\n$1\n    include ../components/header');

    fs.writeFile(path.join(__dirname, '..', '/src/views/layouts/master.pug'), data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/views/pages/404.pug'), 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    data = data.replace(/\.barba\(data-barba="wrapper"\)[\s\S]*?include \.\.\/components\/footer[\s\S]*?$/, '');
    data = data.replace(/\s*$/, '');

    fs.writeFile(path.join(__dirname, '..', '/src/views/pages/404.pug'), data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });
  
  fs.readFile(path.join(__dirname, '..', '/src/views/index.pug'), 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    data = data.replace(/\.barba\(data-barba="wrapper"\)[\s\S]*?include \.\/components\/footer[\s\S]*?$/, '');
    data = data.replace(/\s*$/, '');

    fs.writeFile(path.join(__dirname, '..', '/src/views/index.pug'), data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/base/variables.scss'), 'utf8', (err, data) => {
    if (err) {
        return;
    }

    const startIndex = data.indexOf('black: #000000;') + 'black: #000000;'.length;
    if (startIndex === -1) {
        return;
    }

    const newData = data.substring(0, startIndex);

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/base/variables.scss'), newData, 'utf8', (err) => {
        if (err) {
            return;
        }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/base/global.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    const regex = /\.page-wrapper \{[\s\S]*?\}[\s\S]*?\.page-container \{[\s\S]*?\}/;
    data = data.replace(regex, '');
    data = data.replace(/\s*(?=@media \(prefers-reduced-motion: reduce\))/, '\n\n');
    data = data.replace(/  color: \$slate-900;[\n\r]*/, '');
    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/base/global.scss'), data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });
}
if (createMultiPage) {
  fs.readFile(packagePath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    data = data.replace(
      '"build": "yarn compile-md && rimraf build && webpack --env mode=production --config ./webpack.config.js --progress && node ./node_scripts/sitemap-update && node ./node_scripts/not-found-page-update && rimraf ./build/404",', 
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

    packageTailwindLines.forEach((line) => {
      data = data.replace(line, '');
    });

    data = data.replace(/^\s*[\r\n]/gm, '');

    fs.writeFile(packagePath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(markdownCompilerPath, (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(markdownPagesPath, (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(bundlePath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    const regex = new RegExp(`\\s*${'import "highlight.js/scss/atom-one-dark.scss";'}\\s*`, 'g');
    data = data.replace(regex, '\n\n');

    fs.writeFile(bundlePath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(yarnlockPath, (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(fontawesomePath, (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(readmePath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(readmePath, '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });
  
  let removeEmptyLineAfter = false;

  fs.readFile(webpackConfigPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    const lines = data.split('\n');

    const filteredLines = lines.filter(line => {
      if (removeEmptyLineAfter && line.trim() === '') {
          removeEmptyLineAfter = false;
          return false;
      }

      if (webpackPagesLinesCorporate.includes(line.trim())) {
          removeEmptyLineAfter = true;
      }

      return !webpackPagesLinesCorporate.includes(line.trim());
  });

    let updatedContent = filteredLines.join('\n');

    updatedContent = updatedContent.replace('...utils.pages(MODE),', '...utils.pages(MODE),\n');

    fs.writeFile(webpackConfigPath, updatedContent, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(tailwindConfigPath, (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(stylelintrcPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    data = data.replace(
      '  "extends": ["stylelint-config-recommended-scss", "stylelint-config-tailwindcss", "stylelint-scss"]', 
      '  "extends": ["stylelint-config-recommended-scss", "stylelint-scss"]');

    fs.writeFile(stylelintrcPath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(postcssConfigPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    data = data.replace(
      "require('tailwindcss')({}),", 
      "");

    fs.writeFile(postcssConfigPath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(prettierConfigPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    prettierConfigLines.forEach((line) => {
      const regex = new RegExp(`\\s*${line}\\s*`, 'g');
      data = data.replace(regex, '\n  ');
    });

    fs.writeFile(prettierConfigPath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(path.join(__dirname, '..', '/src/assets/styles/components/blog.scss'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/assets/styles/components/hero.scss'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/assets/styles/mixins'), (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/base/typography.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/base/typography.scss'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

   fs.readFile(path.join(__dirname, '..', '/src/assets/styles/components/not-found.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/components/not-found.scss'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/base/fonts.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/base/fonts.scss'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/components/header.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/components/header.scss'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/components/footer.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/components/footer.scss'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.remove(path.join(__dirname, '..', '/src/views/mixins'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/views/pages/blog'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/views/pages/blog.pug'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/views/components/blog.pug'), (err) => {
    if (err) {
      return;
    }
  });

  fs.remove(path.join(__dirname, '..', '/src/views/components/hero.pug'), (err) => {
    if (err) {
      return;
    }
  });

  fs.writeFile(path.join(__dirname, '..', 'src/views/components/header.pug'), '', 'utf8', (err) => {
    if (err) {
      return;
    }
  });

  fs.readFile(path.join(__dirname, '..', '/src/views/components/footer.pug'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/views/components/footer.pug'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(appcssPath, 'utf8', (err, data) => {
    if (err) {
      return;
    }

    data = data.replace('// @import "./utils/reset"; // Если "@tailwind base" подключён ниже, то этот импорт не нужен.', '@import "./utils/reset";');
    
    const regexTailwindComment = /\/\*\s*Tailwind\s*\*\//g;
    const regexTailwindDirectives = /\s*@tailwind\s+(base|components|utilities);*/g;
    data = data.replace(regexTailwindComment, ' ');
    data = data.replace(regexTailwindDirectives, ' ');

    const regexMixinsComment = /\/\*\s*Миксины\s*\*\//g;
    const regexMixinsDirectives = /\s*@import\s+"\.\/(mixins\/(?:title|article))";*/g
    data = data.replace(regexMixinsComment, ' ');
    data = data.replace(regexMixinsDirectives, ' ');
    const regexComponentsDirectives = /\s*@import\s+"\.\/(components\/(?:hero|blog|not-found))";*/g
    data = data.replace(regexComponentsDirectives, ' ');

    fs.writeFile(appcssPath, data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/views/layouts/master.pug'), 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    data = data.replace(/block content/g, 'block content\n\n    include ../components/footer');
    data = data.replace(/include \.\.\/mixins\/(?:title|article)\n*/g, '');
    data = data.replace(/\n\s*(\s*)include \.\.\/components\/header/g, '\n$1\n    include ../components/header');

    fs.writeFile(path.join(__dirname, '..', '/src/views/layouts/master.pug'), data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/views/pages/404.pug'), 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    data = data.replace(/\.barba\(data-barba="wrapper"\)[\s\S]*?include \.\.\/components\/footer[\s\S]*?$/, '');
    data = data.replace(/\s*$/, '');

    fs.writeFile(path.join(__dirname, '..', '/src/views/pages/404.pug'), data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });
  
  fs.readFile(path.join(__dirname, '..', '/src/views/index.pug'), 'utf8', (err, data) => {
    if (err) {
      return;
    }
    
    data = data.replace(/\.barba\(data-barba="wrapper"\)[\s\S]*?include \.\/components\/footer[\s\S]*?$/, '');
    data = data.replace(/\s*$/, '');

    fs.writeFile(path.join(__dirname, '..', '/src/views/index.pug'), data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/views/components/not-found.pug'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    fs.writeFile(path.join(__dirname, '..', '/src/views/components/not-found.pug'), '', 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/base/variables.scss'), 'utf8', (err, data) => {
    if (err) {
        return;
    }

    const startIndex = data.indexOf('black: #000000;') + 'black: #000000;'.length;
    if (startIndex === -1) {
        return;
    }

    const newData = data.substring(0, startIndex);

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/base/variables.scss'), newData, 'utf8', (err) => {
        if (err) {
            return;
        }
    });
  });

  fs.readFile(path.join(__dirname, '..', '/src/assets/styles/base/global.scss'), 'utf8', (err, data) => {
    if (err) {
      return;
    }

    const regex = /\.page-wrapper \{[\s\S]*?\}[\s\S]*?\.page-container \{[\s\S]*?\}/;

    data = data.replace(regex, '');
    data = data.replace(/\s*(?=@media \(prefers-reduced-motion: reduce\))/, '\n\n');
    data = data.replace(/  color: \$slate-900;[\n\r]*/, '');

    fs.writeFile(path.join(__dirname, '..', '/src/assets/styles/base/global.scss'), data, 'utf8', (err) => {
      if (err) {
        return;
      }
    });
  });
}