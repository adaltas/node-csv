

# CSV Generator

A Readable Stream for random CSV and data generator. Features include:   

*   Node.js Stream 2 implementation.   
*   Idempotence with the "seed" option.    
*   Framework to generate custom data.   
*   Various option to personnalize the generation.   

Please look at the [README], the [samples] and the [tests] for additional
information.

    stream = require 'stream'
    util = require 'util'

## Usage

Callback approach, for ease of use:   

`generate([options])`   

Stream API, for maximum of power:   

`generate([options], callback)`   

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

## `Generator([options])`

Feel free to ask for new features and to participate by writting issues and 
preparing push requests.

Options may include:   

*   `duration`   
    Period to run in milliseconds, default to 4 minutes.
*   `columns`   
    Define the number of generated fields and the generation 
    method. If columns is an integer, it corresponds to the 
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

All options are optional.

    Generator = (@options = {}) ->
      stream.Readable.call @, @options
      @options.count = 0 # Number of generated lines or records
      @options.duration ?= 4 * 60 * 1000
      @options.columns ?= 8
      @options.max_word_length ?= 16
      @options.fixed_size ?= false
      @fixed_size_buffer ?= ''
      @options.start ?= Date.now()
      @options.end ?= null
      @options.seed ?= false
      @options.length ?= -1
      @options.delimiter ?= ','
      @count_written = 0
      @count_created = 0
      if typeof @options.columns is 'number'
        @options.columns = new Array @options.columns
      for v, i in @options.columns
        v ?= 'ascii'
        @options.columns[i] = Generator[v] if typeof v is 'string'
      @

    util.inherits Generator, stream.Readable
    
    module.exports.Generator = Generator

## `Generator.prototype.random()`

Generate a random number between 0 and 1 with 2 decimals. The function is 
idempotent if it detect the "seed" option.

    Generator.prototype.random = ->
      if @options.seed
        @options.seed = @options.seed * Math.PI * 100 % 100 / 100
      else
        Math.random()

## `Generator.prototype.end()`

Stop the generation.

    Generator.prototype.end = ->
      @push null

## `Generator.prototype._read(size)`

Put new data into the read queue.

    Generator.prototype._read = (size) ->
      # Already started
      data = []
      length = @fixed_size_buffer.length
      data.push @fixed_size_buffer if length
      while true
        # Time for some rest: flush first and stop later
        if (@count_created is @options.length) or (@options.end and Date.now() > @options.end)
          # Flush
          if data.length
            if @options.objectMode
              for line in data
                @count_written++
                @push line
            else
              @count_written++
              @push data.join ''
          # Stop
          return @push null
        # Create the line
        line = []
        for header in @options.columns
          # Create the field
          line.push "#{header @}"
        # Obtain line length
        if @options.objectMode
          lineLength = 0
          lineLength += column.length for column in line
        else
          # Stringify the line
          line = "#{if @count_created is 0 then '' else '\n'}#{line.join @options.delimiter}"
          lineLength = line.length
        @count_created++
        if length + lineLength > size
          if @options.objectMode
            data.push line
            for line in data
              @count_written++
              @push line
          else 
            if @options.fixed_size
              @fixed_size_buffer = line.substr size - length 
              data.push line.substr 0, size - length
            else
              data.push line
            @count_written++
            @push data.join ''
          break
        length += lineLength
        data.push line

## `Generator.ascii(gen)`

Generate an ASCII value.

    Generator.ascii = (gen) ->
      # Column
      column = []
      for nb_chars in [0 ... Math.ceil gen.random() * gen.options.max_word_length]
        char = Math.floor gen.random() * 32
        column.push String.fromCharCode char + if char < 16 then 65 else 97 - 16
      column.join ''

## `Generator.ascii(gen)`

Generate an integer value.

    Generator.int = (gen) ->
      Math.floor gen.random() * Math.pow(2, 52)

## `Generator.bool(gen)`

Generate an boolean value.

    Generator.bool = (gen) ->
      Math.floor gen.random() * 2

[readme]: https://github.com/wdavidw/node-csv-generate
[samples]: https://github.com/wdavidw/node-csv-generate/tree/master/samples
[tests]: https://github.com/wdavidw/node-csv-generate/tree/master/test





