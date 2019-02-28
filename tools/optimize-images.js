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

  console.error(
    'You need to install dependencies:\n\n' +
    '$ sudo apt-get install libtool autoconf build-essential\n' +
    '$ npm install -g imagemin imagemin-mozjpeg imagemin-svgo \\\n' +
    '    imagemin-pngquant imagemin-optipng imagemin-gifsicle\n' +
    '$ export NODE_PATH=$(npm root -g) && \\\n' +
    `    node ${process.argv[1]}`);

  process.exit(1);
}

const path = require('path');

const plugins = [
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
];

const gatewayRoot = path.join(__dirname, '..');
imagemin(
  [`${gatewayRoot}/static/images/*.{jpg,png,gif,svg}`],
  `${gatewayRoot}/static/optimized-images/`,
  {plugins}).then((files) => console.log(files));
imagemin(
  [`${gatewayRoot}/static/images/component-icons/*.{jpg,png,gif,svg}`],
  `${gatewayRoot}/static/optimized-images/component-icons/`,
  {plugins}).then((files) => console.log(files));
imagemin(
  [`${gatewayRoot}/static/images/thing-icons/*.{jpg,png,gif,svg}`],
  `${gatewayRoot}/static/optimized-images/thing-icons/`,
  {plugins}).then((files) => console.log(files));
imagemin(
  [`${gatewayRoot}/static/images/rule-icons/*.{jpg,png,gif,svg}`],
  `${gatewayRoot}/static/optimized-images/rule-icons/`,
  {plugins}).then((files) => console.log(files));
