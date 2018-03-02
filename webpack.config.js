/**
 * Wepback configuration for the node server.
 */

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

const externals = {};
fs.readdirSync('node_modules')
.filter(function(x) {
  return ['.bin'].indexOf(x) === -1;
})
.forEach(function(mod) {
  externals[mod] = 'commonjs ' + mod;
});

const plugins = [
  new CheckerPlugin(),
  new webpack.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true,
  }),
  // Here we install the speak-to-me api into static
  new CopyWebpackPlugin([
    { from: 'node_modules/speaktome-api/build/stm_web.min.js',
        to: '../static/js/lib' },
  ]),
];

module.exports = {
  entry: './src/app.js',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'gateway.js'
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ],
  },
  devtool: 'sourcemap',
  plugins,
  externals,
}
