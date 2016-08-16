'use strict'

const util = require('util')
const assert = require('assert')
const Duplex = require('stream').Duplex

const ChangesResponse = module.exports = function(options) {
  const self = this

  Duplex.call(self, { objectMode: true })

  self._type = options.type || 'normal'
  assert(
    ChangesResponse.SUPPORTED_TYPES.indexOf(self._type) !== -1,
    'only normal and continuous feed type are supported'
  )

  // CouchDB doesn't throw when passed a heartbeat with normal feed type, so
  // we don't either.
  self._heartbeat = options.heartbeat || 60000
  self._lastSeq = options.since || 0
  self._isFirstSeq = true

  if (self._type === 'normal') self.push('{"results":[\n');

  if (self._heartbeat) {
    self._heartbeatInterval = setInterval(self._writeHeartbeat.bind(self), self._heartbeat)
    self.once('finish', function() {
      clearInterval(self._heartbeatInterval)
    })
  }

  if (this._type === 'normal') this.end = ChangesResponse.prototype._normalEnd
}
util.inherits(ChangesResponse, Duplex)

ChangesResponse.SUPPORTED_TYPES = ['continuous', 'normal']

ChangesResponse.prototype._write = function(chunk, encoding, cb) {
  var stringified = JSON.stringify(chunk)

  this._lastSeq = chunk.seq || chunk.last_seq

  if (this._type === 'continuous')
    this.push(stringified + '\n')
  else if (this._type === 'normal') {
    const chunkKeys = Object.keys(chunk)
    // Skip on `last_seq` changes if they are fed to us. This provides us
    // the ability to seemlessly transform a continuous stream with a timeout
    // set into a normal changes response.
    if (chunkKeys.length === 1 && chunkKeys[0] === 'last_seq') return cb()
    if (!this._isFirstSeq) this.push(',\n')
    this.push(stringified)
  }

  this._isFirstSeq = false

  cb()
}

ChangesResponse.prototype._read = function () {}

ChangesResponse.prototype._writeHeartbeat = function() {
  this.push('\n')
}

ChangesResponse.prototype._normalEnd = function (chunk, encoding, cb) {
  var self = this

  function end(err) {
    if (err) return cb(err)
    self.push('\n],\n"last_seq":' + self._lastSeq + '}\n')
    Duplex.prototype.end.call(self, cb)
  }

  if (chunk) self._write(chunk, encoding, end)
  else end()
}
