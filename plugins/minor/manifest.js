const { RawSource } = require('webpack').sources;

class GenerateManifestPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('GenerateManifestPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'GenerateManifestPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const icons = [36, 48, 72, 96, 144, 192, 256, 384, 512].map(size => ({
            src: `/assets/images/favicons/android-chrome-${size}x${size}.png`,
            sizes: `${size}x${size}`,
            type: 'image/png',
          }));

          const manifest = {
            name: 'Rise',
            short_name: 'Rise',
            icons,
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
          };

          const json = JSON.stringify(manifest, null, 2);

          // Новый API Webpack для добавления ассета
          compilation.emitAsset('manifest.json', new RawSource(json));
        }
      );
    });
  }
}

module.exports = GenerateManifestPlugin;
