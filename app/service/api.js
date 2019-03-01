/**
 * ctx.curl 发起网络调用。
 * ctx.service.otherService 调用其他 Service。
 * ctx.db 发起数据库调用等， db 可能是其他插件提前挂载到 app 上的模块。
 * */

const Service = require('egg').Service
const { formatKey, formatField } = require('../util')

class APIService extends Service {
  // 获取API列表
  async all(params) {
    const projectId = params.projectId
    const sort = params.desc === 'true' ? 'DESC' : 'ASC'
    let whereText = `where project_id = '${projectId}'`
    if (params.search) {
      whereText = whereText ? whereText + `and ( name LIKE'%${params.search}%' or method LIKE'%${params.search}%' )` : `where ( name LIKE'%${params.search}%' or method LIKE'%${params.search}%' )`
    }
    const sql = `select id, name, method, path  \
     from m_apis ${whereText} ORDER BY name ${sort} LIMIT ${params.start}, ${params.limit};`
    const countSql = `select count(*) count from m_apis ${whereText};`
    const apis = await this.app.mysql.query(sql)
    const count = await this.app.mysql.query(countSql)
    const result = {
      list: apis,
      count: count[0].count
    }
    return result
  }

  // 根据ID查找单个API
  async find(params, sqlType) {
    params = formatField(params)
    let api
    console.log('------', sqlType)
    if (sqlType === 'get') {
      api = await this.app.mysql.get('m_apis', params)
    } else {
      const sql = `select id, name, path, description, method, response, ctime, last_modified, creator, \
      (select name from m_users user where user.id = api.creator ) creatorName, \
      (select count(*) from m_api_use apiUsed where api.id = apiUsed.api_id ) apiUsedCounts \
       from m_apis api where id = '${params.id}' ;`
     const apis = await this.app.mysql.query(sql)
     api = apis[0] || null
    }
    return formatKey(api)
  }

  // 检查项目内api path是否已经存在
  async checkPath(params) {
    let api
    params = formatField(params)
    if (params.id) {
      let whereText = `where id <> '${params.id}' and path = '${params.path}' and method = '${params.method}' and project_id = '${params.project_id}'`
      const sql = `select * from m_apis ${whereText};`
      const apis = await this.app.mysql.query(sql)
      api = apis[0] || null
    } else {
      // id 不存在时，即新建API时检查
      api = await this.app.mysql.get('m_apis', params)
    }
    return formatKey(api)
  }

  // 新建API
  async save(data) {
    const ctx = this.ctx
    const userId = ctx.session.user.id
    data.creator = userId
    const result = await this.app.mysql.insert('m_apis', formatField(data))
    return result
  }

  // 删除API, 同时删除m_api_use表中的相关数据
  async delete(params) {
    const result = await this.app.mysql.delete('m_apis', params)
    this.app.mysql.delete('m_api_use', { api_id: params.id })
    return result
  }

  // 编辑某个API
  async edit(data) {
    data = formatField(data)
    data.last_modified = this.app.mysql.literals.now
    const result = await this.app.mysql.update('m_apis', data)
    return result
  }
}

module.exports = APIService
