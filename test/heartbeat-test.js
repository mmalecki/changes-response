'use strict'

const assert = require('assert')
const async = require('async')
const assertCalled = require('assert-called')
const CouchDBChangesResponse = require('../')

const HEARTBEAT = 100

;['continuous'].forEach((feedType) => {
  const d = Date.now()

  const stream = new CouchDBChangesResponse({
    type: 'continuous',
    heartbeat: HEARTBEAT
  })

  stream.once('readable', assertCalled(() => {
    const chunk = stream.read()
    assert.equal(chunk.toString(), '\n')
    assert(Date.now() - d <= HEARTBEAT * 2)
    stream.end()
  }))
})
