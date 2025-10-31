const path = require("path");
const fs = require("fs");
const globAll = require("glob-all");
const { PurgeCSS } = require("purgecss");

class CSSPurgeWrapperPlugin {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise("CSSPurgeWrapperPlugin", async () => {
      const BUILD_DIR = path.join(this.rootDir, "build");
      const SRC_DIR = path.join(this.rootDir, "src");
      const cssPath = path.join(BUILD_DIR, "assets/css/bundle.css");

      if (!fs.existsSync(cssPath)) {
        return;
      }

      const purgeTargets = globAll.sync([
        path.join(BUILD_DIR, "**/*.html"),
        path.join(SRC_DIR, "**/*.js"),
      ]);

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
      const beforeSize = fs.statSync(cssPath).size;
      fs.writeFileSync(cssPath, result.css);
      const afterSize = fs.statSync(cssPath).size;

      if (removed.length > 0) {
        setTimeout(function() {
          console.log(
            `\n✅ Готово: bundle.css оптимизирован (${(beforeSize / 1024).toFixed(
              1
            )} KB → ${(afterSize / 1024).toFixed(1)} KB)`
          );
        }, 100);
      }
      
    });
  }
}

module.exports = function CSSPurgePlugin(rootDir) {
  return new CSSPurgeWrapperPlugin(rootDir);
};
