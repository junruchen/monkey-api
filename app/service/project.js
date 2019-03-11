/**
 * ctx.curl 发起网络调用。
 * ctx.service.otherService 调用其他 Service。
 * ctx.db 发起数据库调用等， db 可能是其他插件提前挂载到 app 上的模块。
 * */

const Service = require('egg').Service
const { formatKey } = require('../util')

class ProjectService extends Service {
  // 获取项目列表
  async all(params) {
    // TODO: 全部列表数据获取不对！！！！ 关联m_project_user_mid表！！！
    const ctx = this.ctx
    const userId = params.type === 'all' ? '' : ctx.session.user.id
    const sort = params.desc === 'true' ? 'DESC' : 'ASC'
    let whereText = ''
    if (params.search) {
      whereText = `where ( name LIKE'%${params.search}%' or context LIKE'%${params.search}%' )`
    }
    if (userId) {
      whereText = whereText ? whereText + `and creator = '${userId}'` : `where creator = '${userId}'`
    }
    const sql = `select id, name, logo, context, ctime,  \
     (select count(*) from m_apis api where project.id = api.project_id ) apis,  \
     (select count(*) from m_project_user_mid user where project.id = user.project_id ) users  \
     from m_projects project ${whereText} ORDER BY ctime ${sort} LIMIT ${params.start}, ${params.limit};`
    const countSql = `select count(*) count from m_projects ${whereText};`
    const projects = await this.app.mysql.query(sql)
    const count = await this.app.mysql.query(countSql)
    const result = {
      list: projects,
      count: count[0].count
    }
    return result
  }

  // 根据ID查找项目
  // TODO: get charts data
  async find(params) {
    const sql = `select id, name, description, logo, context, ctime, last_modified, creator, \
     (select name from m_users user where user.id = project.creator ) creatorName \
      from m_projects project where id = '${params.id}' ;`
    const projects = await this.app.mysql.query(sql)
    const project = projects[0] || null
    return formatKey(project)
  }

  // 某个项目的API统计信息 
  async apiCounts(params) {
    const sql = `select \
     (select count(*) from m_apis api where project.id = api.project_id ) apis, \
     (select count(*) from m_api_use apiUsed where project.id = apiUsed.project_id ) apiUsedCounts, \
     (select count(*) from m_api_use todayApiUsed where (project.id = todayApiUsed.project_id and todayApiUsed.ctime >= DATE_SUB(CURDATE(),INTERVAL 1 DAY))) apiTodayUsedCounts \
      from m_projects project where id = '${params.id}' ;`
    const projects = await this.app.mysql.query(sql)
    const project = projects[0] || null
    return project
  }

  // 新建项目，创建成功后，自动向m_project_user_mid中增加一条记录
  async save(data) {
    const ctx = this.ctx
    const userId = ctx.session.user.id
    data.creator = userId
    const result = await this.app.mysql.insert('m_projects', data)
    return result
  }

  /* async update (data) {
   data.modifiedAt = this.app.mysql.literals.now
   const result = await this.app.mysql.update('m_projects', data)
   return result
   }

   async delete (id) {
   // 删除时，删除项目的同时，删除该项目下API，并解除与用户的绑定，即m_project_user_mid表数据
   let params = {
   id: id
   }
   const result = await this.app.mysql.update('m_projects', params)
   return result
   } */
}

module.exports = ProjectService
