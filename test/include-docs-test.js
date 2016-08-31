'use strict'

const assert = require('assert')
const assertCalled = require('assert-called')
const CouchDBChangesResponse = require('../')

const change = {
  id: 'foo',
  changes: [{ rev: '2-578db51f2d332dd53a5ca02cf6ca5b54' }],
  doc: { id: 'foo' }
}

const stream = new CouchDBChangesResponse({
  type: 'continuous',
  heartbeat: false,
  includeDocs: false
})

stream.once('readable', assertCalled(() => {
  const chunk = stream.read()
  delete change.doc
  assert.equal(chunk.toString(), JSON.stringify(change) + '\n')
}))

stream.end(change)
