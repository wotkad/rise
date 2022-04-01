function isDevMode(mode) {
  return mode === "development";
}
exports.isDevMode = isDevMode;
exports.getMode = function (env) {
  env = env || {};
  return env.mode || "production";
};
exports.pages = function (mode, folder = "") {
  const rootPagesFolderName = "pages";
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const fs = require("fs");
  const SitemapGenerator = require('sitemap-generator');
  const path = require("path");
  const viewsFolder = path.join(
    __dirname,
    `./src/views/${rootPagesFolderName}/${folder}`
  );

  var pages = [];

  const generator = SitemapGenerator('http://localhost:8080', {
    stripQuerystring: false,
    filepath: './src/sitemap.xml',
    lastMod: new Date().toISOString(),
    changeFreq: 'monthly',
  });
  generator.start();

  fs.readdirSync(viewsFolder).forEach((view) => {
    if (view.split(".")[1] === undefined) return false;

    const viewName = view.split(".")[0];
    const fileName =
      folder === ""
        ? `${viewName}/index.html`
        : `${folder}/${viewName}/index.html`;
    const options = {
      minify: !isDevMode(mode),
      filename: fileName,
      template: `views/${rootPagesFolderName}/${folder}/${view}`,
      inject: true,
    };

    if (isDevMode(mode)) {
      options.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      };
    }

    pages.push(new HtmlWebpackPlugin(options));
  });

  return pages;
};
