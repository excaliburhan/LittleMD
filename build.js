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
    './system.json',
    './app.js',
    './*.html',
    './*.md',
    './js/**',
    './css/**',
    './images/**',
    './vendors/*',
    './node_modules/**',
    '!/cache/**',
  ], // path to nwapp files
  platforms: ['osx64'],
  // platforms: ['osx64', 'win', 'linux'],
  macIcns: './app.icns',
  flavor: 'normal',
  version: '0.17.4',
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
