
stream = require 'stream'
util = require 'util'

###

# Transformer

Options include:

*   `parallel` (number)   
     The number of transformation callbacks to run in parallel, default to "100".

Available properties:

*    `transform.running`   
      The number of transformation callback being run at a given time.   
*    `transform.started`   
      The number of transformation callback which have been initiated.   
*    `transform.running`   
      The number of transformation callback which have been executed.   

Using the async mode present the advantage that more than one record may be 
emitted per transform callback.
###

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

Transformer.prototype.register = (options, cb) ->
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
        transform.call null, chunk, (err, chunks...) =>
          @_done err, chunks, cb
      else
        @_done null, [transform.call(null, chunk)], cb
    catch err then @_done err

Transformer.prototype.end = (chunk, encoding, cb) ->
  @_ending = ->
    stream.Transform.prototype.end.call @, chunk, encoding, cb
  @_ending() if @_ending and @running is 0

Transformer.prototype._done = (err, chunks, cb) ->
  @running--
  if err
    return @emit 'error', err
  @finished++
  for chunk in chunks
    chunk = "#{chunk}" if typeof chunk is 'number'
    @push chunk if chunk?
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
  transform.register udf
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

