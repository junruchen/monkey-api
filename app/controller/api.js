'use strict'
const Controller = require('egg').Controller
const { APISTATUS } = require('../util')

class APIController extends Controller {
  // 获取api数据
  async apis() {
    const { ctx } = this
    const params = ctx.request.query
    const apis = await ctx.service.api.all(params)
    ctx.ok(apis)
  }

  // 创建新api
  async newApi() {
    const { ctx } = this
    const body = ctx.request.body
    try {
      ctx.validate({
        projectId: { type: 'string', required: true },
        name: { type: 'string', required: true },
        path: { type: 'string', required: true },
        method: { type: 'string', required: true },
        response: { type: 'string', required: true },
        description: { type: 'string', required: false }
      })
    } catch (error) {
      ctx.fail(error.message)
      return
    }
    const checkParams = {
      path: body.path,
      method: body.method,
      projectId: body.projectId,
    }
    const checkApi = await ctx.service.api.checkPath(checkParams)
    if (checkApi) {
      ctx.fail(body.method + '方法API PATH : ' + body.path + '已存在，不可使用')
      return
    }
    const res = await ctx.service.api.save(body)
    if (res.affectedRows === 1) {
      ctx.ok({ id: res.insertId })
      return
    }
    ctx.fail('创建失败')
  }

  // 获取某个api详细信息
  async findApi() {
    const { ctx } = this
    const apiId = ctx.params.id
    const api = await ctx.service.api.find({ id: apiId })
    if (api) {
      ctx.ok(api)
      return
    }
    ctx.fail('id不存在', APISTATUS.NOMATCH)
  }

  // 删除某个api
  async deleteApi() {
    const { ctx } = this
    const apiId = ctx.params.id
    const res = await ctx.service.api.delete({ id: apiId })
    if (res.affectedRows === 1) {
      ctx.ok('删除成功')
      return
    }
    ctx.fail('id不存在', APISTATUS.NOMATCH)
  }

  // 编辑某个api
  async editApi() {
    const { ctx } = this
    const body = ctx.request.body
    try {
      ctx.validate({
        id: { type: 'number', required: true },
        projectId: { type: 'string', required: true },
        name: { type: 'string', required: true },
        path: { type: 'string', required: true },
        method: { type: 'string', required: true },
        response: { type: 'string', required: true },
        description: { type: 'string', required: false }
      })
    } catch (error) {
      ctx.fail(error.message)
      return
    }
    const checkApi = await ctx.service.api.checkPath(body)
    if (checkApi) {
      ctx.fail(body.method + '方法API PATH : ' + body.path + '已存在，不可使用')
      return
    }
    const res = await ctx.service.api.edit(body)
    if (res.affectedRows === 1) {
      ctx.ok('编辑成功')
      return
    }
    ctx.fail('编辑失败')
  }

  // 用户测试自定义API
  async testApi () {
    const { ctx } = this
    const urlParams = ctx.params
    const params =  {
      path: '/' + urlParams.path,
      projectId: urlParams.projectId,
      method: 'get'
    }
    console.log('params--->', params)
    const api = await ctx.service.api.find(params, 'get') // 使用get方法直接查询API
    if (api) {
      ctx.ok(api)
      return
    }
    ctx.fail('API不存在', APISTATUS.NOMATCH)
  }
}

module.exports = APIController
