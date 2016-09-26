/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ editor
 */

import marked from 'marked'
import emojify from 'emojify.js'

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
    emojify.run()
    // $('.test').text(preview.html())
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
      this.setTitle(file)
      this.loadText(data)
    })
  },

  chooseFile(selector, callback) { // save & export
    const chooser = $(selector)
    chooser.change(() => {
      callback(chooser.val())
    })

    chooser.trigger('click')
  },

  // set title & filename
  setTitle(filename) {
    const fileArr = filename.split('/')
    const fileTitle = fileArr[fileArr.length - 1] || 'LittleMD.md'
    const pdfTitle = fileTitle.replace(/.\w+$/, '.pdf')
    const htmlTitle = fileTitle.replace(/.\w+$/, '.html')
    $('title').html(fileTitle)
    $('#saveFile').attr('nwsaveas', fileTitle)
    $('#pdfFile').attr('nwsaveas', pdfTitle)
    $('#htmlFile').attr('nwsaveas', htmlTitle)
  },
}
