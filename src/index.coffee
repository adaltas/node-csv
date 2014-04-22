
stream = require 'stream'
util = require 'util'

###

`generate([options])`: Generate random CSV data
================================================

This function is provided for conveniency in case you need to generate random CSV data.

Note, it is quite simple at the moment, more functionnalities could come later. Feel free
to ask for features and to participate by writting issues and preparing push requests.

Options may include

*   `duration`   
    Period to run in milliseconds, default to 4 minutes.
*   `headers`   
    Define the number of generated fields and the generation 
    method. If headers is an integer, it corresponds to the 
    number of fields. If it is an array, each element correspond 
    to a field. If the element is a function, the function will generate
    the field value, if it is a string, it call the registered 
    function of the same name.
*   `max_word_length`   
    Maximum number of characters per word.
*   `seed`   
    Generate idempotent random characters if a number provided
*   `length`   
    Number of lines to read.   
*   `objectMode`   
    Whether this stream should behave as a stream of objects. Meaning 
    that stream.read(n) returns a single value instead of a Buffer of 
    size n. Default=false   
*   `highWaterMark`   
    The maximum number of bytes to store in the internal buffer 
    before ceasing to read from the underlying resource. Default=16kb

Starting a generation:   

```coffee
generate = require 'csv-generate'
data = []
generator = generate headers: ['int', 'bool'], seed: 1, duration: 1000
generator.on 'readable', ->
  while(d = generator.read())
    data.push d
generator.on 'error', (err) ->
  console.log err.message
generator.on 'end', ->
  console.log data
```

The module is also accessible through the `csv` module:   

```coffee
csv = require 'csv'
csv.generate(seed: 1).pipe(csv.stringify).pipe(process.stdout)
```

###
Generator = (@options = {}) ->
  stream.Readable.call @, @options
  @options.count = 0 # Number of generated lines or records
  @options.duration ?= 4 * 60 * 1000
  @options.headers ?= 8
  @options.max_word_length ?= 16
  @options.fixed_size ?= false
  @options.fixed_size_buffer ?= ''
  @options.start ?= Date.now()
  @options.end ?= null
  @options.seed ?= false
  @options.length ?= -1
  @options.delimiter ?= ','
  @count = 0
  if typeof @options.headers is 'number'
    @options.headers = new Array @options.headers
  for v, i in @options.headers
    v ?= 'ascii'
    @options.headers[i] = Generator[v] if typeof v is 'string'
  @
util.inherits Generator, stream.Readable

###
`random`

Generate a random number between 0 and 1 with 2 decimals.
###
Generator.prototype.random = ->
  if @options.seed
    @options.seed = @options.seed * Math.PI * 100 % 100 / 100
  else
    Math.random()

Generator.prototype.end = ->
  @push null

Generator.prototype._read = (size) ->
  # Already started
  data = []
  length = @options.fixed_size_buffer.length
  data.push @options.fixed_size_buffer if length
  while true
    # Time for some rest: flush first and stop later
    if (@count++ is @options.length) or (@options.end and Date.now() > @options.end)
      # Flush
      if data.length
        if @options.objectMode
          for line in data
            @count++
            @push line
        else
          @count++
          @push data.join ''
      # Stop
      return @push null
    # Create the line
    line = []
    for header in @options.headers
      # Create the field
      line.push "#{header @}"
    # Obtain line length
    if @options.objectMode
      lineLength = 0
      lineLength += column.length for column in line
    else
      # Stringify the line
      line = "#{if @count is 1 then '' else '\n'}#{line.join @options.delimiter}"
      lineLength = line.length
    if length + lineLength > size
      if @options.objectMode
        data.push line
        for line in data
          @count++
          @push line
      else 
        if @options.fixed_size
          @options.fixed_size_buffer = line.substr size - length 
          data.push line.substr 0, size - length
        else
          data.push line
        @count++
        @push data.join ''
      break
    length += lineLength
    data.push line

Generator.ascii = (gen) ->
  # Column
  column = []
  for nb_chars in [0 ... Math.ceil gen.random() * gen.options.max_word_length]
    char = Math.floor gen.random() * 32
    column.push String.fromCharCode char + if char < 16 then 65 else 97 - 16
  column.join ''

Generator.int = (gen) ->
  Math.floor gen.random() * Math.pow(2, 52)

Generator.bool = (gen) ->
  Math.floor gen.random() * 2

###
`generate([options])`
`generate([options], callback)`
###
module.exports = ->
  if arguments.length is 2
    options = arguments[0]
    callback = arguments[1]
  else if arguments.length is 1
    if typeof arguments[0] is 'function'
      options = {}
      callback = arguments[0]
    else 
      options = arguments[0]
  else if arguments.length is 0
    options = {}
  generator = new Generator options
  if callback
    data = []
    generator.on 'readable', ->
      while d = generator.read()
        data.push if options.objectMode then d else d.toString()
    generator.on 'error', callback
    generator.on 'end', ->
      callback null, if options.objectMode then data else data.join ''
  generator
module.exports.Generator = Generator







