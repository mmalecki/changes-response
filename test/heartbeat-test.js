var assert = require('assert')
var async = require('async')
var assertCalled = require('assert-called')
var CouchDBChangesResponse = require('../')

var HEARTBEAT = 100

;['continuous'].forEach(function(feedType) {
  var d = Date.now()

  var stream = new CouchDBChangesResponse({
    type: 'continuous',
    heartbeat: HEARTBEAT
  })

  stream.once('readable', assertCalled(function() {
    var chunk = stream.read()
    assert.equal(chunk.toString(), '\n')
    assert(Date.now() - d <= HEARTBEAT * 2)
    stream.end()
  }))
})
