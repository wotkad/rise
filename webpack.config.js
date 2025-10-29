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
const utils = require("./utils");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const GenerateManifestPlugin = require('./plugins/minor/manifest');
const SitemapGenerator = require('sitemap-generator');
const generateAliases = require('./plugins/minor/aliases');

const generator = SitemapGenerator('http://localhost:8080', {
  stripQuerystring: false,
  filepath: './src/sitemap.xml',
  lastMod: new Date().toISOString(),
  changeFreq: 'monthly',
});
generator.start();

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
    devtool: utils.isDevMode(MODE) ? "eval-source-map" : 'source-map',
    context: path.join(__dirname, "./src"),
    entry: {
      bundle: path.join(__dirname, "./src/bundle.js"),
    },
    output: {
      publicPath: '/',
      path: path.join(__dirname, "./build"),
      filename: "assets/js/bundle.js",
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
    resolve: {
      alias: generateAliases(),
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
            utils.isDevMode(MODE)
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            utils.isDevMode(MODE)
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
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

                            // Поддержка .scss и .css
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
            utils.isDevMode(MODE)
            ? {
              loader: "@webdiscus/pug-loader"
            } : {
              loader: "pug-loader",
              options: {
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
          test: /\.(jpe?g|png|gif|svg|ico)$/i,
          type: "asset/resource",
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
        }),
        new CssMinimizerPlugin(),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: [
                ["gifsicle", { interlaced: true }],
                ["imagemin-mozjpeg", { progressive: true }],
                ["imagemin-pngquant", { optimizationLevel: 5 }],
                [
                  "svgo",
                  {
                    plugins: [
                      {
                        name: "preset-default",
                        params: {
                          overrides: {
                            removeViewBox: false,
                            addAttributesToSVGElement: {
                              params: {
                                attributes: [
                                  { xmlns: "http://www.w3.org/2000/svg" },
                                ],
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            filename: "assets/js/vendor.js",
            chunks: "all",
            test: /node_modules/,
          },
        },
      },
    },

    plugins: [
      new RobotstxtPlugin(),

      new GenerateManifestPlugin(),

      new FriendlyErrorsWebpackPlugin({
        clearConsole: true,
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: "../.htaccess" },
          { from: "sitemap.xml" },
          { from: "assets/images", to: "assets/images" },
          { from: "assets/fonts", to: "assets/fonts" },
          // { from: "assets/files", to: "assets/files" }
          // { from: "assets/videos", to: "assets/videos" },
        ],
      }),

      new MiniCssExtractPlugin({
        filename: "assets/css/bundle.css",
        chunkFilename: "[id].css",
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

      ...utils.pages(MODE),
      ...utils.pages(MODE, "blog"),

      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.$": "jquery",
        "window.jQuery": "jquery",
      }),

      new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 8080,
          proxy: 'http://localhost:8081/',
          files: ['./src/views/**/*.pug', './src/assets/**/*.js'],
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