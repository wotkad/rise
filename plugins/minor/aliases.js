const path = require('path');

function AliasesGenerator() {
  // Fix: используем правильный базовый путь до проекта
  const rootPath = path.resolve(__dirname, '../../');
  const srcPath = path.resolve(rootPath, 'src');
  
  const jsBase = path.resolve(srcPath, 'assets/js/base');
  const scssBase = path.resolve(srcPath, 'assets/styles');
  const images = path.resolve(srcPath, 'assets/images');
  const fonts = path.resolve(srcPath, 'assets/fonts');
  const views = path.resolve(srcPath, 'views');
  const components = path.resolve(views, 'components');
  const mixins = path.resolve(views, 'mixins');
  const layouts = path.resolve(views, 'layouts');

  return {
    '@root': rootPath,
    '@': srcPath,
    '@js': path.resolve(srcPath, 'assets/js'),
    '@defaults': path.resolve(srcPath, 'assets/js/_defaults'),
    '@common': path.resolve(jsBase, 'common'),
    '@checks': path.resolve(jsBase, 'checks'),
    '@routing': path.resolve(jsBase, 'routing'),
    '@cache': path.resolve(srcPath, 'assets/js/cache'),

    '@styles': scssBase,
    '@s-utils': path.resolve(scssBase, 'utils'),
    '@s-mixins': path.resolve(scssBase, 'mixins'),
    '@s-components': path.resolve(scssBase, 'components'),
    '@s-base': path.resolve(scssBase, 'base'),

    '@images': images,
    '@fonts': fonts,

    '@pug': views,
    '@p-mixins': mixins,
    '@p-components': components,
    '@p-layouts': layouts,
  };
}

module.exports = AliasesGenerator;
