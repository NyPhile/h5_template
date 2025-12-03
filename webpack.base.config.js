const path = require('path')
const resolve = path.resolve

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const dev = process.env.NODE_ENV !== 'production'

module.exports = {
  context: resolve(__dirname, './'),
  entry: [
    path.join(__dirname, './src/js/index.js')
  ],
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
        dev ? 'style-loader' : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../../'
          }
        },
        'css-loader',
        'postcss-loader',
        'less-loader',
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules|\.min\.js|bower_components/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: false,
            sources: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src',
                },
              ],
            },
          }
        }]
      },
      {
        test: /\.(png|jpe?g)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 // 1kb
          }
        },
        generator: {
          filename: 'static/images/[name].[hash:7][ext]'
        },
        use: [
          {
            loader: 'tinify-loader',
            options: {
              apikey: 'iA4WgA6dpM0nbSKsByJDA0MuLyodD2_j',
              cache: path.resolve(__dirname, 'node_modules/tinify-loader')
            }
          }
        ]
      },
      {
        test: /\.(gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 // 1kb
          }
        },
        generator: {
          filename: 'static/images/[name].[hash:7][ext]'
        }
      },
      {
        test: /\.(mp3|mp4)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name][ext]'
        }
      }
    ]
  },
  externals: [
    /zepto|\$/
  ],
  resolve: {
    extensions: ['.js', '.json'],
    // 配置项目文件别名
    alias: {
      '@': resolve('src'),
      'utils': resolve('src/js/utils'),
      'js-bridge': '@mf2e/js-bridge',
      'newsapp-share': '@newsapp-activity/newsapp-share'
    }
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js'],
      exclude: 'node_modules',
      formatter: require('eslint-friendly-formatter')
    })
  ]
}