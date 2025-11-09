/**
 * CSS Purge Plugin for production build
 * Удаляет неиспользуемые стили и создаёт HTML-отчёт
 */

const path = require("path");
const fs = require("fs");
const globAll = require("glob-all");
const { PurgeCSS } = require("purgecss");

const REPORT_DIR = path.resolve(__dirname, "../../reports/css-purge");
const REPORT_FILE = path.join(REPORT_DIR, "report.html");

class CSSPurgePlugin {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise("CSSPurgePlugin", async () => {
      const BUILD_DIR = path.join(this.rootDir, "build");
      const SRC_DIR = path.join(this.rootDir, "src");
      const cssPath = path.join(BUILD_DIR, "assets/css/bundle.css");

      if (!fs.existsSync(cssPath)) {
        console.warn("[PurgeCSS] bundle.css не найден, пропуск");
        return;
      }

      console.log('\n🚀 Cоздания отчёта о CSS...');

      const purgeTargets = globAll.sync([
        path.join(BUILD_DIR, "**/*.html"),
        path.join(SRC_DIR, "**/*.js"),
      ]);

      const beforeSize = fs.statSync(cssPath).size;

      const purgeCSSResult = await new PurgeCSS().purge({
        content: purgeTargets,
        css: [cssPath],
        safelist: {
          standard: [
            /^is-/,
            /^js-/,
            /^swiper-/,
            /^modal-/,
            /^active$/,
            /^open$/,
            /^show$/,
            /^hidden$/,
            /^fade/,
            /^animate/,
            /^lock$/,
            /^no-scroll$/,
          ],
          deep: [/data-/, /aria-/],
        },
        rejected: true,
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      });

      const result = purgeCSSResult[0];
      const removed = result.rejected || [];
      fs.writeFileSync(cssPath, result.css);
      const afterSize = fs.statSync(cssPath).size;

      let reportHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Отчёт PurgeCSS</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-900 p-8">
  <h1 class="text-3xl font-bold mb-6">Отчёт PurgeCSS</h1>
  <p class="mb-4"><span class="font-mono font-semibold">CSS оптимизирован (${(beforeSize / 1024).toFixed(
    1
  )} KB → ${(afterSize / 1024).toFixed(1)} KB)</p>
  <p class="mb-4"><span class="font-mono font-semibold">Удалено ${removed.length} селекторов</p>
`;

      if (removed.length === 0) {
        reportHtml += `<p class="text-green-600 font-medium">✅ Не удалено ни одного селектора</p>`;
      } else {
        reportHtml += `
<div class="overflow-x-auto rounded-lg border border-gray-300 mt-3">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">№</th>
        <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Селектор</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
`;

        removed.forEach((sel, idx) => {
          reportHtml += `
<tr class="hover:bg-gray-50">
  <td class="px-4 py-2 text-gray-700">${idx + 1}</td>
  <td class="px-4 py-2 font-mono text-gray-800">${sel}</td>
</tr>`;
        });

        reportHtml += `
    </tbody>
  </table>
</div>
`;
      }

      reportHtml += `
  <footer class="mt-10 text-center text-sm text-gray-500">
    Сгенерировано автоматически ${new Date().toLocaleString("ru-RU")}
  </footer>
</body>
</html>
`;

      fs.mkdirSync(REPORT_DIR, { recursive: true });
      fs.writeFileSync(REPORT_FILE, reportHtml);

      if (removed.length > 0) {
        console.log(
          `✅ Готово: отчёт о CSS добавлен в (/reports/css-purge), bundle.css оптимизирован (${(beforeSize / 1024).toFixed(
            1
          )} KB → ${(afterSize / 1024).toFixed(1)} KB)`
        );
      }
    });
  }
}

module.exports = CSSPurgePlugin;