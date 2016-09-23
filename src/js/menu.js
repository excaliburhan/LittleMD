/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ menu
 */

import editor from './editor.js'
import i18n from './i18n.js'

const gui = window.require('nw.gui')
const path = require('path')
const fs = require('fs')
const pdf = require('phantom-html2pdf')
const lang = navigator.language || 'en-US'
const langFileMenu = i18n[lang].fileMenu
let isSaved = false // tag file status
let currentFilePath = null // current filepath
const htmlTmpPath = path.join(process.cwd(), './htmlTmp.html')
let htmlTmpData = null
const pdfTmpPath = path.join(process.cwd(), './pdfTmp.html')
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

export default {
  // func
  newFile() {
    editor.setTitle('LittleMD.md')
    editor.loadText('')
    isSaved = true
    currentFilePath = null
  },
  openFile() {
    editor.chooseFile('#openFile', filename => {
      editor.loadFile(filename)
      isSaved = true
      currentFilePath = filename
    })
  },
  saveFile(forceSaveAs) {
    const editorDom = $('#editor')
    if (isSaved && !forceSaveAs) { // do save
      fs.writeFile(currentFilePath, editorDom.val(), err => {
        if (err) {
          console.log(err)
          isSaved = false // err might be file deleted
        } else {
          isSaved = true
        }
      })
    } else { // do saveAs
      editor.chooseFile('#saveFile', filename => {
        fs.writeFile(filename, editorDom.val(), err => {
          if (err) {
            console.log(err)
          } else {
            editor.setTitle(filename)
            isSaved = true
            currentFilePath = filename
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
          // $('.test').text('导出成功')
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
      })
    })
  },
  quit() {
    gui.App.quit()
  },

  // init menu
  initMenu() {
    const win = gui.Window.get()
    const menubar = new gui.Menu({ type: 'menubar' })
    const fileMenu = new gui.Menu()

    menubar.createMacBuiltin('LittleMD') // for Mac
    fileMenu.append(new gui.MenuItem({
      label: langFileMenu.newLabel,
      click: this.newFile,
      modifiers: 'cmd',
      key: 'n',
    }))
    fileMenu.append(new gui.MenuItem({
      label: langFileMenu.openLabel,
      click: this.openFile,
      modifiers: 'cmd',
      key: 'o',
    }))
    fileMenu.append(new gui.MenuItem({
      label: langFileMenu.saveLabel,
      click: this.saveFile,
      modifiers: 'cmd',
      key: 's',
    }))
    fileMenu.append(new gui.MenuItem({
      label: langFileMenu.saveAsLabel,
      click: () => {
        this.saveFile(true)
      },
      modifiers: 'cmd+shift',
      key: 's',
    }))
    fileMenu.append(new gui.MenuItem({
      label: langFileMenu.exportPDFLabel,
      click: this.exportPDF,
      modifiers: 'cmd',
      key: 'e',
    }))
    fileMenu.append(new gui.MenuItem({
      label: langFileMenu.exportHTMLLabel,
      click: this.exportHTMl,
      modifiers: 'cmd+shift',
      key: 'e',
    }))
    // fileMenu.append(new gui.MenuItem({
    //   label: langFileMenu.quitLabel,
    //   click: this.quit,
    //   modifiers: 'cmd',
    //   key: 'q',
    // }))
    menubar.append(new gui.MenuItem({
      label: langFileMenu.fileLabel,
      submenu: fileMenu,
    }))
    win.menu = menubar
  },
}
