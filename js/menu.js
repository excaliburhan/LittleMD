/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ menu
 */

const fs = require('fs')
const pdf = require('phantom-html2pdf')
const editor = require('./editor.js')
const vars = require('./vars.js')
const i18n = require('./i18n.js')
const util = require('./util.js')

const lang = navigator.language || 'en-US'
const langConf = i18n[lang]
const $ = global.$
const htmlTmpPath = './htmlTmp.html'
let htmlTmpData = null
const pdfTmpPath = './pdfTmp.html'
let pdfTmpData = null

// get template context
fs.readFile(htmlTmpPath, 'utf8', (err, data) => {
  if (err) {
    console.log(err)
  }
  htmlTmpData = data
})
fs.readFile(pdfTmpPath, 'utf8', (err, data) => {
  if (err) {
    console.log(err)
  }
  pdfTmpData = data
})

module.exports = {
  // func
  newFile() {
    editor.setTitle('LittleMD.md')
    editor.loadText('')
    vars.isSaved = false
    vars.currentFilePath = null
  },
  openFile() {
    editor.chooseFile('#openFile', filename => {
      editor.loadFile(filename)
    })
  },
  saveFile(forceSaveAs, withQuit) {
    const editorDom = $('#editor')
    if (vars.isSaved && !forceSaveAs) { // do save
      fs.writeFile(vars.currentFilePath, editorDom.val(), err => {
        if (err) {
          console.log(err)
          vars.isSaved = false // err might be file deleted
          vars.currentFilePath = null
        } else {
          vars.isSaved = true
          vars.currentContent = editorDom.val()
          withQuit && global.gui.App.quit()
        }
      })
    } else { // do saveAs
      editor.chooseFile('#saveFile', filename => {
        fs.writeFile(filename, editorDom.val(), err => {
          if (err) {
            console.log(err)
          } else {
            editor.setTitle(filename)
            vars.isSaved = true
            vars.currentFilePath = filename
            vars.currentContent = editorDom.val()
            withQuit && global.gui.App.quit()
          }
        })
      })
    }
  },
  exportPDF() {
    const previewDom = $('#preview')
    const pdfTitle = $('#pdfFile').attr('nwsaveas').split('.')[0]
    let html = ''
    if (!pdfTmpData) return
    html = pdfTmpData.replace(/reg-template/, pdfTitle)
    html = html.replace(/reg-preview/, previewDom.html())
    editor.chooseFile('#pdfFile', filename => {
      const options = {
        html,
        deleteOnAction: true,
      }
      pdf.convert(options, (err2, result) => {
        if (err2) {
          console.log(err2)
        }
        result.toFile(filename, () => {
          util.showToast(langConf.exportToast)
        })
      })
    })
  },
  exportHTMl() {
    const previewDom = $('#preview')
    const htmlTitle = $('#htmlFile').attr('nwsaveas').split('.')[0]
    let html = ''
    if (!htmlTmpData) return
    html = htmlTmpData.replace(/reg-template/, htmlTitle)
    html = html.replace(/reg-preview/, previewDom.html())
    editor.chooseFile('#htmlFile', filename => {
      fs.writeFile(filename, html, err => {
        if (err) {
          console.log(err)
        }
        util.showToast(langConf.exportToast)
      })
    })
  },
  minimize() {
    const win = global.gui.Window.get()
    win.minimize()
  },
  maximize() {
    const win = global.gui.Window.get()
    win.maximize()
  },
  close() {
    const nowContent = $('#editor').val()
    if (nowContent !== vars.currentContent) {
      const confirm = langConf.closeConfirm
      util.showConfirm(confirm.title, confirm.content, () => {
        module.exports.saveFile(null, true)
      })
    } else {
      global.gui.App.quit()
    }
  },

  // init menu
  initMenu() {
    const win = global.gui.Window.get()
    const menubar = new global.gui.Menu({ type: 'menubar' })
    const winMenu = new global.gui.Menu()
    const fileMenu = new global.gui.Menu()

    // for Mac
    menubar.createMacBuiltin('LittleMD', {
      hideWindow: true,
    })

    winMenu.append(new global.gui.MenuItem({
      label: langConf.winMenu.minLabel,
      click: this.minimize,
      modifiers: 'cmd',
      key: 'm',
    }))
    winMenu.append(new global.gui.MenuItem({
      label: langConf.winMenu.maxLabel,
      click: this.maximize,
      modifiers: 'cmd+shift',
      key: 'm',
    }))
    winMenu.append(new global.gui.MenuItem({
      type: 'separator',
    }))
    winMenu.append(new global.gui.MenuItem({
      label: langConf.winMenu.closeLabel,
      click: this.close,
      modifiers: 'cmd',
      key: 'w',
    }))

    fileMenu.append(new global.gui.MenuItem({
      label: langConf.fileMenu.newLabel,
      click: this.newFile,
      modifiers: 'cmd',
      key: 'n',
    }))
    fileMenu.append(new global.gui.MenuItem({
      label: langConf.fileMenu.openLabel,
      click: this.openFile,
      modifiers: 'cmd',
      key: 'o',
    }))
    fileMenu.append(new global.gui.MenuItem({
      type: 'separator',
    }))
    fileMenu.append(new global.gui.MenuItem({
      label: langConf.fileMenu.saveLabel,
      click: this.saveFile,
      modifiers: 'cmd',
      key: 's',
    }))
    fileMenu.append(new global.gui.MenuItem({
      label: langConf.fileMenu.saveAsLabel,
      click: () => {
        this.saveFile(true)
      },
      modifiers: 'cmd+shift',
      key: 's',
    }))
    fileMenu.append(new global.gui.MenuItem({
      type: 'separator',
    }))
    fileMenu.append(new global.gui.MenuItem({
      label: langConf.fileMenu.exportPDFLabel,
      click: this.exportPDF,
      modifiers: 'cmd',
      key: 'e',
    }))
    fileMenu.append(new global.gui.MenuItem({
      label: langConf.fileMenu.exportHTMLLabel,
      click: this.exportHTMl,
      modifiers: 'cmd+shift',
      key: 'e',
    }))
    menubar.append(new global.gui.MenuItem({
      label: langConf.winMenu.winLabel,
      submenu: winMenu,
    }))
    menubar.append(new global.gui.MenuItem({
      label: langConf.fileMenu.fileLabel,
      submenu: fileMenu,
    }))
    win.menu = menubar
  },
}
