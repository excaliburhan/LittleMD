/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ main
 */

import $ from 'jquery'
import editor from './editor.js'

const gui = window.require('nw.gui')

export default {
  init() {
    $(() => {
      // File type associations
      if (gui.App.argv.length > 0) {
        editor.loadFile(gui.App.argv[0])
      }
      // bind reload
      const editorDom = $('#editor .editorArea')
      editorDom.bind('input', () => {
        editor.reload()
      })
    })
  },
}
