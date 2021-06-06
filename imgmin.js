import glob from 'glob';
import colors from 'colors';
import path from 'path';
import sharp from 'sharp';

const start = Date.now();
glob('dist/**/*.+(jpg|png)', (e, images) => {
  Promise.all(images.map(img => processImage(img)))
    .then(() => {
      log(`done in ${Math.floor((Date.now()-start) / 1000)}s`);
    });
});

function processImage(src) {
  const outWebp = src.replace(path.extname(src), '.webp');
  const outAvif = src.replace(path.extname(src), '.avif');

  let inputStream = sharp(src);

  if (path.dirname(src) !== 'dist/en' && path.dirname(src) !== 'dist/de') {
    inputStream = inputStream.resize(750);
  }

  const webpPromise = inputStream.clone()
    .toFormat('webp', { reductionEffort: 6 })
    .toFile(outWebp)
    .catch(err => error(err))

  const avifPromise = inputStream.clone()
    .toFormat('avif', { speed: 8 })
    .toFile(outAvif)
    .catch(err => error(err))

  return Promise.allSettled([webpPromise, avifPromise])
}

function log(message) {
  console.log(colors.cyan('ImageMin:'), message);
}
function error(message, error) {
  console.error(colors.cyan('ImageMin:'), message, error);
}