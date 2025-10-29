const path = require('path');

function generateAliases() {
  const srcPath = path.resolve(process.cwd(), 'src');
  const jsBase = path.resolve(srcPath, 'assets/js/base');
  const scssBase = path.resolve(srcPath, 'assets/styles');
  const images = path.resolve(srcPath, 'assets/images');
  const fonts = path.resolve(srcPath, 'assets/fonts');
  const views = path.resolve(srcPath, 'views');
  const components = path.resolve(views, 'components');
  const mixins = path.resolve(views, 'mixins');
  const layouts = path.resolve(views, 'layouts');

  return {
    '@root': path.resolve('./'),
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
    '@p-mixins': path.resolve(mixins),
    '@p-components': path.resolve(components),
    '@p-layouts': path.resolve(layouts),
  };
}

module.exports = generateAliases;