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
  devtool: false,

  // 入口配置
  entry: {
    bundle: './src/js/app',
  },

  // 出口配置
  output: {
    path: path.join(__dirname, 'dist'), // 编译后地址
    publicPath: '/dist/',
    filename: 'bundle.js', // 导出文件名称命名
  },

  // 解析配置
  resolve: {
    alias: [], // alias配置, 配置的内容可以直接require
    extensions: ['', '.js', '.jsx'], // 当requrie的模块找不到时, 添加这些后缀
  },

  // 插件配置
  plugins: [
    new webpack.DefinePlugin({ // 定义全局变量
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
      $: 'jquery',
      DEBUG: false,
    }),
    new webpack.optimize.OccurenceOrderPlugin(), // 根据引用次数排序ids, 压缩文件大小
    new webpack.optimize.UglifyJsPlugin({ // 压缩js
      compress: {
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        unused: true,
        warnings: true,
      },
      output: {
        comments: false,
      },
    }),
  ],

  // 模块设置
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url?limit=10000',
      },
      {
        test: /\.(woff|eot|ttf)$/i,
        loader: 'url?limit=10000',
      },
    ],
  },

  // postcss配置
  postcss: () => [precss, autoprefixer],
}
