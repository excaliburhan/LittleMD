/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ main
 */

import tabOverride from 'taboverride'
import editor from './editor.js'
import menu from './menu.js'

const gui = window.require('nw.gui')

export default {
  // func
  scrollSync() {
    const divs = $('#editor, #preview')
    const other = divs.not(this).off('scroll').get(0)
    const percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight)
    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight)
    setTimeout(() => {
      other.on('scroll', this.scrollSync)
    }, 200)
  },

  init() {
    menu.initMenu()
    $(() => {
      const bodyDom = $('body')
      const editorDom = $('#editor')
      const divs = $('#editor, #preview')
      // File type associations
      if (gui.App.argv.length > 0) {
        // fix path, cut 'file://'
        const path = gui.App.argv[0].substr(7)
        editor.loadFile(path)
      }

      // reset drag
      $(window).on('dragover', e => {
        e.preventDefault()
        // e.originalEvent.dataTransfer.dropEffect = 'none'
      })
      $(window).on('drop', e => {
        e.preventDefault()
      })

      // bind
      editorDom.bind('input', () => {
        editor.reload()
      })
      bodyDom.on('click', 'a', e => {
        $('.test').text('1')
        e.preventDefault()
        editor.openUrl(e.target.href)
      })

      // scroll sync
      divs.on('scroll', this.scrollSync)

      // tabOverride
      tabOverride.tabSize(4).set(document.getElementById('editor'))
    })
  },
}
