const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Managerment'
    }),
    new ExtractTextPlugin({
      filename: "css/[name].[contentHash:8].css"
    })
  ],
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].[chunkHash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: ['css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]',
            publicPath: '//stdl.qq.com/asset/'
          }
        }]
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      }
    ]
  }
};