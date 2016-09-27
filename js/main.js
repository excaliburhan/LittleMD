/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @ main
 */

const fs = require('fs')
const tabOverride = require('tabOverride')
const editor = require('./editor.js')
const menu = require('./menu.js')
const qiniuUtil = require('./qiniuUtil.js')

const $ = global.$
let scrollTimer = null

module.exports = {
  // func
  scrollSync() {
    scrollTimer && clearTimeout(scrollTimer)
    const divs = $('#editor, #preview')
    const other = divs.not(this).off('scroll').get(0)
    const percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight)
    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight)
    scrollTimer = setTimeout(() => {
      $(other).on('scroll', this.scrollSync)
    }, 200)
  },

  init() {
    menu.initMenu()
    $(() => {
      // file associations
      if (global.gui.App.argv.length > 0) {
        // fix path, cut 'file://'
        const path = decodeURI(global.gui.App.argv[0].substr(7)) // decodeURI for Chinese
        editor.loadFile(path)
      }
      // if app is open, trigger loadFile
      global.gui.App.on('open', path => {
        window.focus()
        path = decodeURI(path.substr(7))
        if (~path.indexOf('.md')) {
          editor.loadFile(path)
        }
      })

      // bind events
      $('body').on('drop dragover', e => { // drag to open file
        e.preventDefault()
        e = e.originalEvent
        if (!e.dataTransfer.files.length) return

        const path = e.dataTransfer.files[0].path
        if (!fs.statSync(path).isDirectory() && ~path.indexOf('.md')) { // open md file only
          editor.loadFile(path)
        }
      })
      $('#editor').bind('input propertychange', () => { // reload
        editor.reload()
      })
      $('body').on('click', 'a', e => { // open url in browser
        e.preventDefault()
        editor.openUrl(e.target.href)
      })
      $('body').on('click', 'img[src=""]', e => { // upload img to qiniu
        const self = $(e.target)
        let idx = -1
        editor.uploadFile('#uploadFile', filename => {
          const savePath = qiniuUtil.getSavePath(filename)
          const uptoken = qiniuUtil.getToken(savePath)
          qiniuUtil.uploadFile(uptoken, savePath, filename, compeletePath => {
            console.log(compeletePath)
            self.attr('data', '1')
            $('img[src=""]').each((index, item) => {
              if ($(item).attr('data') === '1') {
                idx = index
                $(item).attr('src', compeletePath)
                $(item).removeAttr('data')
                const reg = /!\[(\w*)\]\(\)/
                let inputVal = $('#editor').val()
                if (idx === 0) {
                  inputVal = inputVal.replace(reg, `![$1](${compeletePath})`)
                  $('#editor').val(inputVal)
                } else {
                  const regArr = inputVal.match(/!\[(\w*)\]\(\)/g)
                  for (let i = 0; i < idx; i++) {
                    let regStr = ''
                    for (let j = 0; j < regArr[i].length; j++) {
                      regStr += 'z'
                    }
                    inputVal = inputVal.replace(reg, regStr)
                  }
                  const fidx = inputVal.indexOf(regArr[idx])
                  const oriInputVal = $('#editor').val()
                  const beforeVal = oriInputVal.substring(0, fidx - 1)
                  const afterVal = oriInputVal.substring(fidx + regArr[idx].length + 1)
                  const regVal =
                    `\n${oriInputVal.substring(fidx, (fidx + regArr[idx].length) - 1)}` +
                    `${compeletePath})\n`
                  $('#editor').val(beforeVal + regVal + afterVal)
                }
              }
            })
          }, err => {
            console.log(err)
          })
        })
      })
      $('#editor, #preview').on('scroll', this.scrollSync) // scroll

      // tabOverride
      tabOverride.tabSize(4).set($('#editor').get(0))
    })
  },
}
