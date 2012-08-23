
###
Module CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

|-----------|      |---------|---------|       |---------|
|           |      |         |         |       |         |
|           |      |        CSV        |       |         |
|           |      |         |         |       |         |
|  Stream   |      |  Writer |  Reader |       |  Stream |
|  Reader   |.pipe(|   API   |   API   |).pipe(|  Writer |)
|           |      |         |         |       |         |
|           |      |         |         |       |         |
|-----------|      |---------|---------|       |---------|

fs.createReadStream('./in'.pipe(csv()).pipe( fs.createWriteStream('./out'))

###

stream = require 'stream'
state = require './state'
options = require './options'
from = require './from'
to = require './to'
stringify = require './stringify'

module.exports = ->

  CSV = ->
    # A boolean that is true by default, but turns false after an 'error' occurred, 
    # the stream came to an 'end', or destroy() was called. 
    @readable = true
    # A boolean that is true by default, but turns false after an 'error' occurred 
    # or end() / destroy() was called. 
    @writable = true
    @state = state()
    @options = options()
    @from = from @
    @to = to @
    @
  CSV.prototype.__proto__ = stream.prototype

  ###

  `write(data, [preserve])`: Write data
  -------------------------------------

  Implementation of the StreamWriter API with a larger signature. Data
  may be a string, a buffer, an array or an object.

  If data is a string or a buffer, it could span multiple lines. If data 
  is an object or an array, it must represent a single line.
  Preserve is for line which are not considered as CSV data.

  ###
  CSV.prototype.write = (data, preserve) ->
    return unless @writable
    # Parse data if it is a string
    if typeof data is 'string' and not preserve
      return parse data
    # Data is ready if it is an array
    if Array.isArray(data) and not @state.transforming
      @state.line = data
      return transform()
    if @state.count is 0 and @options.to.header is true
      write @options.to.columns or @options.from.columns
    write data, preserve
    if not @state.transforming and not preserve
      @state.count++

  ###

  `end()`: Terminate the parsing
  -------------------------------

  Call this method when no more csv data is to be parsed. It 
  implement the StreamWriter API by setting the `writable` 
  property to "false" and emitting the `end` event.

  ###
  CSV.prototype.end = ->
    return unless @writable
    if @state.quoted
      return error new Error 'Quoted field not terminated'
    # dump open record
    if @state.field or @state.lastC is @options.from.delimiter or @state.lastC is @options.from.quote
      if @options.from.trim or @options.from.rtrim
        @state.field = @state.field.trimRight()
      @state.line.push @state.field
      @state.field = ''
    if @state.line.length > 0
      transform()
    if @writeStream
      if @state.bufferPosition isnt 0
        @writeStream.write @state.buffer.slice 0, @state.bufferPosition
      if @options.to.end
        @writeStream.end()
      else
        @emit 'end', @state.count
        @readable = false
    else
      @emit 'end', @state.count
      @readable = false
  
  ###

  `transform(callback)`: Register the transformer callback
  --------------------------------------------------------

  User provided function call on each line to filter, enrich or modify 
  the dataset. The callback is called asynchronously.

  ###
  CSV.prototype.transform = (callback) ->
    @transformer = callback
    return @
  
  csv = new CSV()
  
  # Private API
  
  ###
  Parse a string which may hold multiple lines.
  Private state object is enriched on each character until 
  transform is called on a new line
  ###
  parse = (chars) ->
    chars = '' + chars
    l = chars.length
    i = 0
    while i < l
      c = chars.charAt(i)
      switch c
        when csv.options.from.escape, csv.options.from.quote
          break if csv.state.commented
          isReallyEscaped = false
          if c is csv.options.from.escape
            # Make sure the escape is really here for escaping:
            # if escape is same as quote, and escape is first char of a field and it's not quoted, then it is a quote
            # next char should be an escape or a quote
            nextChar = chars.charAt(i + 1)
            escapeIsQuoted = csv.options.from.escape is csv.options.from.quote
            isEscaped = nextChar is csv.options.from.escape
            isQuoted = nextChar is csv.options.from.quote
            if not ( escapeIsQuoted and not csv.state.field and not csv.state.quoted ) and ( isEscaped or isQuoted )
              i++
              isReallyEscaped = true
              c = chars.charAt(i)
              csv.state.field += c
          if not isReallyEscaped and c is csv.options.from.quote
            if csv.state.field and not csv.state.quoted
              # Treat quote as a regular character
              csv.state.field += c
              break
            if csv.state.quoted
              # Make sure a closing quote is followed by a delimiter
              nextChar = chars.charAt i + 1
              if nextChar and nextChar isnt '\r' and nextChar isnt '\n' and nextChar isnt csv.options.from.delimiter
                return error new Error 'Invalid closing quote; found ' + JSON.stringify(nextChar) + ' instead of delimiter ' + JSON.stringify(csv.options.from.delimiter)
              csv.state.quoted = false
            else if csv.state.field is ''
              csv.state.quoted = true
        when csv.options.from.delimiter
          break if csv.state.commented
          if csv.state.quoted
            csv.state.field += c
          else
            if csv.options.from.trim or csv.options.from.rtrim
              csv.state.field = csv.state.field.trimRight()
            csv.state.line.push csv.state.field
            csv.state.field = ''
          break
        when '\n', '\r'
          if csv.state.quoted
            csv.state.field += c
            break
          if not csv.options.from.quoted and csv.state.lastC is '\r'
            break
          if csv.options.to.lineBreaks is null
            # Auto-discovery of linebreaks
            csv.options.to.lineBreaks = c + ( if c is '\r' and chars.charAt(i+1) is '\n' then '\n' else '' )
          if csv.options.from.trim or csv.options.from.rtrim
            csv.state.field = csv.state.field.trimRight()
          csv.state.line.push csv.state.field
          csv.state.field = ''
          transform()
        when ' ', '\t'
          if csv.state.quoted or (not csv.options.from.trim and not csv.options.from.ltrim ) or csv.state.field
            csv.state.field += c
            break
        else
          break if csv.state.commented
          csv.state.field += c
      csv.state.lastC = c
      i++
  
  ###
  Called by the `parse` function on each line. It is responsible for 
  transforming the data and finally calling `write`.
  ###
  transform = ->
    line = null
    columns = csv.options.from.columns
    if columns
      # Extract column names from the first line
      if csv.state.count is 0 and columns is true
        csv.options.from.columns = columns = csv.state.line
        csv.state.line = []
        csv.state.lastC = ''
        return
      # Line stored as an object in which keys are column names
      line = {}
      for i in [0...columns.length]
        column = columns[i]
        line[column] = csv.state.line[i] or null
      csv.state.line = line
      line = null
    if csv.transformer
      csv.state.transforming = true
      try
        line = csv.transformer csv.state.line, csv.state.count
      catch e
        return error e
      isObject = typeof line is 'object' and not Array.isArray line
      if csv.options.to.newColumns and not csv.options.to.columns and isObject
        Object.keys(line)
        .filter( (column) -> columns.indexOf(column) is -1 )
        .forEach( (column) -> columns.push(column) )
      csv.state.transforming = false
    else
      line = csv.state.line
    if csv.state.count is 0 and csv.options.to.header is true
      write csv.options.to.columns or columns
    write line
    csv.state.count++
    csv.state.line = []
    csv.state.lastC = ''
  
  ###
  Write a line to the written stream.
  Line may be an object, an array or a string
  Preserve is for line which are not considered as CSV data
  ###
  write = (line, preserve) ->
    if typeof line is 'undefined' or line is null
      return
    if not preserve
      try
        csv.emit 'record', line, csv.state.count
      catch e
        return error e
    line = stringify line, csv
    if csv.state.buffer
      if csv.state.bufferPosition + Buffer.byteLength(line, csv.options.to.encoding) > csv.options.from.bufferSize
        csv.writeStream.write(csv.state.buffer.slice(0, csv.state.bufferPosition))
        # csv.emit 'data', csv.state.buffer.slice(0, csv.state.bufferPosition)
        csv.state.buffer = new Buffer(csv.options.from.bufferSize)
        csv.state.bufferPosition = 0
      csv.state.bufferPosition += csv.state.buffer.write(line, csv.state.bufferPosition, csv.options.to.encoding)
    csv.state.countWriten++ unless preserve
    true

  error = (e) ->
    csv.readable = false
    csv.writable = false
    csv.emit 'error', e
    # Destroy the input stream
    csv.readStream.destroy() if csv.readStream
    e
  
  csv

