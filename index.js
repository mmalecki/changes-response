var util = require('util')
var assert = require('assert')
var Transform = require('stream').Transform

var ChangesResponse = module.exports = function(options) {
  var self = this

  self._type = options.type || 'normal'
  self._heartbeat = options.heartbeat || 60000
  self._include_docs = options.include_docs || false

  assert(self._type === 'continuous', 'only continuous feed type is supported')

  if (self._heartbeat) {
    self._heartbeatInterval = setInterval(self._writeHeartbeat.bind(self), self._heartbeat)
    self.once('finish', function() {
      clearInterval(self._heartbeatInterval)
    })
  }

  Transform.call(self, { objectMode: true })
}
util.inherits(ChangesResponse, Transform)

ChangesResponse.prototype._transform = function(chunk, encoding, cb) {
  if (!this._include_docs && chunk.doc) delete chunk.doc

  if (this._type === 'continuous')
    this.push(JSON.stringify(chunk) + '\n')

  cb()
}

ChangesResponse.prototype._writeHeartbeat = function() {
  this.push('\n')
}
