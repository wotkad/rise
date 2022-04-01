const SitemapGenerator = require('sitemap-generator');
const generator = SitemapGenerator('http://localhost:8080', {
  stripQuerystring: false,
  filepath: './dist/sitemap.xml',
  lastMod: new Date().toISOString(),
  changeFreq: 'monthly',
});
generator.start();