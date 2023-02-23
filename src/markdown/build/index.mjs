import fs from "fs-extra";
import html2pug from "html2pug";
import meta from "markdown-it-meta";
import MarkdownIt from "markdown-it";
const markdown = MarkdownIt({
  html: true,
  breaks: true,
  typographer: true
});
(async function () {
  const docsPath = "./src/markdown/docs/";
  const compiledPath = "./src/views/pages/blog/";
  fs.mkdir(compiledPath);
  fs.readdir(docsPath, (err, files) => {
    files.forEach(file => {
      let content = fs.readFileSync(docsPath + file, "utf8");
      markdown.use(meta, function (md) {
        md.renderer.rules.image = function (tokens, idx, options, env, self) {
          // Get the current token
          const token = tokens[idx];

          // Get the index of the `alt` attribute
          const altIndex = token.attrIndex('alt');

          // If `alt` exists and is not first, move it to the front
          if (altIndex !== -1 && altIndex !== 0) {
            const altAttr = token.attrs.splice(altIndex, 1)[0];
            token.attrs.unshift(altAttr);
          }

          // Rebuild the image HTML with the updated attributes
          const attrs = token.attrs.map(attr => `${attr[0]}="${attr[1]}"`).join(' ');
          return `<img ${attrs}>`;
        };
      });
      let renderedHtml = markdown.render(content);
      let renderedPug = html2pug(renderedHtml, {
        doubleQuotes: true,
        fragment: true
      });
      let renderedFile = `extends ../../layouts/master.pug

block basicSeo
  meta(content="${markdown.meta.description ? markdown.meta.description : "Это страница записи"}" name="description")
  meta(content="${markdown.meta.keywords ? markdown.meta.keywords : "Страница, запись"}" name="keywords")

block manifestBrowserconfigFiles
  link(href="../../manifest.json" rel="manifest")
  meta(content="../../browserconfig.xml" name="msapplication-config")

block title
  title ${markdown.meta.title ? markdown.meta.title : "Страница без названия"}

block content
  main
    .barba(data-barba="wrapper")
      .barba-container(data-barba="container" data-barba-namespace="${markdown.meta.namespace}")
        .page-container
          .page-wrapper
            section.content
              .wrapper` + '\n' + renderedPug.split('\n').map(x => '                ' + x).join('\n') + '\n' + '          ' + 'include ../../components/footer.pug';
      let newFileName = file.replace('.md', '.pug');
      fs.writeFileSync(compiledPath + newFileName, renderedFile, "utf8");
      return {
        document: renderedHtml,
        meta: markdown.meta
      };
    });
  });
})();
export {};