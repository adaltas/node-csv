
# Stream Transformer

Pass all elements of an array or a stream to transform, filter and add. Features include:   

*   Extends the Node.js "stream.Transform" API.   
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

`transform([data], handler, [options])`     

Stream API, for maximum of power:   

`transform([data], [options], handler, [options], [callback])`   

    module.exports = ->
      options = {}
      for argument, i in arguments
        type = typeof argument
        if argument is null then type = 'null'
        else if type is 'object' and Array.isArray argument then type = 'array'
        if i is 0 
          if type is 'function'
            handler = argument
          else if type isnt null
            data = argument
          continue
        if type is 'object'
          for k, v of argument then options[k] = v
        else if type is 'function'
          if handler and i is arguments.length - 1
          then callback = argument
          else handler = argument
        else if type isnt 'null'
          throw new Error 'Invalid arguments'
      transform = new Transformer options, handler
      error = false
      if data
        process.nextTick ->
          for row in data
            break if error
            transform.write row
          transform.end()
      if callback or options.consume
        result = []
        transform.on 'readable', ->
          while(record = transform.read())
            result.push record if callback
        transform.on 'error', (err) ->
          error = true
          callback err if callback
        transform.on 'end', ->
          callback null, result if callback and not error
      transform

## Transformer

Options are documented [here](http://csv.js.org/transform/options/).

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
        l = @transform.length
        l-- if @options.params?
        if l is 1 # sync
          @__done null, [@transform.call @, chunk, @options.params], cb
        else if l is 2 # async
          callback = (err, chunks...) => @__done err, chunks, cb
          @transform.call @, chunk, callback, @options.params
        else throw Error "Invalid handler arguments"
        return false
      catch err then @__done err

    Transformer.prototype._flush = (cb) ->
      @_ending = ->
        cb() if @running is 0
      @_ending()

    Transformer.prototype.__done = (err, chunks, cb) ->
      @running--
      return @emit 'error', err if err
      @finished++
      for chunk in chunks
        chunk = "#{chunk}" if typeof chunk is 'number'
        # We dont push empty string
        # See https://nodejs.org/api/stream.html#stream_readable_push
        @push chunk if chunk? and chunk isnt ''
      cb() if cb
      @_ending() if @_ending

[readme]: https://github.com/wdavidw/node-stream-transform
[samples]: https://github.com/wdavidw/node-stream-transform/tree/master/samples
[tests]: https://github.com/wdavidw/node-stream-transform/tree/master/test
