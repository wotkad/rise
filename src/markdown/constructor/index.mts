import fs from "fs-extra";
import html2pug from "html2pug";
import meta from "markdown-it-meta";
import MarkdownIt from "markdown-it";

const markdown: any = MarkdownIt({
  html: true,
  breaks: true,
  typographer: true,
});

(async function () {
  const docsPath = "./src/markdown/docs/";
  const compiledPath = "./src/views/pages/blog/";
  fs.mkdir(compiledPath);
  fs.readdir(docsPath, (err: any, files: any) => {
    files.forEach((file: any) => {
      let content = fs.readFileSync(docsPath + file, "utf8");
      markdown.use(meta)
      let renderedHtml = markdown.render(content);
      let renderedPug = html2pug(renderedHtml, { fragment: true });
      let renderedFile =
        `extends ../../layouts/master.pug

block basicSeo
  meta(content="${markdown.meta.description ? markdown.meta.description : "Это страница записи"}" name="description")
  meta(content="${markdown.meta.keywords ? markdown.meta.keywords : "Страница, запись"}" name="keywords")

block title
  title ${markdown.meta.title ? markdown.meta.title : "Страница без названия"}

block content
  main
    .barba(data-barba="wrapper")
      .barba-container(data-barba="container" data-barba-namespace="${markdown.meta.namespace}")
        sections
          section.content
            .wrapper`
            + '\n' + renderedPug.split('\n').map((x: any) => '              ' + x).join('\n') + '\n' 
            + '    ' + 'include ../../components/footer.pug';
      let newFileName = file.replace('.md', '.pug');
      fs.writeFileSync(compiledPath + newFileName, renderedFile, "utf8");
      return {
        document: renderedHtml,
        meta: markdown.meta
      }
    });
  });
})();
export {}
