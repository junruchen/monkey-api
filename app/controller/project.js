'use strict'
/**
 * 解析用户的输入，处理后返回相应的结果
 *
 * ctx - 当前请求的 Context 实例。
 * app - 应用的 Application 实例。
 * config - 应用的配置。
 * service - 应用所有的 service。
 * logger - 为当前 controller 封装的 logger 对象。
 *
 * ctx.request.query 获取get请求参数，对于重复的参数，只获取第一个
 * ctx.request.queries 可获取到get请求中重复的参数
 * ctx.request.params 获取router上申明的参数 '/projects/:id'
 * ctx.request.body 获取传递的数据，注意：ctx.body 是 ctx.response.body的简写
 * ctx.request.header 获取整个header对象
 * ctx.get(name) 获取header中的某个字段的值，如果不存在返回空字符串
 * ctx.cookies 获取cookie值
 * ctx.cookies.get(name) 获取cookie某个字段的值
 * ctx.session 访问或者修改session
 * ctx.session[name] 获取session某个字段的值
 * ctx.session = null 删除session
 * 参数校验，使用try catch捕获异常
 * ctx.validate({
 *     title: { type: 'string' },
 *     content: { type: 'string' },
 * })
 * app.js中使用：app.validator.addRule(type, check) 的方式新增自定义规则。
 * app.validator.addRule('json', (rule, value) => {
 *     try {
 *         JSON.parse(value);
 *     } catch (err) {
 *         return 'must be json string';
 *     }
 * })
 * ctx.redirect(url) 重定向
 * ctx.curl(url, options) 可实现http请求
 */

const Controller = require('egg').Controller
const { APISTATUS } = require('../util')

class ProjectController extends Controller {
  // 获取项目列表数据
  async projects () {
    const { ctx } = this
    const params = ctx.request.query
    const projects = await ctx.service.project.all(params)
    ctx.ok(projects)
  }

  // 创建新项目
  async newProject () {
    const { ctx } = this
    const body = ctx.request.body
    try {
      ctx.validate({
        context: { type: 'string', required: true },
        name: { type: 'string', required: true },
        description: { type: 'string', required: false },
        logo: { type: 'string', required: false }
      })
    } catch (error) {
      ctx.fail(error.message)
      return
    }
    const res = await ctx.service.project.save(body)
    if (res.affectedRows === 1) {
      const params = {
        project_id: res.insertId,
        user_id: ctx.session.user.id
      }
      const bindRes = await ctx.service.user.addProductUser(params)
      if (bindRes.affectedRows === 1) {
        ctx.ok({ id: res.insertId })
      }
      return
    }
    ctx.fail('创建失败')
  }

  // 获取某个项目详细信息
  async findProject () {
    const { ctx } = this
    const projectId = ctx.params.id
    const project = await ctx.service.project.find({id: projectId})
    if (project) {
      ctx.ok(project)
      return
    }
    ctx.fail('id不存在', APISTATUS.NOMATCH)
  }

  // 获取某个项目 api 统计信息
  async projectApiCounts () {
    const { ctx } = this
    const projectId = ctx.params.id
    const apiCounts = await ctx.service.project.apiCounts({id: projectId})
    if (apiCounts) {
      ctx.ok(apiCounts)
      return
    }
    ctx.fail('id不存在', APISTATUS.NOMATCH)
  }
}

module.exports = ProjectController
