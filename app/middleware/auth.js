module.exports = options => {
  return async function auth (ctx, next) {
    // 判断用户是否登录
    const user = ctx.session.user
    if (user) {
      await next()
    } else {
      ctx.fail('未登录', 401)
    }
  }
}
