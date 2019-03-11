module.exports = {
  ok (data) {
    this.body = {
      status: 200,
      message: 'success',
      result: data
    }
  },

  // 用户输入URL直接测试API，直接返回API Response
  mOk (data) {
    this.body = data
  },

  // 500错误 404错误等
  fail (message = 'failure', status = 500) {
    this.body = {
      status,
      message
    }
  }
};