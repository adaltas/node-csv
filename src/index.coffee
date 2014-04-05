
stream = require 'stream'
util = require 'util'

###

`Stringifier([options])`
-----------------------

Options may include:

*   `columns`       List of fields, applied when `transform` returns an object, order matters, read the transformer documentation for additionnal information, columns are auto discovered when the user write object, see the "header" option on how to print columns names on the first line.
*   `delimiter`     Set the field delimiter, one character only, defaults to `options.from.delimiter` which is a comma.
*   `eof`           Add a linebreak on the last line, default to false, expect a charactere or use '\n' if value is set to "true"
*   `escape`        Defaults to the escape read option.
*   `header`        Display the column names on the first line if the columns option is provided or discovered.   
*   `lineBreaks`    String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).
*   `quote`         Defaults to the quote read option.
*   `quoted`        Boolean, default to false, quote all the fields even if not required.
*   `rowDelimiter`  String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).

###
Stringifier = (options = {}) ->
  # options.objectMode = true
  stream.Transform.call @, options
  @options = options
  @options.delimiter ?= ','
  @options.quote ?= '"'
  @options.quoted ?= false
  @options.escape ?= '"'
  @options.columns ?= null
  @options.header ?= false
  @options.lineBreaks ?= null
  @options.rowDelimiter ?= '\n'
  # Internal usage, state related
  @countWriten ?= 0
  switch @options.rowDelimiter
    when 'auto'
      @options.rowDelimiter = null
    when 'unix'
      @options.rowDelimiter = "\n"
    when 'mac'
      @options.rowDelimiter = "\r"
    when 'windows'
      @options.rowDelimiter = "\r\n"
    when 'unicode'
      @options.rowDelimiter = "\u2028"
  @

util.inherits Stringifier, stream.Transform

Stringifier.prototype.headers = ->
  labels = @options.columns
  # If columns is an object, keys are fields and values are labels
  if typeof labels is 'object' then labels = for k, label of labels then label
  labels = @stringify labels
  stream.Transform.prototype.write.call @, labels

Stringifier.prototype.end = (chunk, encoding, callback)->
  @headers() if @countWriten is 0
  @write @options.rowDelimiter if @options.eof
  stream.Transform.prototype.end.apply @, arguments

Stringifier.prototype.write = (chunk, encoding, callback) ->
  return unless chunk?
  preserve = typeof chunk isnt 'object'
  # Emit and stringiy the record
  unless preserve
    @options.columns ?= Object.keys chunk if @countWriten is 0 and not Array.isArray chunk
    try @emit 'record', chunk, @countWriten
    catch e then return @emit 'error', e
    # Convert the record into a string
    chunk = @stringify chunk
    chunk = @options.rowDelimiter + chunk if @options.header or @countWriten
  # Emit the csv
  chunk = "#{chunk}" if typeof chunk is 'number'
  @headers() if @options.header and @countWriten is 0
  @countWriten++ unless preserve
  stream.Transform.prototype.write.call @, chunk

Stringifier.prototype._transform = (chunk, encoding, callback) ->
  @push chunk
  callback()

###

`Stringifier(line)`
-------------------

Convert a line to a string. Line may be an object, an array or a string.

###
Stringifier.prototype.stringify = (line) ->
  return line if typeof line isnt 'object'
  columns = @options.columns
  columns = Object.keys columns if typeof columns is 'object' and columns isnt null and not Array.isArray columns
  delimiter = @options.delimiter
  quote = @options.quote
  escape = @options.escape
  unless Array.isArray line
    _line = []
    if columns
      for i in [0...columns.length]
        column = columns[i]
        _line[i] = if (typeof line[column] is 'undefined' or line[column] is null) then '' else line[column]
    else
      for column of line
        _line.push line[column]
    line = _line
    _line = null
  else if columns # Note, we used to have @options.columns
    # We are getting an array but the user want specified output columns. In
    # this case, we respect the columns indexes
    line.splice columns.length
  if Array.isArray line
    newLine = ''
    for i in [0...line.length]
      field = line[i]
      if typeof field is 'string'
        # fine 99% of the cases, keep going
      else if typeof field is 'number'
        # Cast number to string
        field = '' + field
      else if typeof field is 'boolean'
        # Cast boolean to string
        field = if field then '1' else ''
      else if field instanceof Date
        # Cast date to timestamp string
        field = '' + field.getTime()
      if field
        containsdelimiter = field.indexOf(delimiter) >= 0
        containsQuote = field.indexOf(quote) >= 0
        containsLinebreak = field.indexOf('\r') >= 0 or field.indexOf('\n') >= 0
        if containsQuote
          regexp = new RegExp(quote,'g')
          field = field.replace(regexp, escape + quote)
        if containsQuote or containsdelimiter or containsLinebreak or @options.quoted
          field = quote + field + quote
        newLine += field
      if i isnt line.length - 1
        newLine += delimiter
    line = newLine
  line

###
`stringify([options])`
`stringify(data, [options], callback)`
###
module.exports = ->
  if arguments.length is 3
    data = arguments[0]
    options = arguments[1]
    callback = arguments[2]
  else if arguments.length is 2
    data = arguments[0]
    callback = arguments[1]
  else if arguments.length is 1
    options = arguments[0]
  options ?= {}
  stringifier = new Stringifier options
  if data and callback
    chunks = []
    stringifier.write d for d in data
    stringifier.on 'readable', ->
      while chunk = stringifier.read()
        chunks.push chunk
    stringifier.on 'error', (err) ->
      callback err
    stringifier.on 'finish', ->
      callback null, chunks.join ''
    stringifier.end()
  stringifier

module.exports.Stringifier = Stringifier
