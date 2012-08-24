
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
Parser = require './Parser'

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
    @parser = Parser @
    @parser.on 'row', (row) ->
      transform row
    @parser.on 'end', (->
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
    ).bind @
    @parser.on 'error', (e) ->
      error e
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
      return @parser.parse data
    # Data is ready if it is an array
    if Array.isArray(data) and not @state.transforming
      return transform data
    # console.log 'ok', typeof data
    # Write columns
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
    @parser.end()
  
  ###

  `transform(callback)`: Register the transformer callback
  --------------------------------------------------------

  User provided function call on each line to filter, enrich or modify 
  the dataset. The callback is called asynchronously.

  ###
  CSV.prototype.transform = (callback) ->
    @transformer = callback
    @
  
  csv = new CSV()
  
  # Private API
  
  ###
  Called by the `parse` function on each line. It is responsible for 
  transforming the data and finally calling `write`.
  ###
  transform = (line) ->
    columns = csv.options.from.columns
    if columns
      # Extract column names from the first line
      if csv.state.count is 0 and columns is true
        csv.options.from.columns = columns = line
        return
      # Line stored as an object in which keys are column names
      lineAsObject = {}
      for column, i in columns
        lineAsObject[column] = line[i] or null
      line = lineAsObject
    if csv.transformer
      csv.state.transforming = true
      try line = csv.transformer line, csv.state.count
      catch e then return error e
      isObject = typeof line is 'object' and not Array.isArray line
      if csv.options.to.newColumns and not csv.options.to.columns and isObject
        Object.keys(line)
        .filter( (column) -> columns.indexOf(column) is -1 )
        .forEach( (column) -> columns.push(column) )
      csv.state.transforming = false
    if csv.state.count is 0 and csv.options.to.header is true
      write csv.options.to.columns or columns
    write line
    csv.state.count++
  
  ###
  Write a line to the written stream.
  Line may be an object, an array or a string
  Preserve is for line which are not considered as CSV data
  ###
  write = (line, preserve) ->
    return if typeof line is 'undefined' or line is null
    # Emit the record
    if not preserve
      try csv.emit 'record', line, csv.state.count
      catch e then return error e
      # Convert the record into a string
      line = stringify line, csv
    if csv.state.buffer
      if csv.state.bufferPosition + Buffer.byteLength(line, csv.options.to.encoding) > csv.options.from.bufferSize
        csv.writeStream.write(csv.state.buffer.slice(0, csv.state.bufferPosition))
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

