let imagemin;
let imageminMozjpeg;
let imageminSvgo;
let imageminPngquant;
let imageminOptipng;
let imageminGifsicle;
try {
  imagemin = require('imagemin');
  imageminMozjpeg = require('imagemin-mozjpeg');
  imageminSvgo = require('imagemin-svgo');
  imageminPngquant = require('imagemin-pngquant');
  imageminOptipng = require('imagemin-optipng');
  imageminGifsicle = require('imagemin-gifsicle');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    throw e;
  }
  console.error('You need to install dependencies:\n' +
                'apt-get install libtool autoconf build-essential' +
                '$ yarn global add imagemin imagemin-mozjpeg imagemin-svgo ' +
                'imagemin-pngquant imagemin-optipng imagemin-gifsicle\n' +
                '$ export NODE_PATH=`yarn global dir`/node_modules &&' +
                `node ${process.argv[1]}`);
  process.exit(1);
}
const path = require('path');

const gatewayRoot = path.join(__dirname, '..');
imagemin(
  [`${gatewayRoot}/static/images/*.{jpg,png,gif,svg}`],
  `${gatewayRoot}/static/optimized-images/`, {
    plugins: [
      imageminMozjpeg({
        progressive: true,
        quality: 80,
      }),
      imageminSvgo(),
      imageminPngquant({
        quality: '65-90',
      }),
      imageminOptipng({
        enabled: true,
      }),
      imageminGifsicle(),
    ],
  })
  .then((files) => {
    console.log(files);
  });
