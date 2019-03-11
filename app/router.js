'use strict'
/**
 * @param {Egg.Application} app - egg application
 * get 获取
 * post 新增
 * put 编辑
 * delete 删除
 *
 * 全局中间件auth判断用户权限
 */

const BASEURL = '/api/'
const USERTESTURL = '/m/'

module.exports = app => {
  const {router, controller} = app
  // 登录相关
  router.post(BASEURL + 'login', controller.system.login)
  router.get(BASEURL + 'logout', controller.system.logout)
  router.get(BASEURL + 'user_info', controller.system.userInfo) // 获取当前登录用户基本信息
  // 文件上传
  router.post(BASEURL + 'uploadImage', controller.file.upload)
  // projects
  router.get(BASEURL + 'projects', controller.project.projects)
  router.post(BASEURL + 'projects', controller.project.newProject)
  // project
  router.get(BASEURL + 'projects/:id', controller.project.findProject)
  router.get(BASEURL + 'projects/apiCounts/:id', controller.project.projectApiCounts)
  // apis
  router.get(BASEURL + 'apis', controller.api.apis)
  router.post(BASEURL + 'apis', controller.api.newApi)
  // api
  router.get(BASEURL + 'apis/:id', controller.api.findApi) // 获取指定API数据
  router.delete(BASEURL + 'apis/:id', controller.api.deleteApi)
  router.put(BASEURL + 'apis', controller.api.editApi)

   // 测试用户自定义接口 URL/m/projectId/context/apipath
   router.all(USERTESTURL + ':projectId/:context/:path*', controller.api.mApi) // 访问用户自定义接口

  //
  // router.put(BASEURL + 'projects/:id', auth(), controller.project.editProject)
  // router.delete(BASEURL + 'projects/:id', auth(), controller.project.delProject)
  // router.post(BASEURL + 'projects/:id/user', auth(), controller.project.newProject) // 项目中添加用户
  // router.delete(BASEURL + 'projects/:id/user/:userId', auth(), controller.project.delProjectUser) // 项目中移除用户
  // apis
  // router.get(BASEURL + 'apis', auth(), controller.api.apis)
  // router.post(BASEURL + 'apis', auth(), controller.api.newApi)
  // router.get(BASEURL + 'apis/:id', auth(), controller.api.findApi)
  // router.put(BASEURL + 'apis/:id', auth(), controller.api.editApi)
  // router.delete(BASEURL + 'apis/:id', auth(), controller.api.delApi)
  // users
  // router.get(BASEURL + 'users', auth(), controller.user.users)
  // router.post(BASEURL + 'users', auth(), controller.user.newUser)
  // router.get(BASEURL + 'users/:id', auth(), controller.system.findUser)
  // router.put(BASEURL + 'users/:id', auth(), controller.system.editUser)
  // router.delete(BASEURL + 'users/:id', auth(), controller.system.delUser)
}
