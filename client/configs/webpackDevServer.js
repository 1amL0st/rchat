const path = require('path');

module.exports = function() {
  return {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    hot: true,
    proxy: {
      '/': 'https:/localhost:8080',
    },
  }
}