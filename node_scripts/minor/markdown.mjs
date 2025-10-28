import fs from "fs-extra";
import meta from "markdown-it-meta";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
const markdown = MarkdownIt({
  html: true,
  breaks: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre>' + '  ' + '<code class="hljs">' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code>'
        );
      } catch (__) { }
    }
  },
});
(async function () {
  const docsPath = "./src/markdown/";
  const compiledPath = "./src/views/pages/blog/";
  fs.mkdir(compiledPath);
  fs.readdir(docsPath, (err, files) => {
    files.forEach(file => {
      let content = fs.readFileSync(docsPath + file, "utf8");
      markdown.use(meta);
      let renderedHtml = markdown.render(content);
      const formattedHtml = renderedHtml
        .split('\n')
        .map(x => '                ' + x)
        .join('\n')
        .trimEnd();
      let renderedFile = `extends @p-layouts/master.pug

block title
  title ${markdown.meta.title ? markdown.meta.title : "Страница без названия"}

block basicSeo
  meta(content="${markdown.meta.description ? markdown.meta.description : "Это страница записи"}" name="description")
  meta(content="${markdown.meta.keywords ? markdown.meta.keywords : "Страница, запись"}" name="keywords")

block manifest
  link(href="../../manifest.json" rel="manifest")

block content
  main
    .barba(data-barba="wrapper")
      .barba-container(data-barba="container" data-barba-namespace="${markdown.meta.namespace}")
        .page-container
          .page-wrapper
            section.content
              .wrapper` + '\n' + formattedHtml + `
          include @p-components/footer.pug`;
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