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
  // Until we ship our plugin API we simply copy these over.
  new CopyWebpackPlugin([
    { from: 'src/adapters/', to: 'adapters/' },
  ])
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
