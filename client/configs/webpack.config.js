const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniSCCExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

let isDev = false;
const outputPath = '../../public/';

function generateModule() {
  return {
    rules: [
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react'],
              plugins: ['react-hot-loader/babel'],
            },
          },
        ],
      },
      {
        test: /\.(css)|(s[ac]ss)$/i,
        use: [
          MiniSCCExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
    ],
  };
}

function generatePlugins() {
  const plugins = [
    new HTMLWebpackPlugin({
      template: './source/index.html',
      favicon: './icons/favicon.png',
    }),
    new MiniSCCExtractPlugin({
      filename: 'bundle.css',
    }),
    new ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, './.eslintrc'),
      extensions: ['js', 'jsx'],
      fix: true,
      emitWarning: true,
      failOnError: false
    })
  ];

  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new ReactRefreshWebpackPlugin());
  }

  return plugins;
}

function generateConfig(mode) {
  isDev = mode === 'development';

  return {
    entry: './source/index.jsx',

    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
        'layouts': path.resolve(__dirname, '../source/layouts/'),
        'api': path.resolve(__dirname, '../source/api/'),
        'icons': path.resolve(__dirname, '../source/icons/'),
        'styles': path.resolve(__dirname, '../source/styles/'),
        'components': path.resolve(__dirname, '../source/components/'),
        'store': path.resolve(__dirname, '../source/store/'),
        'hooks': path.resolve(__dirname, '../source/hooks/')
      }
    },

    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : false,
    
    module: generateModule(),
    plugins: generatePlugins(),

    output: {
      path: path.resolve(__dirname, outputPath),
      filename: 'bundle.js',
    },
  };
}

module.exports = generateConfig;
