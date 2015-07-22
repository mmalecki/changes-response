var util = require('util')
var assert = require('assert')
var Transform = require('stream').Transform

var ChangesResponse = module.exports = function(options) {
  this._type = options.type || 'normal'
  assert(this._type === 'continuous', 'only continuous feed type is supported')

  Transform.call(this, { objectMode: true })
}
util.inherits(ChangesResponse, Transform)

ChangesResponse.prototype._transform = function(chunk, encoding, cb) {
  if (this._type === 'continuous')
    this.push(JSON.stringify(chunk) + '\n')
  cb()
}
