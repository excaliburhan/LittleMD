/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ editor
 */

import $ from 'jquery'
import marked from 'marked'

export default {
  reload() {
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
    })
    const preview = $('#preview')
    const editorDom = $('#editor .editorArea')
    const text = editorDom.val()
    console.log(marked(text))
    preview.html(marked(text))
  },
}
