const { RawSource } = require("webpack").sources;
const path = require("path");
const fs = require("fs");

class ManifestGenerator {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      "GenerateManifestPlugin",
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: "GenerateManifestPlugin",
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          () => {
            const buildPath = compiler.options.output.path;
            const faviconsDir = path.join(buildPath, "assets/images/favicons");

            let icons = [];

            if (fs.existsSync(faviconsDir)) {
              const files = fs.readdirSync(faviconsDir);

              icons = files
                .filter((file) => file.endsWith(".png"))
                .map((file) => {
                  const match = file.match(/(\d+)x(\d+)/);
                  const size = match ? match[0] : null;

                  return size
                    ? {
                        src: `/assets/images/favicons/${file}`,
                        sizes: size,
                        type: "image/png",
                        purpose: file.includes("maskable")
                          ? "maskable"
                          : "any",
                      }
                    : null;
                })
                .filter(Boolean);
            }

            const manifest = {
              name: "Rise",
              short_name: "Rise",
              theme_color: "#ffffff",
              background_color: "#ffffff",
              display: "standalone",
              start_url: "/",
              icons,
            };

            const json = JSON.stringify(manifest, null, 2);

            compilation.emitAsset(
              "manifest.json",
              new RawSource(json)
            );
          }
        );
      }
    );
  }
}

module.exports = ManifestGenerator;