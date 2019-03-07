const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

/**
 * Compare images and create diff image.
 *
 * @param {String} source Image path to compare 1.
 * @param {String} target Image path to compare 2.
 * @param {String} output Output path of diff image.
 *
 * @return {Promise(Number)} Num of pixels differed.
 */
exports.compareImage = (source, target, output) => {
  const image1 = fs.createReadStream(source).pipe(new PNG());
  const image2 = fs.createReadStream(target).pipe(new PNG());

  return new Promise((resolve, reject) => {
    image1.once('parsed', onParsed);
    image1.once('error', onError);
    image2.once('parsed', onParsed);
    image2.once('error', onError);

    let errorOccurred = false;
    function onError(err) {
      if (!errorOccurred) {
        errorOccurred = true;
        console.error(err);
        reject(`Failed to compare ${source} and ${target}`);
      }
    }

    let filesRead = 0;
    function onParsed() {
      if (errorOccurred) {
        return;
      }
      if (++filesRead < 2) {
        return;
      }
      const diff = new PNG({width: image1.width, height: image1.height});
      const mismatchedPixels = pixelmatch(image1.data,
                                          image2.data,
                                          diff.data,
                                          image1.width,
                                          image1.height,
                                          {threshold: 0.1});
      if (mismatchedPixels > 0) {
        diff.pack().pipe(fs.createWriteStream(output));
      }
      resolve(mismatchedPixels);
    }
  });
};
