require("./postcss.config");

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
const RelativeAssetsPlugin = require('./plugins/production/relative-paths');
const CSSPurgePlugin = require("./plugins/optimization/css-purge");

module.exports = (env) => {
  const MODE = env.mode || "production";
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
    context: path.join(__dirname, "./src"),
    entry: {
      bundle: path.join(__dirname, "./src/bundle.js"),
    },
    output: {
      publicPath: '/',
      path: path.join(__dirname, "./build"),
      filename: "assets/js/[name].[contenthash].js",
      clean: true,
    },
    devServer: {
      static: path.join(__dirname, "/src"),
      compress: true,
      liveReload: false,
      hot: true,
      port: 8081,
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
        '@p-layouts': path.resolve(__dirname, 'src/views/layouts'),
        './@p-layouts': path.resolve(__dirname, 'src/views/layouts'),
        '@p-components': path.resolve(__dirname, 'src/views/components'),
        './@p-components': path.resolve(__dirname, 'src/views/components'),
        '@p-custom-components': path.resolve(__dirname, 'src/views/custom-components'),
        './@p-custom-components': path.resolve(__dirname, 'src/views/custom-components'),
        '@p-mixins': path.resolve(__dirname, 'src/views/mixins'),
        './@p-mixins': path.resolve(__dirname, 'src/views/mixins'),
      },
      extensions: ['.js', '.pug', '.scss'],
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'src/views'),
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
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                sourceMap: true,
              },
            },
            "postcss-loader",
          ],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: { importLoaders: 1, sourceMap: true },
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
                    path.resolve(__dirname, "src/assets/styles"),
                  ],
                  importers: [
                    {
                      findFileUrl(url) {
                        const aliasMap = {
                          "@s-base": path.resolve(__dirname, "src/assets/styles/base"),
                          "@s-components": path.resolve(__dirname, "src/assets/styles/components"),
                          "@s-custom-components": path.resolve(__dirname, "src/assets/styles/custom-components"),
                          "@s-mixins": path.resolve(__dirname, "src/assets/styles/mixins"),
                          "@s-utils": path.resolve(__dirname, "src/assets/styles/utils"),
                          "@fonts": path.resolve(__dirname, "src/assets/fonts"),
                          "@images": path.resolve(__dirname, "src/assets/images"),
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
                root: path.resolve(__dirname, 'src/views'),
                basedir: path.resolve(__dirname, 'src/views'),
                resolve: {
                  alias: {
                    '@p-layouts': path.resolve(__dirname, 'src/views/layouts'),
                    './@p-layouts': path.resolve(__dirname, 'src/views/layouts'),
                  }
                }
              }
            } : {
              loader: "pug-loader",
              options: {
                root: path.resolve(__dirname, 'src/views'),
                basedir: path.resolve(__dirname, 'src/views'),
                pretty: true
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
        })
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            filename: "assets/js/vendor.[contenthash].js",
            test: /node_modules/,
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: { name: "runtime" },
      usedExports: true,
    },

    plugins: [
      new RobotstxtPlugin(),

      new SitemapGenerator({
        baseUrl: pager.isDevMode(MODE)
          ? 'http://localhost:8080'
          : 'https://yourwebsite.ru',
        viewsDir: path.resolve(__dirname, 'src/views'),
        output: path.resolve(__dirname, 'build/sitemap.xml'),
      }),

      new ManifestGenerator(),

      new RelativeAssetsPlugin({
        baseDir: path.resolve(__dirname, 'build'),
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

      new MiniCssExtractPlugin({
        filename: "assets/css/[name].[contenthash].css",
        chunkFilename: "assets/css/[id].[contenthash].css",
      }),

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
          proxy: 'http://localhost:8081/',
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