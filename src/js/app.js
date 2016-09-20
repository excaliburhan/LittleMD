/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ entry app
 */

import main from './main.js'
import menu from './menu.js'
import '../css/index.css'

// debug
// const gui = window.require('nw.gui')
// const win = gui.Window.get()
// win.showDevTools()

main.init()
menu.initMenu()
