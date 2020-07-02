/**
 * Wepback configuration for the node server.
 */

const {CheckerPlugin} = require('awesome-typescript-loader');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');
const path = require('path');
const {v1: uuidv1} = require('uuid');
const webpack = require('webpack');

const externals = {};
fs.readdirSync('node_modules')
  .filter((x) => !['.bin'].includes(x))
  .forEach((mod) => {
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
    __dirname: true,
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
        include: path.resolve(__dirname, 'src'),
        use: [
          'awesome-typescript-loader',
        ],
      },
    ],
  },
  devtool: 'sourcemap',
  plugins: pluginsNode,
  externals,
};

const pluginsWeb = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*', '!service-worker.js*'],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'static/**/*',
        to: path.join(__dirname, 'build'),
        globOptions: {
          ignore: ['**/*.js', '**/index.html'],
        },
      },
      {
        from: 'src/views/connecting.handlebars',
        to: path.join(__dirname, 'build', 'views'),
      },
      {
        from: 'src/views/creating.handlebars',
        to: path.join(__dirname, 'build', 'views'),
      },
      {
        from: 'src/views/hotspot.handlebars',
        to: path.join(__dirname, 'build', 'views'),
      },
      {
        from: 'src/views/router-setup.handlebars',
        to: path.join(__dirname, 'build', 'views'),
      },
      {
        from: 'src/views/wifi-setup.handlebars',
        to: path.join(__dirname, 'build', 'views'),
      },
    ],
  }),
  new ImageminPlugin({
    test: /\.(jpe?g|png|gif|svg)$/i,
    name: '[path][name].[ext]',
    imageminOptions: {
      plugins: [
        'gifsicle',
        'jpegtran',
        'optipng',
        'svgo',
      ],
    },
  }),
  new webpack.SourceMapDevToolPlugin({
    test: /\.css$/,
    filename: '[file].map',
  }),
  new MiniCssExtractPlugin({
    filename: 'bundle/[hash]-[name].css',
  }),
  new HtmlWebpackPlugin({
    inject: 'head',
    template: 'static/index.html',
    chunks: ['style', 'app.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'src/views/connecting.handlebars',
    filename: '../views/connecting.handlebars',
    chunks: ['connecting.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'static/signup/index.html',
    filename: 'signup/index.html',
    chunks: ['create-user.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'src/views/creating.handlebars',
    filename: '../views/creating.handlebars',
    chunks: ['creating.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'static/login/index.html',
    filename: 'login/index.html',
    chunks: ['login.js'],
  }),
  new HtmlWebpackPlugin({
    inject: 'head',
    template: 'src/views/authorize.handlebars',
    filename: '../views/authorize.handlebars',
    chunks: ['authorize.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'src/views/local-token-service.handlebars',
    filename: '../views/local-token-service.handlebars',
    chunks: ['local-token.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'src/views/router-setup.handlebars',
    filename: '../views/router-setup.handlebars',
    chunks: ['router-setup.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'src/views/tunnel-setup.handlebars',
    filename: '../views/tunnel-setup.handlebars',
    chunks: ['setup-subdomain.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'src/views/wifi-setup.handlebars',
    filename: '../views/wifi-setup.handlebars',
    chunks: ['wifi-setup.js'],
  }),
];

const webpackWeb = {
  entry: {
    'app.js': ['./static/js/check-user.js', './static/js/app.js'],
    'connecting.js': ['./static/js/connecting.js'],
    'create-user.js': ['./static/js/create-user.js'],
    'creating.js': ['./static/js/creating.js'],
    'login.js': ['./static/js/check-user.js', './static/js/login.js'],
    'authorize.js': ['./static/js/check-user.js', './static/js/authorize.js'],
    'local-token.js': [
      './static/js/check-user.js',
      './static/js/local-token.js',
    ],
    'router-setup.js': ['./static/js/router-setup.js'],
    'setup-subdomain.js': ['./static/js/setup-subdomain.js'],
    'wifi-setup.js': ['./static/js/wifi-setup.js'],
    buildCss: [
      // css for static/index.html
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
      './static/css/logs.css',
      './static/css/addons-form.css',
      './node_modules/mobile-drag-drop/default.css',
    ],
  },
  mode: 'production',
  target: 'web',
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'style',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  output: {
    path: path.join(__dirname, 'build', 'static'),
    filename: 'bundle/[hash]-[name]',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /.\/static\/js\/.*\.js$/,
        include: path.resolve(__dirname, 'static'),
        use: [
          {
            loader: 'babel-loader',
            query: {
              babelrc: false,
              sourceType: 'script',
              presets: [
                ['@babel/preset-env', {
                  modules: 'commonjs',
                  targets: {
                    chrome: '43',
                    opera: '29',
                    edge: '14',
                    firefox: '52',
                    safari: '10.1',
                    ios: '10',
                  },
                  useBuiltIns: 'usage',
                  corejs: 3,
                }],
              ],
              plugins: ['@babel/plugin-proposal-object-rest-spread'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'node_modules', 'mobile-drag-drop'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'static'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src'],
              root: path.join(__dirname, 'static'),
              minimize: true,
            },
          },
        ],
      },
      {
        test:
          /(?!\/uploads\/floorplan)\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        include: path.resolve(__dirname, 'static'),
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              fallback: 'file-loader',
              publicPath: '/images',
              outputPath: 'images',
              esModule: false,
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
  plugins: pluginsWeb,
  devtool: 'source-map',
};

const pluginsSW = [
  new webpack.BannerPlugin({
    banner: `const VERSION = '${uuidv1()}';`,
    raw: true,
  }),
  new ExtractTextPlugin(
    {filename: 'service-worker.js',
     allChunks: true}
  ),
];

const webpackSW = {
  entry: {
    'service-worker.js': './static/service-worker.js',
  },
  mode: 'production',
  target: 'webworker',
  output: {
    path: path.join(__dirname, 'build', 'static'),
    filename: '[name]_',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'static'),
        use: ExtractTextPlugin.extract({
          use: {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        }),
      },
    ],
  },
  plugins: pluginsSW,
  devtool: false,
};

module.exports = [
  webpackNode,
  webpackWeb,
  webpackSW,
];
