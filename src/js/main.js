/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ main
 */

import tabOverride from 'taboverride'
import editor from './editor.js'
import menu from './menu.js'

const fs = require('fs')
const gui = window.require('nw.gui')
let scrollTimer = null

export default {
  // func
  scrollSync() {
    scrollTimer && clearTimeout(scrollTimer)
    const divs = $('#editor, #preview')
    const other = divs.not(this).off('scroll').get(0)
    const percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight)
    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight)
    scrollTimer = setTimeout(() => {
      $(other).on('scroll', this.scrollSync)
    }, 200)
  },

  init() {
    menu.initMenu()
    $(() => {
      // file associations
      if (gui.App.argv.length > 0) {
        // fix path, cut 'file://'
        const path = decodeURI(gui.App.argv[0].substr(7)) // decodeURI for Chinese
        editor.loadFile(path)
      }
      // if app is open, trigger loadFile
      gui.App.on('open', path => {
        window.focus()
        path = decodeURI(path.substr(7))
        if (~path.indexOf('.md')) {
          editor.loadFile(path)
        }
      })
      // reset drop && dragover
      $(document).on('drop dragover', e => {
        e.preventDefault()
        e = e.originalEvent
        if (!e.dataTransfer.files.length) return

        const path = e.dataTransfer.files[0].path
        if (!fs.statSync(path).isDirectory() && ~path.indexOf('.md')) { // open md file only
          editor.loadFile(path)
        }
      })

      // bind events
      $('#editor').bind('input propertychange', () => {
        editor.reload()
      })
      $('body').on('click', 'a', e => {
        e.preventDefault()
        editor.openUrl(e.target.href)
      })
      // scroll
      $('#editor, #preview').on('scroll', this.scrollSync)

      // tabOverride
      tabOverride.tabSize(4).set(document.getElementById('editor'))
    })
  },
}
