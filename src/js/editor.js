/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ editor
 */

import $ from 'jquery'
import marked from 'marked'

export default {
  reload() { // sync preview
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
    const editorDom = $('#editor')
    const text = editorDom.val()
    preview.html(marked(text))
  },

  loadText(text) {
    const editorDom = $('#editor')
    editorDom.val(text)
    this.reload()
  },

  loadFile(file) {
    const fs = require('fs')
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
      }
      this.loadText(data)
    })
  },

  chooseFile(selector, callback) {
    const chooser = $(selector)
    chooser.change(() => {
      callback(chooser.val())
    })

    chooser.trigger('click')
  },
}
