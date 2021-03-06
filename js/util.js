/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @util
 */

const path = require('path')
const fs = require('fs')
const i18n = require('./i18n.js')
const system = require('../system.json')

const lang = navigator.language || 'en-US'
const langConf = i18n[lang]

module.exports = {
  // set system.json
  setSystem(obj) {
    if (global.debug) return // prevent nw-dev cause crash
    const systemPath = path.resolve(__dirname, '../system.json')
    const newObj = Object.assign({}, system, obj)
    fs.writeFile(systemPath, JSON.stringify(newObj), err => {
      if (err) {
        console.log(err)
      }
    })
  },
  // closeDialog
  closeDialog() {
    $('#dialog').removeClass('show')
  },
  // show toast
  showToast(text) {
    let timer = null
    timer && (timer = null)
    const toast = $('#toast')
    toast.text(text).addClass('show')
    timer = setTimeout(() => {
      $('#toast').removeClass('show')
    }, 1500)
  },
  // show confirm
  showConfirm(title, content, successCbk, cancelCbk) {
    const confirm = langConf.closeConfirm
    const dialog = $('#dialog')
    cancelCbk || (cancelCbk = this.closeDialog)
    const tpl =
      '<div class="confirm">' +
        `<div class="confirmTitle">${title}</div>` +
        `<div class="confirmContent">${content}</div>` +
        '<div class="confirmBtns">' +
          `<button class="confirmNo">${confirm.noBtn}</button>` +
          `<button class="confirmYes">${confirm.yesBtn}</button>` +
      '</div>'
    dialog.html(tpl).addClass('show')
    dialog.find('.confirmYes').on('click', successCbk)
    dialog.find('.confirmNo').on('click', cancelCbk)
  },
}
