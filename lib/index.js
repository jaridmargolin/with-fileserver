'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// lib
const http = require('http')

// 3rd party
const handler = require('serve-handler')

/* -----------------------------------------------------------------------------
 * withFileServer
 * -------------------------------------------------------------------------- */

// TODO: Pull this out into standalone pkg
const contextManager = ({ before, after }) => options => async action => {
  const context = {}
  const beforeResult = await before(context, options)

  try {
    const actionResult = await action(beforeResult)
    await after(context, options)
    return actionResult
  } catch (e) {
    await after(context, options)
    throw e
  }
}

const withFileServer = contextManager({
  before: (ctx, { port = 3000, ...opts }) =>
    new Promise(resolve => {
      ctx.server = http.createServer((req, res) => handler(req, res, opts))
      return ctx.server.listen(port, () => resolve(`http://localhost:${port}`))
    }),
  after: ({ server }) =>
    new Promise(resolve => {
      return server.close(() => resolve())
    })
})

module.exports = withFileServer
