module.exports = {
  filePath: './robots.txt',
  policy: [
    {
      userAgent: "*",
      allow: "/",
    },
  ],
  sitemap: "http://localhost:8080/sitemap.xml",
  host: "http://localhost:8080/"
};