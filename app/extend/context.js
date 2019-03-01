module.exports = {
  ok (data) {
    this.body = {
      status: 200,
      message: 'success',
      result: data
    }
  },

  // 500错误 404错误等
  fail (message = 'failure', status = 500) {
    this.body = {
      status,
      message
    }
  }
};