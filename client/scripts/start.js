const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');

const webpackConfig = require('../configs/webpack.config');
const webpackDevServerConfig = require('../configs/webpackDevServer');
const WebpackDevServer = require('webpack-dev-server');

const compiler = webpack(webpackConfig('development'));
const config = webpackDevServerConfig();

// TODO: Don't forget about proxy here!
const server = new WebpackDevServer(compiler, config);

middleware(compiler, ({
  writeToDisk: (filePath) => {
    return  true; // You can use pattern here
    // return /locales/.test(filePath);
  },
}))

server.listen(config.port, config.host, err => {
  if (err) {
    console.err('WebpackDevServer listen error!');
  }
})
