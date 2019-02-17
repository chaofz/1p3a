var path = require('path');
var webpack = require("webpack");

module.exports = {
  entry: './src/entry.jsx',
  output: {
    path: path.join(__dirname, '/public/js'),
    filename: 'bundle.js'
  },
  debug: true,
  devtool: '#cheap-source-map',

  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: { presets: ['react', 'es2015'] },
      exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
}
