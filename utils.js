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
  const path = require("path");
  const viewsFolder = path.join(
    __dirname,
    `./src/views/${rootPagesFolderName}/${folder}`
  );

  let pages = [];

  fs.readdirSync(viewsFolder).forEach((view) => {
    if (view.split(".")[1] === undefined) return false;
    if (view.startsWith('.')) return false;

    const viewName = view.split(".")[0];
    const fileName =
      folder === ""
        ? `${viewName}/index.html`
        : `${folder}/${viewName}/index.html`;
    const layoutName = 
      folder === ""
        ? `${view}`
        : `${folder}/${view}`
    const options = {
      minify: false,
      filename: fileName,
      template: `views/${rootPagesFolderName}/${layoutName}`,
      inject: true,
    };

    pages.push(new HtmlWebpackPlugin(options));
  });

  return pages;
};
