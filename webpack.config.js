require("./postcss.config");

const path = require("path");
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


const SitemapGenerator = require('sitemap-generator');
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
    devtool: "eval-source-map",
    context: path.join(__dirname, "./src"),
    entry: {
      bundle: path.join(__dirname, "./src/bundle.js"),
    },
    output: {
      publicPath: '/',
      path: path.join(__dirname, "./build"),
      filename: "assets/js/[name].[contenthash:7].bundle.js",
    },
    devServer: {
      static: path.join(__dirname, "/"),
      compress: true,
      liveReload: false,
      hot: true,
      port: 8081,
      client: {
        logging: 'error'
      },
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
            "sass-loader",
          ],
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader",
              options: {
                pretty: true
              }
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name].[contenthash:7][ext]",
          },
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
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            filename: "assets/js/vendor.[chunkhash:7].bundle.js",
            chunks: "all",
            test: /node_modules/,
          },
        },
      },
    },

    plugins: [
      new RobotstxtPlugin(),
      new FriendlyErrorsWebpackPlugin({
        clearConsole: true,
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "../manifest.json", to: "manifest.json" },
          { from: "../browserconfig.xml", to: "browserconfig.xml" },
          { from: "sitemap.xml", to: "sitemap.xml" },
          { from: "assets/images", to: "assets/images" },
          { from: "assets/fonts", to: "assets/fonts" },
          // { from: "assets/files", to: "assets/files" },
          // { from: "assets/videos", to: "assets/videos" },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].[chunkhash:7].bundle.css",
        chunkFilename: "[id].css",
      }),

      new HtmlWebpackPlugin({
        minify: false,
        filename: "index.html",
        template: "views/index.pug",
        inject: "body",
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