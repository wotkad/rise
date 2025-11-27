const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const chokidar = require('chokidar');

const IMAGES_SRC = path.resolve(__dirname, '../../src/assets/images');
const CONSTRUCTOR_SRC = path.resolve(__dirname, '../../plugins/constructor');
const MAX_WIDTH = 1920;
const PREVIEW_WIDTH = 400;

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    const buffer = await image.resize({ width: Math.min(metadata.width, MAX_WIDTH) }).toBuffer();

    await sharp(buffer).webp({ quality: 80 }).toFile(path.join(dir, baseName + '.webp'));

    await sharp(buffer)
      .resize({ width: PREVIEW_WIDTH })
      .webp({ quality: 60 })
      .toFile(path.join(dir, baseName + '_preview.webp'));

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('[Watcher] Ошибка обработки изображения:', filePath, err);
  }
}
chokidar
  .watch([IMAGES_SRC, CONSTRUCTOR_SRC], {
    ignoreInitial: true,
    ignored: /\/src\/assets\/images\/favicons\//,
  })
  .on('add', file => setTimeout(() => optimizeImage(file), 100))
  .on('change', file => setTimeout(() => optimizeImage(file), 100));