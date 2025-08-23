export const imageCache = new Set();

export function addToImageCache(src) {
  imageCache.add(src);
}

export function isImageCached(src) {
  return imageCache.has(src);
}