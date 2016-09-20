/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ menu
 */

import $ from 'jquery'
import editor from './editor.js'

const gui = window.require('nw.gui')

export default {
  initMenu() {
    const win = gui.Window.get()
    const menubar = new gui.Menu({ type: 'menubar' })
    const fileMenu = new gui.Menu()

    menubar.createMacBuiltin('LittleMD') // for Mac
    fileMenu.append(new gui.MenuItem({
      label: 'New',
      click: () => {
        editor.loadText('')
      },
    }))
    fileMenu.append(new gui.MenuItem({
      label: 'Open',
      click: () => {
        editor.chooseFile('#openFile', filename => {
          editor.loadFile(filename)
        })
      },
    }))
    fileMenu.append(new gui.MenuItem({
      label: 'Save',
      click: () => {
        editor.chooseFile('#saveFile', filename => {
          const fs = require('fs')
          const editorDom = $('#editor .editorArea')
          fs.writeFile(filename, editorDom.val(), err => {
            if (err) {
              console.log(err)
            } else {
              console.log('file saved')
            }
          })
        })
      },
    }))
    fileMenu.append(new gui.MenuItem({
      label: 'Quit',
      click: () => {
        gui.App.quit()
      },
    }))
    menubar.append(new gui.MenuItem({
      label: 'File',
      submenu: fileMenu,
    }))
    win.menu = menubar
  },
}
