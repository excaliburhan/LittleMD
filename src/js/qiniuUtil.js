/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @qiniu
 */

import config from './config.js'

const qiniu = require('qiniu')
const bucketName = config.qnBucket // bucketName
// your ak && sk
qiniu.conf.ACCESS_KEY = config.qnAk
qiniu.conf.SECRET_KEY = config.qnSk

export default {
  getExt(filePath) {
    const arr = filePath.split('.')
    let ext
    if (arr.length === 1 || (arr[0] === '' && arr.length === 2)) {
      ext = ''
    } else {
      ext = arr.pop().toLowerCase()
    }
    return ext
  },
  getfileName(filePath) {
    const arr = filePath.split('/')
    const filePathWithExt = arr[arr.length - 1]
    const arr2 = filePathWithExt.split('.')
    return arr2[arr2.length - 1]
  },
  getSavePath(filePath) {
    const name = this.getfileName(filePath)
    let ext = this.getExt(filePath)
    const stamp = Date.now()
    ext && (ext = `.${ext}`)
    const path = `${name}-${stamp}${ext}`
    return `${config.qnPrefix}${path}`
  },
  getToken(filePath) {
    const savePath = this.getSavePath(filePath)
    const putPolicy = new qiniu.rs.PutPolicy(`${bucketName}:${savePath}`)
    return putPolicy.token()
  },
  uploadFile(uptoken, savePath, filePath, successCbk, errorCbk) {
    const extra = new qiniu.io.PutExtra()
    qiniu.io.putFile(uptoken, savePath, filePath, extra, (err, ret) => {
      if (err) {
        console.log(err)
        errorCbk && errorCbk(err)
      } else { // success
        console.log(ret.hash, ret.key, ret.persistentId)
        successCbk && successCbk(ret.hash, ret.key, ret.persistentId)
      }
    })
  },
}
