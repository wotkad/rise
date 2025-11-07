const fs = require('fs');
const path = require('path');

function getPugFiles(dir, rootDir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getPugFiles(fullPath, rootDir));
    } else if (entry.isFile() && entry.name.endsWith('.pug')) {
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      files.push({ relPath, fullPath });
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
    compiler.hooks.done.tapPromise('SitemapPlugin', async () => {
      if (this.generated && compiler.options.watch) return;
      this.generated = true;

      const { baseUrl, viewsDir, output } = this.options;
      console.log('\n🚀 Создание карты сайта...');

      const pugFiles = getPugFiles(viewsDir, viewsDir);

      const filtered = pugFiles.filter(fileObj => {
        const { relPath } = fileObj;
        return !(
          relPath.startsWith('components/') ||
          relPath.startsWith('layouts/') ||
          relPath.startsWith('mixins/')
        );
      });

      const links = filtered.map(fileObj => {
        let url = fileObj.relPath.replace(/\.pug$/, '');
        if (url.startsWith('pages/')) url = url.replace(/^pages\//, '');
        if (url === 'index') url = '/';
        else url = `/${url.replace(/index$/, '')}`;
        const lastmod = fs.statSync(fileObj.fullPath).mtime.toISOString().split('T')[0];
        return { url, lastmod };
      });

      const xml = [
        '<?xml version="1.0" encoding="utf-8" standalone="yes" ?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
      ];

      for (const link of links) {
        xml.push('  <url>');
        xml.push(`    <loc>${baseUrl}${link.url}</loc>`);
        xml.push(`    <lastmod>${link.lastmod}</lastmod>`);
        xml.push('    <changefreq>monthly</changefreq>');
        xml.push('  </url>');
      }

      xml.push('</urlset>');

      const dir = path.dirname(output);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(output, xml.join('\n'), 'utf8');
      console.log(`✅ Готово: карта сайта создана (${links.length} страниц)`);
    });
  }
}

module.exports = SitemapGenerator;
