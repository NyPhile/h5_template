const pkg = require('./package.json')
const baseWebpackConfig = require('./webpack.base.config.js')

const path = require('path')
const resolve = path.resolve

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

let publicPath = `https://static.ws.126.net/163/f2e/${pkg.channel}/${pkg.name}/`

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[contenthash:8].js',
    publicPath,
    clean: true
  },
  plugins: [
    // new BundleAnalyzerPlugin(), //打包分析工具，按需打开
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css"
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      minify: false
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: /manifest\..*\.js$/,
      async: /main\..*\.js$/,
    }),
    new webpack.DefinePlugin({
        'process.env.BASE_URL': JSON.stringify(publicPath),
        'process.env.ANT_PROJECT_ID': JSON.stringify(pkg.projectId),
        'process.env.PROJECT_CHANNEL': JSON.stringify(pkg.channel),
        'process.env.PROJECT_NAME': JSON.stringify(pkg.name)
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'static'),
          to: path.resolve(__dirname, 'dist/static'),
          globOptions: {
            ignore: ['**/.DS_Store']
          }
        }
      ]
    }),
  ],
  optimization: {
    minimizer:[
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          format: {
            comments: false
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          priority: 10,
          chunks: 'initial',
          name: 'vendors'
        },
        common: {
          name: 'common'
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
})