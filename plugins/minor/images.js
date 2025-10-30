const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const chokidar = require('chokidar');
const browserSync = require('browser-sync').create();

const IMAGES_SRC = path.resolve(__dirname, '../../src/assets/images');
const MAX_WIDTH = 1920;
const PREVIEW_WIDTH = 400;

// BrowserSync
browserSync.init({
  proxy: 'http://localhost:8081/', // devServer port
  open: false,
  notify: false,
  files: [], // оставляем пустым, будем триггерить вручную
});

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    const buffer = await image.resize({ width: Math.min(metadata.width, MAX_WIDTH) }).toBuffer();

    // WebP
    await sharp(buffer).webp({ quality: 80 }).toFile(path.join(dir, baseName + '.webp'));

    // Preview
    await sharp(buffer)
      .resize({ width: PREVIEW_WIDTH })
      .webp({ quality: 60 })
      .toFile(path.join(dir, baseName + '_preview.webp'));

    // Удаляем оригинал
    fs.unlinkSync(filePath);

    console.log(`[Watcher] Optimized: ${baseName}`);

    // Перезагрузка через BrowserSync
    browserSync.reload(); // reload проксируемых страниц
  } catch (err) {
    console.error('[Watcher] Ошибка обработки изображения:', filePath, err);
  }
}

// Watcher
chokidar.watch(IMAGES_SRC, { ignoreInitial: true })
  .on('add', file => setTimeout(() => optimizeImage(file), 100))   // небольшая задержка
  .on('change', file => setTimeout(() => optimizeImage(file), 100));

console.log('[Watcher] Watching images in', IMAGES_SRC);
