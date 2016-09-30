/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ editor
 */

const fs = require('fs')
const marked = require('marked')
const emojify = require('emojify.js')
const vars = require('./vars.js')
const util = require('./util.js')

const $ = global.$
const hljs = global.hljs

module.exports = {
  // func
  openUrl(url) {
    global.gui.Shell.openExternal(url)
  },
  openItem(path) {
    global.gui.Shell.openItem(path)
  },
  showItemInFolder(path) {
    global.gui.Shell.showItemInFolder(path)
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
    emojify.run(preview.get(0))
  },
  // check line display
  checkLine() {
    const lineDom = $('#line')
    const editorDom = $('#editor')
    const rulerDom = $('#ruler')
    const liveArr = editorDom.val().split('\n')
    const liveLines = liveArr.length
    const indexEnd = editorDom.get(0).selectionEnd
    const activeLine = editorDom.val().substring(0, indexEnd).split('\n').length
    let tpl = ''
    let style = ''
    let cls = ''
    let lineHeight = 0
    let activeHeight = 20
    for (let i = 0; i < liveLines; i++) {
      rulerDom.text(liveArr[i])
      let h = Math.ceil(rulerDom.width() / editorDom.width()) * 20
      if (h < 20) h = 20
      if (i < activeLine) lineHeight += h
      if (activeLine === i + 1) { // active line style
        style = `height:${h}px;background-color:rgba(0, 0, 0, 0.5);`
        activeHeight = h
        cls = 'line-active'
      } else {
        style = `height:${h}px;`
        cls = ''
      }
      tpl += `<div class="line-${i + 1} ${cls}" style="${style}">${i + 1}</div>`
    }
    editorDom.css({
      backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0.5) 100%)',
      backgroundPositionY: `${lineHeight - activeHeight - editorDom.scrollTop()}px`,
      backgroundSize: `100% ${activeHeight}px`,
    })
    lineDom.html(tpl)
  },

  loadText(text) {
    const editorDom = $('#editor')
    editorDom.val(text)
    this.checkLine()
    this.reload()
    vars.currentContent = text
  },
  loadFile(filename) {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
      }
      this.setTitle(filename)
      this.loadText(data)
      vars.isSaved = true
      vars.currentFilePath = filename
      util.setSystem({
        lastFile: filename,
      })
    })
  },
  chooseFile(selector, callback) { // save & export
    const chooser = $(selector)
    chooser.change(() => {
      callback(chooser.val())
    })
    chooser.trigger('click')
  },
  uploadFile(selector, callback) { // save & export
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
