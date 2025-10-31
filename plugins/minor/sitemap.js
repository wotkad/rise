const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

function getPugFiles(dir, rootDir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getPugFiles(fullPath, rootDir));
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.pug') &&
      !entry.name.startsWith('_')
    ) {
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      files.push(relPath);
    }
  }

  return files;
}

class SitemapGenerator {
  constructor(options = {}) {
    this.options = options;
    this.generated = false;
  }

  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('SitemapPlugin', () => {
      if (!compiler.options.watchOptions) compiler.options.watchOptions = {};
      const ignored = compiler.options.watchOptions.ignored || [];
      compiler.options.watchOptions.ignored = Array.isArray(ignored)
        ? [...ignored, '**/sitemap.xml']
        : ['**/sitemap.xml'];
    });

    compiler.hooks.done.tapPromise('SitemapPlugin', async () => {
      if (this.generated && compiler.options.watch) return;
      this.generated = true;

      const { baseUrl, viewsDir, output } = this.options;
      console.log('\n🚀 Cоздания карты сайта...');

      const pugFiles = getPugFiles(viewsDir, viewsDir);

      const filtered = pugFiles.filter(file => {
        return !(
          file.includes('layouts/') ||
          file.includes('mixins/') ||
          file.includes('components/') ||
          file.includes('404')
        );
      });

      const links = filtered.map(file => {
        const noExt = file.replace(/\.pug$/, '');
        const url = noExt === 'index' ? '/' : `/${noExt}.html`;
        return { url, changefreq: 'monthly', priority: 0.8 };
      });

      const stream = new SitemapStream({ hostname: baseUrl });
      const xml = await streamToPromise(Readable.from(links).pipe(stream));

      const pretty = xml
        .toString()
        .replace(/></g, '>\n<')
        .replace(/(<url>)/g, '  $1')
        .replace(/(<\/url>)/g, '  $1');

      const dir = path.dirname(output);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(output, pretty);
      console.log(
        `✅ Готово: карта сайта создана (${links.length} страниц)`
      );
    });
  }
}

module.exports = SitemapGenerator;
