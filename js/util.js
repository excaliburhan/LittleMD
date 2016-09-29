/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @util
 */

const path = require('path')
const fs = require('fs')
const system = require('../system.json')

module.exports = {
  // set system.json
  setSystem(obj) {
    const newObj = Object.assign({}, system, obj)
    fs.writeFile(path.join(__dirname, './system.json'), JSON.stringify(newObj))
  },

  // closeDialog
  closeDialog() {
    $('#dialog').removeClass('show')
  },
  // show toast
  showToast(text) {
    let timer = null
    timer && (timer = null)
    const dialog = $('#dialog')
    const tpl = `<div class="toast">${text}</div>`
    dialog.html(tpl).addClass('show')
    timer = setTimeout(this.closeDialog, 2000)
  },
  // show confirm
  showConfirm(title, content, successCbk, cancelCbk) {
    const dialog = $('#dialog')
    cancelCbk || (cancelCbk = this.closeDialog)
    const tpl =
      '<div class="confirm">' +
        `<div class="confirmTitle">${title}</div>` +
        `<div class="confirmContent">${content}</div>` +
        '<div class="confirmBtns">' +
          '<button class="confirmNo">取消</button>' +
          '<button class="confirmYes">确定</button>' +
      '</div>'
    dialog.html(tpl).addClass('show')
    dialog.find('.confirmYes').on('click', successCbk)
    dialog.find('.confirmNo').on('click', cancelCbk)
  },
}
