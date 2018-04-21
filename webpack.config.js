/**
 * Wepback configuration for the node server.
 */

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CheckerPlugin} = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const externals = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    externals[mod] = `commonjs ${mod}`;
  });

const pluginsNode = [
  new CheckerPlugin(),
  new webpack.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true,
  }),
];

const webpackNode = {
  entry: './src/app.js',
  mode: 'development',
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
    filename: 'gateway.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
  devtool: 'sourcemap',
  plugins: pluginsNode,
  externals,
};

const pluginsJs = [
  new CopyWebpackPlugin([
    {
      from: 'static/**/*',
      to: path.join(__dirname, 'build/'),
      ignore: ['*.js', 'static/index.html'],
    },
    {
      from: 'static/js/lib/*',
      to: path.join(__dirname, 'build/'),
    },
    {
      from: 'static/service-worker.js',
      to: path.join(__dirname, 'build/static'),
    },
  ]),
  new UglifyJsPlugin({
    test: /\.js$/,
  }),
];

const webpackJs = {
  entry: {
    app: './static/js/app.js',
    'check-user': './static/js/check-user.js',
    'create-user': './static/js/create-user.js',
    login: './static/js/login.js',
    authorize: './static/js/authorize.js',
    setup_subdomain: './static/js/setup_subdomain.js',
  },
  mode: 'development',
  target: 'web',
  output: {
    path: path.join(__dirname, 'build/static'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        // schema-utils uses ES7 Spread Operator.
        test: /schema-utils\.js$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              plugins: ['transform-object-rest-spread'],
            },
          },
        ],
      },
    ],
  },
  // When require stm_web.min.js, can't resolve 'fs'.
  // Maybe webpack bug.
  node: {
    fs: 'empty',
  },
  plugins: pluginsJs,
};

const extractCss = new ExtractTextPlugin('css/style.css');
const extractHtml = new ExtractTextPlugin('index.html');

const webpackCssHtml = {
  entry: {
    'css/style.css': [
      // css for index.html
      './static/css/app.css',
      './static/css/things.css',
      './static/css/menu.css',
      './static/css/add-thing.css',
      './static/css/context-menu.css',
      './static/css/thing.css',
      './static/css/floorplan.css',
      './static/css/settings.css',
      './static/css/rules-common.css',
      './static/css/rules.css',
      './static/css/rule.css',
      './static/css/addons-form.css',
    ],
    'index.html': './static/index.html',
  },
  mode: 'development',
  output: {
    path: path.join(__dirname, 'build/static/'),
    filename: '[name]',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
            },
          },
        }),
      },
      {
        test: /\.html$/,
        use: extractHtml.extract({
          use: {
            loader: 'html-loader',
            options: {
              attrs: ['img:src'],
              root: path.join(__dirname, 'static'),
              minimize: true,
            },
          },
        }),
      },
      {
        test:
          /(?!\/uploads\/floorplan)\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: 'build/.cache/image',
            },
          },
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              fallback: 'file-loader',
              publicPath: '/',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 80,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              optipng: {
                enabled: true,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    extractCss,
    extractHtml,
  ],
  devtool: 'source-map',
};

module.exports = [
  webpackNode,
  webpackJs,
  webpackCssHtml,
];
