/**
 * ctx.curl 发起网络调用。
 * ctx.service.otherService 调用其他 Service。
 * ctx.db 发起数据库调用等， db 可能是其他插件提前挂载到 app 上的模块。
 * */

const Service = require('egg').Service

class UserService extends Service {
  // 项目与用户管理
  async addProductUser (data) {
    const result = await this.app.mysql.insert('m_project_user_mid', data)
    return result
  }
}

module.exports = UserService
