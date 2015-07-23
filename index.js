var util = require('util')
var assert = require('assert')
var Transform = require('stream').Transform

var ChangesResponse = module.exports = function(options) {
  var self = this

  self._type = options.type || 'normal'
  self._heartbeat = options.heartbeat || 60000

  assert(self._type === 'continuous', 'only continuous feed type is supported')

  if (self._heartbeat) {
    self._heartbeatInterval = setInterval(self._writeHeartbeat.bind(self), self._heartbeat)
    self.once('end', function() {
      clearInterval(self._heartbeatInterval)
    })
  }

  Transform.call(self, { objectMode: true })
}
util.inherits(ChangesResponse, Transform)

ChangesResponse.prototype._transform = function(chunk, encoding, cb) {
  if (this._type === 'continuous')
    this.push(JSON.stringify(chunk) + '\n')
  cb()
}

ChangesResponse.prototype._writeHeartbeat = function() {
  this.push('\n')
}
