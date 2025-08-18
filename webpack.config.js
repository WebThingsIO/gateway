/**
 * Wepback configuration for the node server.
 */

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { v1: uuidv1 } = require('uuid');
const webpack = require('webpack');

const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        targets: [
          'supports fetch',
          'supports websockets',
          'supports es6',
          'supports customevent',
          'supports custom-elementsv1',
          'supports shadowdomv1',
        ].join(' and '),
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
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
          ignore: ['**/*.js', '**/*.ts', '**/index.html'],
        },
      },
      {
        from: 'src/views/hotspot.handlebars',
        to: path.join(__dirname, 'build', 'views'),
      },
    ],
  }),
  new ImageMinimizerWebpackPlugin({
    minimizerOptions: {
      plugins: ['gifsicle', 'jpegtran', 'optipng', 'svgo'],
    },
  }),
  new webpack.SourceMapDevToolPlugin({
    test: /\.css$/,
    filename: '[file].map',
  }),
  new MiniCssExtractPlugin({
    filename: 'bundle/[contenthash]-[name].css',
  }),
  new HtmlWebpackPlugin({
    inject: 'head',
    template: 'static/index.html',
    chunks: ['buildCss', 'app.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'static/signup/index.html',
    filename: 'signup/index.html',
    chunks: ['create-user.js'],
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
    template: 'src/views/connecting.handlebars',
    filename: '../views/connecting.handlebars',
    chunks: ['connecting.js'],
  }),
  new HtmlWebpackPlugin({
    template: 'src/views/local-token-service.handlebars',
    filename: '../views/local-token-service.handlebars',
    chunks: ['local-token.js'],
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
    'login.js': ['./static/js/check-user.js', './static/js/login.js'],
    'authorize.js': ['./static/js/check-user.js', './static/js/authorize.js'],
    'local-token.js': ['./static/js/check-user.js', './static/js/local-token.js'],
    'setup-subdomain.js': ['./static/js/setup-subdomain.js'],
    'wifi-setup.js': ['./static/js/wifi-setup.js'],
    buildCss: [
      // css for static/index.html
      './static/css/app.css',
      './static/css/things.css',
      './static/css/menu.css',
      './static/css/add-thing.css',
      './static/css/add-group.css',
      './static/css/context-menu.css',
      './static/css/group-context-menu.css',
      './static/css/thing.css',
      './static/css/group.css',
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
    filename: 'bundle/[contenthash]-[name]',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /.\/static\/js\/.*\.ts$/,
        include: path.resolve(__dirname, 'static'),
        loader: 'ts-loader',
        options: {
          onlyCompileBundledFiles: true,
          configFile: path.resolve(__dirname, 'static', 'tsconfig.json'),
        },
      },
      {
        test: [/.\/node_modules\/@fluent\/.*\.js$/, /.\/static\/js\/.*\.js$/],
        include: [
          path.resolve(__dirname, 'node_modules', '@fluent'),
          path.resolve(__dirname, 'static'),
        ],
        use: {
          loader: 'babel-loader',
          options: babelOptions,
        },
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
              url: false,
              sourceMap: true,
              esModule: false,
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
              url: false,
              sourceMap: true,
              esModule: false,
            },
          },
        ],
      },
      {
        test: /(?!\/uploads\/floorplan)\.(png|jpg|gif|svg|woff|woff2)$/,
        include: path.resolve(__dirname, 'static'),
        type: 'asset',
      },
    ],
  },
  plugins: pluginsWeb,
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      fs: false,
    },
  },
};

const pluginsSW = [
  new webpack.BannerPlugin({
    banner: `const VERSION = '${uuidv1()}';`,
    raw: true,
  }),
];

const webpackSW = {
  entry: {
    'service-worker.js': './static/service-worker.js',
  },
  mode: 'production',
  target: 'webworker',
  output: {
    path: path.join(__dirname, 'build', 'static'),
    filename: '[name]',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'static'),
        use: {
          loader: 'babel-loader',
          options: babelOptions,
        },
      },
    ],
  },
  plugins: pluginsSW,
  devtool: false,
};

module.exports = [webpackWeb, webpackSW];
