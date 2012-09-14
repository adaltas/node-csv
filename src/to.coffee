
fs = require 'fs'
utils = require './utils'

###

Writing data to a source
--------------------------

The `csv().to` property provide convenient functions to write 
to a csv output like a stream or a file.

###
module.exports = (csv) ->

  ###

  `to.options([options])`: Set or get options
  -------------------------------------------

  Update and retrieve options relative to the writable stream. 
  Return the options as an object if no argument is provided.

  ###
  options: (options) ->
    if options?
      utils.merge csv.options.to, options
      csv
    else
      csv.options.to
  
  ###

  `to.stream(stream, [options])`: Write to a stream
  ---------------------------------------------------

  Take a writable stream as first argument and optionally 
  an object of options as a second argument.
  
  ###
  stream: (stream, options) ->
    @options options
    switch csv.options.to.lineBreaks
      when 'auto'
        csv.options.to.lineBreaks = null
      when 'unix'
        csv.options.to.lineBreaks = "\n"
      when 'mac'
        csv.options.to.lineBreaks = "\r"
      when 'windows'
        csv.options.to.lineBreaks = "\r\n"
      when 'unicode'
        csv.options.to.lineBreaks = "\u2028"
    csv.pipe stream
    stream.on 'error', (e) ->
      csv.error e
    stream.on 'close', ->
      csv.emit 'close', csv.state.count
    csv
  
  ###

  `to.path(path, [options])`: Write to a path
  -------------------------------------------

  Take a file path as first argument and optionally an object of options as a second 
  argument. The `close` event is sent after the file is written. Relying on the `end` event is 
  incorrect because it is sent when parsing is done but before the file is written.
  
  ###
  path: (path, options) ->
    # Merge user provided options
    @options options
    # Clone options
    options = utils.merge {}, csv.options.to
    # Delete end property which otherwise overwrite `stream.end()`
    delete options.end
    # Create the write stream
    stream = fs.createWriteStream path, options
    csv.to.stream stream, null
    csv


