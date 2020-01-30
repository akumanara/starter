/* eslint-disable */
path = require('path');

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app.js'
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          "presets": [
            [
              "@babel/preset-env",
              {

              }
            ]
          ]
        }
      }
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    },]
  }
};