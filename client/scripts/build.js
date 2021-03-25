const webpack = require('webpack');
const config = require('../configs/webpack.config.js');

webpack(config('production'), (err, stats) => {
  if (err) {
    console.log('Error happened!', err);
  } else {
    if (stats.hasErrors()) {
      // This will print erros if something went wrong
      console.log(stats.toString({
        chunks: false,
        colors: true
      }));
    }
  }
});;