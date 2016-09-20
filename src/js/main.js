/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ main
 */

import $ from 'jquery'
import editor from './editor.js'

export default {
  init() {
    $(() => {
      const editorDom = $('#editor .editorArea')
      editorDom.bind('input', () => {
        editor.reload()
      })
    })
  },
}
