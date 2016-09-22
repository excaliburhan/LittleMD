/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ webpack dev config
 */

const path = require('path')
const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')

module.exports = {
  // dev配置
  devtool: '#source-map',

  // 入口配置
  entry: {
    bundle: ['webpack-hot-middleware/client?reload=true', './src/js/app.js'],
  },

  // 出口配置
  output: {
    path: path.join(__dirname, 'dist'), // 编译后地址
    publicPath: '/dist/',
    filename: '[name].js', // 导出文件名称命名
  },

  // 解析配置
  resolve: {
    alias: {
      jquery: path.join(__dirname, 'vendors/jquery-3.1.0.min.js'),
      'highlight.js': path.join(__dirname, 'vendors/highlight.pack.js'),
    }, // alias配置, 配置的内容可以直接require
    extensions: ['', '.js', '.jsx'], // 当requrie的模块找不到时, 添加这些后缀
  },

  // 插件配置
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热加载
    new webpack.DefinePlugin({ // 定义全局变量
      DEBUG: true,
    }),
    new webpack.optimize.OccurenceOrderPlugin(), // 根据引用次数排序ids, 压缩文件大小
    new webpack.NoErrorsPlugin(),
  ],

  // 模块设置
  module: {
    noParse: ['/vendors/'],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.(css)$/,
        loaders: ['style', 'css', 'postcss'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url?limit=10000&name=[name].[hash:8].[ext]',
      },
      {
        test: /\.(woff|eot|ttf)$/i,
        loader: 'url?limit=10000&name=[name].[chunkhash:8].[ext]',
      },
    ],
  },

  // 外部依赖
  externals: {
    jquery: true,
    'highlight.js': true,
  },

  // postcss配置
  postcss: () => [precss, autoprefixer],

  node: {
    fs: 'empty',
  },
  // target: 'node-webkit',
}
