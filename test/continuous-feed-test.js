var assert = require('assert')
var assertCalled = require('assert-called')
var CouchDBChangesResponse = require('../')

var change = {
  id: 'foo',
  changes: [{ rev: '2-578db51f2d332dd53a5ca02cf6ca5b54' }]
}

var stream = new CouchDBChangesResponse({
  type: 'continuous',
  heartbeat: false
})

stream.once('readable', assertCalled(function() {
  var chunk = stream.read()
  assert.equal(chunk.toString(), JSON.stringify(change) + '\n')
}))

stream.end(change)
