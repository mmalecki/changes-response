'use strict'

const assert = require('assert')
const assertCalled = require('assert-called')
const CouchDBChangesResponse = require('../')

const changes = [
  {
    id: 'foo',
    changes: [{ rev: '2-578db51f2d332dd53a5ca02cf6ca5b54' }],
    seq: 12
  },
  {
    id: 'bar',
    changes: [{ rev: '4-378db51f2d332dd53a5ca02cf6ca5b54' }],
    seq: 14
  }
]

const stream = new CouchDBChangesResponse({
  type: 'normal'
})

const chunks = []

stream.once('readable', assertCalled(() => {
  var chunk
  while ((chunk = stream.read()) && chunks.push(chunk));
}))

stream.once('finish', assertCalled(() => {
  assert.deepEqual(JSON.parse(chunks.join('')), {
    results: changes,
    last_seq: 14
  })
}))

stream.write(changes[0])
stream.end(changes[1])
