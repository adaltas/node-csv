
fs = require 'fs'
utils = require './utils'
{EventEmitter} = require 'events'

###

Writing data to a source
--------------------------

The `to` property provide convenient functions to write some csv output.

###
module.exports = (csv) ->

  ###

  `to.options([options])`: Set or get options
  -------------------------------------------

  Options are:  

  *   `delimiter`   Set the field delimiter, one character only, defaults to `options.from.delimiter` which is a comma.
  *   `quote`       Defaults to the quote read option.
  *   `quoted`      Boolean, default to false, quote all the fields even if not required.
  *   `escape`      Defaults to the escape read option.
  *   `columns`     List of fields, applied when `transform` returns an object, order matters, see the transform and the columns sections below.
  *   `encoding`    Defaults to 'utf8', applied when a writable stream is created.
  *   `header`      Display the column names on the first line if the columns option is provided.

  *   `lineBreaks`  String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).
  *   `flags`       Defaults to 'w', 'w' to create or overwrite an file, 'a' to append to a file. Applied when using the `toPath` method.
  *   `end`         Prevent calling `end` on the destination, so that destination is no longer writable, similar to passing `{end: false}` option in `stream.pipe()`.
  *   `newColumns`  If the `columns` option is not specified (which means columns will be taken from the reader
                    options, will automatically append new columns if they are added during `transform()`.

  ###
  options: (options) ->
    if options?
      utils.merge csv.options.to, options
      # csv.options.to.columns ?= csv.options.from.columns
      # csv.options.to.delimiter ?= csv.options.from.delimiter
      # csv.options.to.quote ?= csv.options.from.quote
      # csv.options.to.escape ?= csv.options.from.escape
      csv
    else
      csv.options.to
  
  ###

  `to.stream(stream, [options])`: Write to a stream
  ---------------------------------------------------

  Take a readable stream as first argument and optionally on object of options as a second argument.
  
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
    # Not all stream emit 'end', for example,
    # fs write stream don't emit 'end' but only 'close'
    # stream.on 'end', (e) ->
    #   csv.emit 'end', csv.state.count
    stream.on 'close', ->
      csv.emit 'close', csv.state.count
    csv
  
  ###

  `to.path(path, [options])`: Write to a path
  ----------------------------------------

  Take a file path as first argument and optionally on object of options as a second 
  argument. The `close` event is sent after the file is written. The `end` event is 
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


