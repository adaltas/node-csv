fs = require 'fs'
path = require 'path'
fs.exists ?= path.exists
utils = require './utils'
Stream = require 'stream'
timers = require 'timers'
# Use process.nextTick when setImmediate isn't there for legacy support of node < 0.10
nextTick = if timers.setImmediate then timers.setImmediate else process.nextTick

###

Reading data from a source
==========================

The `csv().from` property provides functions to read from an external 
source and write to a CSV instance. The source may be a string, a file, 
a buffer or a readable stream.   

You may call the `from` function or one of its sub function. For example, 
here are two identical ways to read from a file:

    csv().from('/tmp/data.csv').on('data', console.log);
    csv().from.path('/tmp/data.csv').on('data', console.log);

###
module.exports = (csv) ->
  
  ###

  `from(mixed)`
  -------------

  Read from any sort of source. It should be considered as a convenient function which 
  will discover the nature of the data source to parse.   

  If the parameter is a string, check if a file of that path exists. If so, read the file contents,
  otherwise, treat the string as CSV data. If the parameter is an instance of `stream`, consider the
  object to be an input stream. If it is an array, then treat each line as a record.   

  Here are some examples on how to use this function:

      csv()
      .from('"1","2","3","4"\n"a","b","c","d"')
      .on('end', function(){ console.log('done') })

      csv()
      .from('./path/to/file.csv')
      .on('end', function(){ console.log('done') })

      csv()
      .from(fs.createReadStream('./path/to/file.csv'))
      .on('end', function(){ console.log('done') })

      csv()
      .from(['"1","2","3","4","5"',['1','2','3','4','5']])
      .on('end', function(){ console.log('done') })

  ###
  from = (mixed, options) ->
    error = false
    switch typeof mixed
      when 'string'
        fs.exists mixed, (exists) ->
          if exists
          then from.path mixed, options
          else from.string mixed, options
      when 'object'
        if Array.isArray mixed
        then from.array mixed, options
        else
          if mixed instanceof Stream
          then from.stream mixed, options
          else error = true
      else
        error = true
    csv.error new Error "Invalid mixed argument in from" if error
    csv

  from.options = (options) ->
    if options?
      utils.merge csv.options.from, options
      csv
    else
      csv.options.from
  
  ###

  `from.array(data, [options])`
  ------------------------------
  
  Read from an array. Take an array as first argument and optionally 
  an object of options as a second argument. Each element of the array 
  represents a CSV record. Those elements may be a string, a buffer, an
  array or an object.

  ###
  from.array = (data, options) ->
    @options options
    nextTick ->
      for record in data
        csv.write record
      csv.end()
    csv
  
  ###
  
  `from.string(data, [options])`
  -------------------------------
  
  Read from a string or a buffer. Take a string as first argument and 
  optionally an object of options as a second argument. The string 
  must be the complete csv data, look at the streaming alternative if your 
  CSV is large.

      csv()
      .from( '"1","2","3","4"\n"a","b","c","d"' )
      .to( function(data){} )
  
  ###
  from.string = (data, options) ->
    @options options
    nextTick ->
      # A string is handle exactly the same way as a single `write` call 
      # which is then closed. This is because the `write` function may receive
      # multiple and incomplete lines.
      csv.write data
      csv.end()
    csv
  
  ###
  
  `from.stream(stream, [options])`
  --------------------------------
  
  Read from a stream. Take a readable stream as first argument and optionally 
  an object of options as a second argument.

  Additionnal options may be defined. See the [`readable.pipe` 
  documentation][srpdo] for additionnal information.
  
  [srpdo]: http://www.nodejs.org/api/stream.html#stream_readable_pipe_destination_options

  ###
  from.stream = (stream, options) ->
    @options options if options
    stream.setEncoding csv.from.options().encoding if stream.setEncoding
    stream.pipe csv, csv.from.options()
    csv
  
  ###
  
  `from.path(path, [options])`
  ----------------------------
  
  Read from a file path. Take a file path as first argument and optionally an object 
  of options as a second argument.

  Additionnal options may be defined with the following default:

      { flags: 'r',
        encoding: null,
        fd: null,
        mode: 0666,
        bufferSize: 64 * 1024,
        autoClose: true }

  See the [`fs.createReadStream` documentation][fscpo] for additionnal information.
  
  [fscpo]: http://www.nodejs.org/api/fs.html#fs_fs_createreadstream_path_options

  ###
  from.path = (path, options) ->
    @options options
    stream = fs.createReadStream path, csv.from.options()
    stream.on 'error', (err) ->
      csv.error err
    csv.from.stream stream

  from


