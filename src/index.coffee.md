
# Stream Transformer

Pass all elements of an array or a stream to transform, filter and add. Features include:   

*   Extends the Node.js "stream.Transform" API.   
*   Both synchrounous and asynchronous support based and user callback 
    arguments signature.   
*   Ability to skip records.   
*   Sequential and concurrent execution using the "parallel" options.

Please look at the [README], the [samples] and the [tests] for additional
information.

    stream = require 'stream'
    util = require 'util'

## Usage

Callback approach, for ease of use:   

`transform(records, [options], handler, callback)`     

Stream API, for maximum of power:   

`transform([records], [options], handler, [callback])`   

    module.exports = ->
      options = {}
      for argument, i in arguments
        type = typeof argument
        if argument is null then type = 'null'
        else if type is 'object' and Array.isArray argument then type = 'array'
        if type is 'array'
          records = argument
        else if type is 'object'
          for k, v of argument then options[k] = v
        else if type is 'function'
          if handler and i is arguments.length - 1
          then callback = argument
          else handler = argument
        else if type isnt 'null'
          throw new Error "Invalid Arguments: got #{JSON.stringify argument} at position #{i}"
      transform = new Transformer options, handler
      error = false
      if records
        process.nextTick ->
          for record in records
            break if error
            transform.write record
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

    Transformer = (@options = {}, @handler) ->
      @options.consume ?= false
      @options.objectMode = true
      @options.parallel ?= 100
      stream.Transform.call @, @options
      @state =
        running: 0
        started: 0
        finished: 0
      @

    util.inherits Transformer, stream.Transform

    module.exports.Transformer = Transformer

    Transformer.prototype._transform = (chunk, encoding, cb) ->
      @state.started++
      @state.running++
      if @state.running < @options.parallel
        cb()
        cb = null
      try
        l = @handler.length
        l-- if @options.params?
        if l is 1 # sync
          @__done null, [@handler.call @, chunk, @options.params], cb
        else if l is 2 # async
          callback = (err, chunks...) => @__done err, chunks, cb
          @handler.call @, chunk, callback, @options.params
        else throw Error "Invalid handler arguments"
        return false
      catch err then @__done err

    Transformer.prototype._flush = (cb) ->
      @_ending = ->
        cb() if @state.running is 0
      @_ending()

    Transformer.prototype.__done = (err, chunks, cb) ->
      @state.running--
      return @emit 'error', err if err
      @state.finished++
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
