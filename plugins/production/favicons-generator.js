const path = require("path");
const fs = require("fs");
const faviconsLib = require("favicons");
const favicons = faviconsLib.default || faviconsLib;

async function generate() {
  const sourceIcon = path.resolve(__dirname, "../../src/assets/images/favicons/favicon.svg");
  const outputDir = path.resolve(__dirname, "../../src/assets/images/favicons");
  const pugPath = path.resolve(__dirname, "../../src/views/custom-components/favicons.pug");

  if (!fs.existsSync(sourceIcon)) {
    console.error("❌ Ошибка! Файл фавиконки не найден:", sourceIcon);
    return;
  }

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  if (!fs.existsSync(path.dirname(pugPath))) fs.mkdirSync(path.dirname(pugPath), { recursive: true });

  const config = {
    path: "/assets/images/favicons/",
    appName: "Rise",
    appShortName: "Rise",
    appDescription: "Rise",
    developerName: "",
    background: "#ffffff",
    theme_color: "#ffffff",
    start_url: "/",
    display: "standalone",
    sharp: false,
    icons: {
      favicons: true,
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      yandex: true,
      windows: true,
    },
  };

  const response = await favicons(sourceIcon, config);

  for (const file of response.files) {
    fs.writeFileSync(path.join(outputDir, file.name), file.contents);
  }
  for (const img of response.images) {
    fs.writeFileSync(path.join(outputDir, img.name), img.contents);
  }

  fs.writeFileSync(
    pugPath,
    response.html.map(tag => tag.replace(/</g, "<")).join("\n")
  );

  console.log(`✅ Фавиконки сгенерированы`);
}

generate();