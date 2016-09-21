/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ main
 */

import $ from 'jquery'
import tabOverride from 'taboverride'
import editor from './editor.js'
import menu from './menu.js'

const gui = window.require('nw.gui')

export default {
  init() {
    menu.initMenu()
    $(() => {
      // File type associations
      if (gui.App.argv.length > 0) {
        // fix path
        const path = gui.App.argv[0].substr(7)
        editor.loadFile(path)
      }
      // bind reload
      const editorDom = $('#editor')
      editorDom.bind('input', () => {
        editor.reload()
      })
      // tabOverride
      tabOverride.tabSize(4).set(window.document.getElementById('editor'))
    })
  },
}
