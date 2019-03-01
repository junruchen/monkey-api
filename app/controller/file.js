'use strict'

const Controller = require('egg').Controller

const sendToWormhole = require('stream-wormhole')
const awaitWriteStream = require('await-stream-ready').write
const fs = require('fs')
const path = require('path')
const {getRandomStr} = require('../util')

class FileController extends Controller {
  async upload () {
    const { ctx } = this
    const stream = await ctx.getFileStream()
    try {
      const filename = getRandomStr() + path.extname(stream.filename)
      const filepath = path.resolve(__dirname, '../public/web', filename)
      const ws = fs.createWriteStream(filepath)
      await awaitWriteStream(stream.pipe(ws))
      ctx.ok({
        imgUrl: 'http://127.0.0.1:7001/public/web/' + filename,
        fields: stream.fields,
        filename: stream.filename
      })
    } catch (err) {
      await sendToWormhole(stream)
      ctx.fail('上传失败')
    }
  }
}

module.exports = FileController
