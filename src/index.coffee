
stream = require 'stream'
util = require 'util'

Transformer = (@options = {}) ->
  @options.objectMode = true
  @options.parallel ?= 100
  stream.Transform.call @, @options
  @transforms = [] # User transformation callback
  @running = 0
  @started = 0
  @finished = 0
  @

util.inherits Transformer, stream.Transform

Transformer.prototype.transform = (options, cb) ->
  if typeof options is 'function'
    cb = options
    options = {}
  @transforms.push cb
  @

Transformer.prototype._transform = (chunk, encoding, cb) ->
  @started++
  @running++
  if @running < @options.parallel
    cb()
    cb = null
  for transform in @transforms
    try
      if transform.length is 2
        transform.call null, chunk, (err, chunk) =>
          @_done err, chunk, cb
      else
        @_done null, transform.call(null, chunk), cb
    catch err then @_done err

Transformer.prototype.end = (chunk, encoding, cb) ->
  @_ending = ->
    stream.Transform.prototype.end.call @, chunk, encoding, cb
  @_ending() if @_ending and @running is 0

Transformer.prototype._done = (err, chunk, cb) ->
  @running--
  if err
    return @emit 'error', err
  @finished++
  @push chunk
  cb() if cb
  @_ending() if @_ending and @running is 0

###
`parse(udf, [options])`
`parse(data, udf, [options], callback)`
###
module.exports = (udf, options) ->
  if arguments.length is 3
    [data, udf, callback] = arguments
  else if arguments.length is 4
    [data, udf, options, callback] = arguments
  transform = new Transformer options
  transform.transform udf
  if callback
    result = []
    error = false
    process.nextTick ->
      for row in data
        break if error
        transform.write row
      transform.end()
    transform.on 'readable', ->
      while(r = transform.read())
        result.push r
    transform.on 'error', (err) ->
      error = true
      callback err
    transform.on 'finish', ->
      callback null, result unless error
  transform


module.exports.Transformer = Transformer

