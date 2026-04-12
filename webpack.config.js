
require("./postcss.config");
require("dotenv").config({
  quiet: true
});

const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const RobotstxtPlugin = require("robotstxt-webpack-plugin");
const pager = require("./pager");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const SitemapGenerator = require('./plugins/production/sitemap');
const ManifestGenerator = require('./plugins/production/manifest');
const AliasesGenerator = require('./plugins/optimization/aliases');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const RelativeAssetsPlugin = require('./plugins/production/relative-paths');
const CSSPurgePlugin = require("./plugins/optimization/css-purge");

module.exports = (env = {}) => {
  const MODE = env.mode || "production";
  const SRC_DIR = path.resolve(__dirname, 'src');
  const BUILD_DIR = path.resolve(__dirname, 'build');
  const VIEWS_DIR = path.resolve(SRC_DIR, 'views');
  const ASSETS_DIR = path.resolve(SRC_DIR, 'assets');
  const FONTS_DIR = path.resolve(ASSETS_DIR, 'fonts');
  const IMAGES_DIR = path.resolve(ASSETS_DIR, 'images');
  const STYLES_DIR = path.resolve(ASSETS_DIR, 'styles');
  const BASE_URL = process.env.BASE_URL || (pager.isDevMode(MODE) ? 'http://localhost:8080' : 'https://yourwebsite.ru');
  const HOST = process.env.HOST || (pager.isDevMode(MODE) ? 'http://localhost:8080' : 'https://yourwebsite.ru');
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;
  return {
    mode: MODE,
    stats: 'errors-warnings',
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    target: "web",
    devtool: pager.isDevMode(MODE) ? "eval-source-map" : 'source-map',
    context: SRC_DIR,
    entry: {
      bundle: path.join(SRC_DIR, "bundle.js"),
    },
    output: {
      publicPath: pager.isDevMode(MODE) ? `http://localhost:${PORT}/` : '/',
      path: BUILD_DIR,
      filename: "assets/js/[name].[contenthash].js",
      chunkFilename: "assets/js/[name].[contenthash].js",
      hashDigestLength: 6,
      clean: true,
    },
    devServer: {
      static: SRC_DIR,
      compress: true,
      liveReload: false,
      hot: true,
      port: PORT,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      },
      client: {
        logging: 'error'
      },
    },
    cache: pager.isDevMode(MODE) ? { type: 'filesystem', buildDependencies: { config: [__filename] } } : false,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 200,
      poll: false,
    },
    resolve: {
      alias: {
        ...AliasesGenerator(),
        '@p-layouts': path.resolve(VIEWS_DIR, 'layouts'),
        './@p-layouts': path.resolve(VIEWS_DIR, 'layouts'),
        '@p-components': path.resolve(VIEWS_DIR, 'components'),
        './@p-components': path.resolve(VIEWS_DIR, 'components'),
        '@p-custom-components': path.resolve(VIEWS_DIR, 'custom-components'),
        './@p-custom-components': path.resolve(VIEWS_DIR, 'custom-components'),
        '@p-mixins': path.resolve(VIEWS_DIR, 'mixins'),
        './@p-mixins': path.resolve(VIEWS_DIR, 'mixins'),
      },
      extensions: ['.js', '.pug', '.scss'],
      modules: [
        'node_modules',
        SRC_DIR,
        VIEWS_DIR,
      ]
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: "babel-loader",
              options: { presets: ["@babel/preset-env"] },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            pager.isDevMode(MODE) ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                sourceMap: pager.isDevMode(MODE),
              },
            },
            "postcss-loader",
          ],
        },
        {
          test: /\.scss$/,
          use: [
            pager.isDevMode(MODE) ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { sourceMap: pager.isDevMode(MODE) },
            },
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                api: "modern",
                sourceMap: true,
                implementation: require("sass"),
                sassOptions: {
                  includePaths: [
                    STYLES_DIR,
                  ],
                  importers: [
                    {
                      findFileUrl(url) {
                        const aliasMap = {
                          "@s-base": path.resolve(STYLES_DIR, "base"),
                          "@s-components": path.resolve(STYLES_DIR, "components"),
                          "@s-custom-components": path.resolve(STYLES_DIR, "custom-components"),
                          "@s-mixins": path.resolve(STYLES_DIR, "mixins"),
                          "@s-utils": path.resolve(STYLES_DIR, "utils"),
                          "@fonts": FONTS_DIR,
                          "@images": IMAGES_DIR,
                        };
                        for (const [alias, aliasPath] of Object.entries(aliasMap)) {
                          if (url.startsWith(alias)) {
                            const fullPath = path.resolve(
                              aliasPath,
                              url.replace(alias, "").replace(/^\/+/, "")
                            );
                            const extensions = [".scss", ".sass", ".css"];
                            for (const ext of extensions) {
                              const filePath = `${fullPath}${ext}`;
                              if (require("fs").existsSync(filePath)) {
                                return new URL(`file://${filePath}`);
                              }
                            }
                          }
                        }
                        return null;
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          use: [
            pager.isDevMode(MODE)
            ? {
              loader: '@webdiscus/pug-loader',
              options: {
                method: 'render',
                root: VIEWS_DIR,
                basedir: VIEWS_DIR,
                resolve: {
                  alias: {
                    '@p-layouts': path.resolve(VIEWS_DIR, 'layouts'),
                    './@p-layouts': path.resolve(VIEWS_DIR, 'layouts'),
                  }
                }
              }
            } : {
              loader: "pug-loader",
              options: {
                root: VIEWS_DIR,
                basedir: VIEWS_DIR,
              }
            },
          ],
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: "asset/resource",
          generator: {
            filename: "assets/videos/[name][ext]",
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name][ext]",
          },
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: 'assets/images/[name][ext]'
          }
        },
      ],
    },
    experiments: {
      topLevelAwait: true,
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: { compress: { drop_console: true } },
          extractComments: false,
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                map: true,
              },
            ],
          },
        }),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['mozjpeg', { quality: 75 }],
                ['pngquant', { quality: [0.6, 0.8] }],
                ['gifsicle'],
                ['svgo'],
              ],
            },
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          default: false,
          defaultVendors: false,

          vendors: {
            test: /node_modules/,
            name: "vendors",
            chunks: "all",
            enforce: true,
          },

          styles: {
            name: "bundle",
            type: "css/mini-extract",
            test: (module) => {
              return (
                module.type === "css/mini-extract" &&
                !/node_modules/.test(module.identifier())
              );
            },
            chunks: "all",
            enforce: true,
          },
        },
      },
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.BASE_URL': JSON.stringify(BASE_URL),
        'process.env.HOST': JSON.stringify(HOST),
        'process.env.PORT': JSON.stringify(PORT),
      }),

      new RobotstxtPlugin({
        filePath: './robots.txt',
        policy: [
          {
            userAgent: '*',
            allow: '/',
          },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: HOST,
      }),

      new SitemapGenerator({
        baseUrl: BASE_URL,
        viewsDir: VIEWS_DIR,
        output: path.resolve(BUILD_DIR, 'sitemap.xml'),
      }),

      new ManifestGenerator(),

      new RelativeAssetsPlugin({
        baseDir: BUILD_DIR,
        targetDir: '/assets'
      }),

      new FriendlyErrorsWebpackPlugin({
        clearConsole: true,
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: "../.htaccess" },
          { from: "assets/images", to: "assets/images" },
          { from: "assets/fonts", to: "assets/fonts" },
        ],
      }),

      ...(pager.isDevMode(MODE) ? [] : [
        new MiniCssExtractPlugin({
          filename: "assets/css/[name].[contenthash].css",
          chunkFilename: "assets/css/[name].[contenthash].css",
        })
      ]),

      new HtmlWebpackPlugin({
        minify: false,
        filename: "index.html",
        template: "views/index.pug",
        inject: "body",
        templateParameters: {
          manifestPath: "/manifest.json"
        }
      }),

      ...pager.pages(MODE),
      ...pager.pages(MODE, "blog"),

      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.$": "jquery",
        "window.jQuery": "jquery",
      }),

      ...(pager.isDevMode(MODE) ? [] : [new CSSPurgePlugin(__dirname)]),

      new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 8080,
          proxy: `http://localhost:${PORT}/`,
          files: [
            {
              match: [
                './src/views/**/*.pug',
                './src/assets/**/*.js',
                './src/assets/images/**/*.{webp,jpg,jpeg,png,gif,svg}'
              ],
              options: {
                ignored: ['**/*.preview.*', '**/._*']
              }
            }
          ],
          open: false,
          notify: false
        },
        {
          reload: false,
        }
      ),
    ],
  };
};