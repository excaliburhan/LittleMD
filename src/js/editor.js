/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ editor
 */

import marked from 'marked'

const gui = window.require('nw.gui')

export default {
  // func
  openUrl(url) {
    gui.Shell.openExternal(url)
  },
  openItem(path) {
    gui.Shell.openItem(path)
  },
  showItemInFolder(path) {
    gui.Shell.showItemInFolder(path)
  },

  // sync preview
  reload() {
    marked.setOptions({
      highlight: code => hljs.highlightAuto(code).value,
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
    $('.test').text(preview.html())
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
