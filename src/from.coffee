
fs = require 'fs'
utils = require './utils'
Stream = require 'stream'

###

Reading data from a source
--------------------------

The `csv().from` property provide functions to read to a csv input 
like a string, a file, a buffer or a readable stream. You may call
the `from` function or one of its sub function. For example, here is
to identical way to read from a file:

    csv.from('/tmp/data.csv').on('data', console.log);
    csv.from.path('/tmp/data.csv').on('data', console.log);

###
module.exports = (csv) ->
  
  ###

  `from(mixed)`: 
  -------------------------------------------

  Read from any sort of source. A convenient function to discover the source to parse. If it is a string, then if check 
  if it match an existing file path and read the file content, otherwise, it
  treat the string as csv data. If it is an instance of stream, it consider the
  object to be an input stream. If is an array, then for each line should correspond a record.

  Here's some examples on how to use this function

      csv()
      .from('"1","2","3","4","5"')
      .on 'end', console.log 'done'

      csv()
      .from('./path/to/file.csv')
      .on 'end', console.log 'done'

      csv()
      .from(fs.createReadStream './path/to/file.csv')
      .on 'end', console.log 'done'

      csv()
      .from(['"1","2","3","4","5"',['1','2','3','4','5']])
      .on 'end', console.log 'done'

  ###
  from = (mixed) ->
    error = false
    switch typeof mixed
      when 'string'
        fs.exists mixed, (exists) ->
          if exists
          then from.path mixed
          else from.string mixed
      when 'object'
        if Array.isArray mixed
        then from.array mixed
        else
          if mixed instanceof Stream
          then from.stream mixed
          else error = true
      else
        error = true
    csv.error new Error "Invalid mixed argument in from" if error
    csv

  ###

  `from.options([options])`
  -------------------------

  Update and retrieve options relative to the readable stream. 
  Return the options as an object if no argument is provided.

  ###
  from.options = (options) ->
    if options?
      utils.merge csv.options.from, options
      csv
    else
      csv.options.from
  
  ###

  `from.array:(data, [options])`
  ------------------------------
  
  Read from an array. Take an array as first argument and optionally 
  some options as a second argument. Each element of the array  
  represents a csv record. Those elements may be a string, a buffer, an
  array or an object.

  ###
  from.array = (data, options) ->
    @options options
    process.nextTick ->
      for i in [0...data.length]
        csv.write data[i]
      csv.end()
    csv
  
  ###
  
  `from.string:(data, [options])`
  -------------------------------
  
  Read from a string or a buffer. Take a string as first argument and 
  optionally an object of options as a second argument. The string 
  must be the complete csv data, look at the streaming alternative if your 
  CSV is large.
  
  ###
  from.string = (data, options) ->
    @options options
    process.nextTick ->
      # A string is handle exactly the same way as a single `write` call 
      # which is then closed. This is because the `write` function may receive
      # multiple and incomplete lines.
      csv.write data
      csv.end()
    csv
  
  ###
  
  `from.path(path, [options])`
  ----------------------------
  
  Read from a file path. Take a file path as first argument and optionally an object 
  of options as a second argument.
  
  ###
  from.path = (path, options) ->
    @options options
    stream = fs.createReadStream path, csv.from.options()
    stream.setEncoding csv.from.options().encoding
    csv.from.stream stream, null
  
  ###
  
  `from.stream(stream, [options])`
  --------------------------------
  
  Read from a stream. Take a readable stream as first argument and optionally 
  an object of options as a second argument.
  
  ###
  from.stream = (stream, options) ->
    @options options
    stream.on 'data', (data) ->
      csv.write data.toString()
    stream.on 'error', (e) ->
      csv.error e
    stream.on 'end', ->
      csv.end()
    csv.readStream = stream
    csv

  from


