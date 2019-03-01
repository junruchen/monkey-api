'use strict'

const Controller = require('egg').Controller
const ms = require('ms')
const { APISTATUS } = require('../util')

class SystemController extends Controller {
  // 登录接口， rotateCsrfSecret 刷新用户的 CSRF token
  // 默认有效期为1天，如果用户勾选了 `记住我`，设置 30 天的过期时间
  async login () {
    const { ctx } = this
    const { account, password, rememberMe = false } = ctx.request.body
    try {
      ctx.validate({
        account: { type: 'string', required: true },
        password: { type: 'string', required: true },
        rememberMe: { type: 'bool', required: false }
      })
    } catch (error) {
      ctx.fail(error.message)
      return
    }
    const user = await this.service.system.login(account, password)
    if (user.length === 0) {
      this.ctx.fail('您输入的密码和账户名不匹配')
      return
    }
    ctx.session.user = user[0]
    if (rememberMe) ctx.session.maxAge = ms('30d')
    ctx.rotateCsrfSecret()
    ctx.ok()
  }

  // 获取当前登录用户的基本信息
  async userInfo () {
    const { ctx } = this
    const userId = ctx.session.user.id
    if (!userId) {
      this.ctx.fail('未登录', APISTATUS.UNAUTHORIZED)
      return
    }
    const user = await this.service.system.find(userId)
    ctx.ok(user)
  }

  // 退出登录接口，清空session
  async logout () {
    const { ctx } = this
    ctx.session.user = null
    ctx.ok()
  }
}

module.exports = SystemController
