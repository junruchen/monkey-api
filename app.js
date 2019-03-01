'use strict'

module.exports = app => {
  app.on('error', (err, ctx) => {
    // console.log('app-error----->', err, ctx)
  })
  app.on('request', ctx => {
    // console.log('app-request----->', ctx)
  })
  app.on('response', ctx => {
    // console.log('app-response----->', ctx)
  })
}
