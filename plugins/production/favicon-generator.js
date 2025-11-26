const path = require("path");
const fs = require("fs");
const faviconsLib = require("favicons");
const favicons = faviconsLib.default || faviconsLib;

class FaviconGenerator {
  constructor(options) {
    this.options = options || {};
    if (!this.options.root) throw new Error("FaviconGenerator: root option is required");
    this.generated = false;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      "FaviconGenerator",
      async (compilation, callback) => {
        if (this.generated) return callback();
        this.generated = true;

        try {
          const mode = compiler.options.mode || "production";
          const sourceIcon = this.options.source;

          if (!fs.existsSync(sourceIcon)) {
            console.error("❌ Favicon source file not found:", sourceIcon);
            return callback();
          }

          const outputDir = path.join(this.options.root, "src/assets/images/favicons");

          if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

          const config = {
            path: "/" + (this.options.output || "assets/images/favicons") + "/",
            appName: this.options.appName || "Rise",
            appShortName: this.options.appShortName || "Rise",
            appDescription: this.options.appDescription || "",
            developerName: this.options.developerName || "",
            background: "#ffffff",
            theme_color: "#ffffff",
            start_url: "/",
            display: "standalone",
            sharp: false,
            icons: {
              favicons: true,
              android: true,
              appleIcon: true,
              appleStartup: false,
              coast: false,
              yandex: true,
              windows: true,
            },
          };

          const response = await favicons(sourceIcon, config);

          for (const file of response.files) {
            fs.writeFileSync(path.join(outputDir, file.name), file.contents);
          }
          for (const img of response.images) {
            fs.writeFileSync(path.join(outputDir, img.name), img.contents);
          }

          const htmlPath = path.join(this.options.root, "src/views/custom-components/favicons.pug")

          fs.writeFileSync(
            htmlPath,
            response.html.map(tag => tag.replace(/</g, "<")).join("\n")
          );

          console.log(`\n✅ Фавиконки сгенерированы в (/assets/images/favicons/)`);

        } catch (err) {
          console.error("\n❌ Favicon generation error:", err);
        }

        callback();
      }
    );
  }
}

module.exports = FaviconGenerator;