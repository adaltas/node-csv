
stream = require 'stream'
util = require 'util'

Stringifier = (options = {}) ->
  # options.objectMode = true
  stream.Transform.call @, options
  @options = options
  @options.delimiter = ','
  @options.quote = '"'
  @options.quoted = false
  @options.escape = '"'
  @options.columns = null
  @options.header = false
  @options.lineBreaks = null
  @options.flags = 'w'
  @options.encoding = 'utf8'
  @options.newColumns = false
  @options.end = true
  @options.eof = false
  # Internal usage, state related
  @count = 0
  @countWriten = 0
  @

util.inherits Stringifier, stream.Transform

Stringifier.prototype.write = (chunk, encoding, callback) ->
  return unless chunk?
  preserve = typeof chunk isnt 'object'
  # Emit and stringiy the record
  unless preserve
    try @emit 'record', chunk, @count - 1
    catch e then return @emit 'error', e
    # Convert the record into a string
    chunk = @stringify chunk
  # Emit the csv
  chunk = "#{chunk}" if typeof chunk is 'number'
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
    newLine = if @countWriten then @options.rowDelimiter or "\n" else ''
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
        containsLinebreak = field.indexOf("\r") >= 0 or field.indexOf("\n") >= 0
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

module.exports = () ->
  new Stringifier()
module.exports.Stringifier = Stringifier
