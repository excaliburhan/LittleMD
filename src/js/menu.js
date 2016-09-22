/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ menu
 */

import editor from './editor.js'
import i18n from './i18n.js'

const gui = window.require('nw.gui')
const lang = navigator.language || 'en-US'
const langFileMenu = i18n[lang].fileMenu
let isSaved = false // tag file status
let filePath = null

export default {
  // func
  newFile() {
    editor.loadText('')
  },
  openFile() {
    editor.chooseFile('#openFile', filename => {
      editor.loadFile(filename)
      isSaved = true
      filePath = filename
    })
  },
  saveFile(forceSaveAs) {
    const fs = require('fs')
    const editorDom = $('#editor')
    if (isSaved && !forceSaveAs) { // do save
      fs.writeFile(filePath, editorDom.val(), err => {
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
            isSaved = true
            filePath = filename
          }
        })
      })
    }
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
      click: () => {},
      modifiers: 'cmd',
      key: 'e',
    }))
    fileMenu.append(new gui.MenuItem({
      label: langFileMenu.exportHTMLLabel,
      click: () => {},
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

  // init shortcut
  initShortcut() {
    const keyMaps = [
      {
        key: 'Command+N',
        active: this.newFile,
        failed: err => console.log(err),
      },
      {
        key: 'Command+O',
        active: this.openFile,
        failed: err => console.log(err),
      },
      {
        key: 'Command+S',
        active: this.saveFile,
        failed: err => console.log(err),
      },
      {
        key: 'Command+Shift+S',
        active: () => {
          this.saveFile(true)
        },
        failed: err => console.log(err),
      },
      // {
      //   key: 'Command+Q',
      //   active: this.quit,
      //   failed: err => console.log(err),
      // },
    ]
    keyMaps.forEach(option => {
      const shortcut = new nw.Shortcut(option)
      nw.App.registerGlobalHotKey(shortcut)
    })
  },
}
