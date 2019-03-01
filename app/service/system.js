/**
 * ctx.curl 发起网络调用。
 * ctx.service.otherService 调用其他 Service。
 * ctx.db 发起数据库调用等， db 可能是其他插件提前挂载到 app 上的模块。
 * */

const Service = require('egg').Service

class SystemService extends Service {
  // 登录，判断是否存在该用户
  async login (account, password) {
    const sql = `select id from m_users where ( name = '${account}' or email = '${account}' ) and password = '${password}';`
    const user = await this.app.mysql.query(sql)
    return user
  }

  // 查找指定用户信息
  async find (id) {
    // 根据 id 从数据库获取项目详细信息
    let params = {
      where: { id: id },
      columns: ['id', 'name', 'email', 'avatar']
    }
    const user = await this.app.mysql.select('m_users', params)
    return user[0]
  }
}

module.exports = SystemService
