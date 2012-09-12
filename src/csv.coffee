
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
Stringifier = require './Stringifier'
Parser = require './Parser'
transformer = require './transformer'

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
  @parser.on 'row', ( (row) ->
    @transformer.transform row
  ).bind @
  @parser.on 'end', ( ->
    @emit 'end', @state.count
    @readable = false
  ).bind @
  @parser.on 'error', ( (e) ->
    @error e
  ).bind @
  @stringifier = new Stringifier @
  @transformer = transformer @
  @
CSV.prototype.__proto__ = stream.prototype

CSV.prototype.pause = ->
  @paused = true

CSV.prototype.resume = ->
  @paused = false
  @emit 'drain'

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
  return false unless @writable
  # Parse data if it is a string
  if typeof data is 'string' and not preserve
    @parser.parse data
  # Data is ready if it is an array
  else if Array.isArray(data) and not @state.transforming
    @transformer.transform data
  # Write columns
  else
    if @state.count is 0 and @options.to.header is true
      @stringifier.write @options.to.columns or @options.from.columns
    @stringifier.write data, preserve
    if not @state.transforming and not preserve
      @state.count++
  return not @paused

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
  @transformer.callback = callback
  @

###

`error(error)`: Handle error
----------------------------

Unified mechanism to handle error, will emit the error and mark the 
stream as non readable and non writable.

###
CSV.prototype.error = (e) ->
    @readable = false
    @writable = false
    @emit 'error', e
    # Destroy the input stream
    @readStream.destroy() if @readStream
    @

module.exports = -> new CSV

