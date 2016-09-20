/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @devServer
 */

const colors = require('colors')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const Express = require('express')
const webpackConf = require('./webpack.config.dev')
const compiler = webpack(webpackConf)
const app = new Express()
const port = 2333

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
})


app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConf.output.publicPath,
  hot: true,
  noInfo: false,
  inline: true,
  stats: {
    cached: false,
    colors: true,
  },
}))
app.use(webpackHotMiddleware(compiler))
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})
app.listen(port, err => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Listening on port ${port}`)
  }
})
