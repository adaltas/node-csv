
stream = require 'stream'
util = require 'util'

###

`produce([options])`: Generate random CSV data
================================================

This function is provided for conveniency in case you need to generate random CSV data.

Note, it is quite simple at the moment, more functionnalities could come later. The code 
originates from "./samples/perf.coffee" and was later extracted in case other persons need 
its functionnalities.

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
    Number of line to read.

Starting a generation

    csv = require 'csv'
    producer = csv.producer seed: 1
    producer().pipe csv().to.path "#{__dirname}/perf.out"

###
Producer = (@options = {}) ->
  stream.Readable.call @, @options
  @options.duration ?= 4 * 60 * 1000
  @options.headers ?= 8
  @options.max_word_length ?= 16
  @options.fixed_size ?= false
  @options.fixed_size_buffer ?= ''
  @options.start ?= Date.now()
  @options.end ?= null
  @options.seed ?= false
  @options.length ?= -1
  @count = 0
  if typeof @options.headers is 'number'
    @options.headers = new Array @options.headers
  for v, i in @options.headers
    v ?= 'ascii'
    @options.headers[i] = Producer[v] if typeof v is 'string'
  @
util.inherits Producer, stream.Readable

Producer.prototype.random = ->
  if @options.seed
    @options.seed = @options.seed * Math.PI * 100 % 100 / 100
  else
    Math.random()

Producer.prototype.end = ->
  @push null

# Producer.prototype._read = (size) ->
#   # Already started
#   length = @options.fixed_size_buffer.length
#   @push @options.fixed_size_buffer if length
#   while true
#     return @end() if @count++ is @options.length
#     return @end() if  @options.end and Date.now() > @options.end
#     # Create the line
#     line = []
#     for header in @options.headers
#       # Create the field
#       line.push header @
#     # Convert the line to a string
#     line = "#{if @count is 1 then '' else '\n'}#{line.join ','}"
#     if length + line.length > size
#       if @options.fixed_size
#         @options.fixed_size_buffer = line.substr size - length 
#         @push line.substr 0, size - length
#       else
#         @push line
#       break
#     length += line.length
#     @push line

Producer.prototype._read = (size) ->
  # console.log 'GENERATE', size
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
            @push line
        else
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
      line = "#{if @count is 1 then '' else '\n'}#{line.join ','}"
      lineLength = line.length
    if length + lineLength > size
      if @options.objectMode
        data.push line
        for line in data
          @push line
      else 
        if @options.fixed_size
          @options.fixed_size_buffer = line.substr size - length 
          data.push line.substr 0, size - length
        else
          data.push line
        @push data.join ''
      break
    length += lineLength
    data.push line

Producer.ascii = (gen) ->
  # Column
  column = []
  for nb_chars in [0 ... Math.ceil gen.random() * gen.options.max_word_length]
    char = Math.floor gen.random() * 32
    column.push String.fromCharCode char + if char < 16 then 65 else 97 - 16
  column.join ''

Producer.int = (gen) ->
  Math.floor gen.random() * Math.pow(2, 52)

Producer.bool = (gen) ->
  Math.floor gen.random() * 2

module.exports = (options) -> new Producer options
module.exports.Producer = Producer
