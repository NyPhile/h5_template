const path = require('path')
const resolve = path.resolve
const pkg = require('./package.json')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

let publicPath = `https://static.ws.126.net/163/f2e/${pkg.channel}/${pkg.name}/`

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[contenthash:8].js',
    publicPath: publicPath
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(), //打包分析工具，按需打开
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css"
    }),
    new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
        'process.env.BASE_URL': JSON.stringify(publicPath),
        'process.env.ANT_PROJECT_ID': JSON.stringify(pkg.projectId)
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: path.resolve(__dirname, 'dist/static'),
        ignore: ['.*']
      }
    ]),
  ],
  optimization: {
    minimizer:[
      // 自定义js优化配置，将会覆盖默认配置
      new UglifyJsPlugin({
        exclude: /\.min\.js$/,
        cache: true,
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false,
        extractComments: false, // 移除注释
        uglifyOptions: {
          compress: {
            unused: true,
            // warnings: false,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        }
      }),
      // 用于优化css文件
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true }, // 这里是个大坑，稍后会提到
          mergeLonghand: false,
          discardComments: {
            removeAll: true // 移除注释
          }
        },
        canPrint: true
      })
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