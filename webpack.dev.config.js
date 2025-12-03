const pkg = require('./package.json')
const baseWebpackConfig = require('./webpack.base.config.js')

const path = require('path')
const resolve = path.resolve

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'static/js/[name].js'
  },
  devtool: 'inline-source-map',
  devServer: {
    allowedHosts: 'all',
    client: {
      logging: 'info',
      overlay: true,
    },
    hot: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './static/css/[name].css'
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify('/'),
      'process.env.ANT_PROJECT_ID': JSON.stringify(pkg.projectId)
    })
  ]
})