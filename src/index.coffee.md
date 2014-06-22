
# Stream Transformer

A transform stream to transform object and text. Features include:   

*   Extends the Node.js transform stream API.   
*   Both synchrounous and asynchronous support based and user callback 
    arguments signature.   
*   Ability to skip data.   
*   Sequential and concurrent execution using the "parallel" options.

Please look at the [README], the [samples] and the [tests] for additional
information.

    stream = require 'stream'
    util = require 'util'

## Usage

Callback approach, for ease of use:   

`transform(udf, [options])`     

Stream API, for maximum of power:   

`transform(data, [options], udf, [options], [callback])`   

    module.exports = ->
      options = {}
      for argument, i in arguments
        type = typeof argument
        if argument is null then type = 'null'
        else if type is 'object' and Array.isArray argument then type = 'array'
        if i is 0 
          if type is 'function'
            udf = argument
          else if type isnt null
            data = argument
          continue
        if type is 'object'
          for k, v of argument then options[k] = v
        else if type is 'function'
          if i is arguments.length - 1
          then callback = argument
          else udf = argument
        else if type isnt 'null'
          throw new Error 'Invalid arguments'
      transform = new Transformer options, udf
      error = false
      if data
        process.nextTick ->
          for row in data
            break if error
            transform.write row
          transform.end()
      if callback
        result = []
        transform.on 'readable', ->
          while(r = transform.read())
            result.push r
        transform.on 'error', (err) ->
          error = true
          callback err
        transform.on 'end', ->
          callback null, result unless error
      transform

## Transformer

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

    Transformer = (@options = {}, @transform) ->
      @options.objectMode = true
      @options.parallel ?= 100
      stream.Transform.call @, @options
      @running = 0
      @started = 0
      @finished = 0
      @

    util.inherits Transformer, stream.Transform

    module.exports.Transformer = Transformer

    Transformer.prototype._transform = (chunk, encoding, cb) ->
      @started++
      @running++
      if @running < @options.parallel
        cb()
        cb = null
      try
        if @transform.length is 2
          @transform.call null, chunk, (err, chunks...) =>
            @_done err, chunks, cb
        else
          @_done null, [@transform.call(null, chunk)], cb
      catch err then @_done err

    Transformer.prototype._flush = (cb) ->
      @_ending = ->
        cb() if @running is 0
      @_ending()

    Transformer.prototype._done = (err, chunks, cb) ->
      @running--
      return @emit 'error', err if err
      @finished++
      for chunk in chunks
        chunk = "#{chunk}" if typeof chunk is 'number'
        @push chunk if chunk?
      cb() if cb
      @_ending() if @_ending

[readme]: https://github.com/wdavidw/node-stream-transform
[samples]: https://github.com/wdavidw/node-stream-transform/tree/master/samples
[tests]: https://github.com/wdavidw/node-stream-transform/tree/master/test

