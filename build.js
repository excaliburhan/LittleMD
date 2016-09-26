/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @build
 */

const NwBuilder = require('nw-builder')
const nw = new NwBuilder({
  files: [
    './package.json',
    './*.html',
    './dist/*',
    './vendors/*',
    '!/node_modules/**',
    '!/cache/**',
  ], // path to nwapp files
  platforms: ['osx64'],
  macIcns: './app.icns',
  flavor: 'normal',
  // version: 'v0.12.2',
})

nw.on('log', console.log)

// Build returns a promise
nw.build()
.then(() => {
  console.log('all done!')
})
.catch(err => {
  console.error(err)
})
