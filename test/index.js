/* eslint-env mocha */
'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const path = require('path')

// 3rd party
const request = require('request-promise-native')
const assert = require('chai').assert

// lib
const withFileServer = require('../lib')

/* -----------------------------------------------------------------------------
 * test
 * -------------------------------------------------------------------------- */

const fixturesDir = path.join(__dirname, 'fixtures')
const serverOpts = { port: 5005, public: fixturesDir }
const knownUrl = `http://localhost:${serverOpts.port}`

describe('with-fileserver', function () {
  it('should start and stop file server', async () => {
    await withFileServer(serverOpts)(async url => {
      assert.equal(url, knownUrl)
      await request(url)
    })

    try {
      await request(knownUrl)
    } catch (e) {
      return
    }

    throw new Error('Server not stopped')
  })

  it('should resolve with fn result', async () => {
    assert.equal(await withFileServer(serverOpts)(__ => 'result'), 'result')
  })

  it('should reject with fn error', async () => {
    let err

    try {
      await withFileServer(serverOpts)(__ => {
        err = new Error('error')
        throw err
      })
    } catch (e) {
      return assert.equal(e, err)
    }

    throw new Error('Error not rejected')
  })
})
