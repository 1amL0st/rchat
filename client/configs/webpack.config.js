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
        ],
      },
    ],
  };
}

function generatePlugins() {
  const plugins = [
    new HTMLWebpackPlugin({
      template: './source/index.html',
    }),
    new MiniSCCExtractPlugin({
      filename: 'bundle.css',
    }),
    new ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, './.eslintrc'),
      extensions: ['js', 'jsx'],
      fix: true,
      emitWarning: true,
      failOnError: !isDev
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
