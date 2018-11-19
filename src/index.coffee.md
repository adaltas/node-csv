

# CSV Generator

Please look at the [documentation](https://csv.js.org/generate/) for additional information.

    stream = require 'stream'
    util = require 'util'

## Usage  

Stream API, for maximum of power:

`generate([options])`

Callback approach, for ease of use:

`generate([options], callback)`

## Source Code

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
            data.push d
        generator.on 'error', callback
        generator.on 'end', ->
          unless generator.options.objectMode
            if generator.options.encoding
              data = data.join ''
            else
              data = Buffer.concat data
          callback null, data
      generator

## `Generator([options])`

Feel free to ask for new features and to participate by writting issues and preparing push requests.

Options are documented [here](http://csv.js.org/generate/options/).

    Generator = (options = {}) ->
      stream.Readable.call @, options
      # Clone and camelize options
      @options = {}
      for k, v of options
        @options[Generator.camelize k] = v
      # Normalize options
      @options.columns ?= 8
      @options.maxWordLength ?= 16
      @options.fixedSize ?= false
      @options.end ?= null
      @options.duration ?= null
      @options.seed ?= false
      @options.length ?= -1
      @options.delimiter ?= ','
      @options.rowDelimiter ?= '\n'
      @options.eof ?= false
      @options.eof = @options.rowDelimiter if @options.eof is true
      # State
      @_ =
        start_time: Date.now()
        fixed_size_buffer: ''
        count_written: 0
        count_created: 0
      if typeof @options.columns is 'number'
        @options.columns = new Array @options.columns
      accepted_header_types = Object.keys(Generator).filter( (t) -> t not in ['super_', 'camelize'])
      for v, i in @options.columns
        v ?= 'ascii'
        if typeof v is 'string'
          throw Error "Invalid column type: got \"#{v}\", default values are #{JSON.stringify accepted_header_types}" unless v in accepted_header_types
          @options.columns[i] = Generator[v]
      @

    util.inherits Generator, stream.Readable
    
    module.exports.Generator = Generator

## `Generator.prototype.random()`

Generate a random number between 0 and 1 with 2 decimals. The function is idempotent if it detect the "seed" option.

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
      length = @_.fixed_size_buffer.length
      data.push @_.fixed_size_buffer if length
      while true
        # Time for some rest: flush first and stop later
        if (@_.count_created is @options.length) or (@options.end and Date.now() > @options.end) or (@options.duration and Date.now() > @_.start_time + @options.duration)
          # Flush
          if data.length
            if @options.objectMode
              for line in data
                @_.count_written++
                @push line
            else
              @_.count_written++
              @push data.join('') + if @options.eof then @options.eof else ''
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
          line = "#{if @_.count_created is 0 then '' else @options.rowDelimiter}#{line.join @options.delimiter}"
          lineLength = line.length
        @_.count_created++
        if length + lineLength > size
          if @options.objectMode
            data.push line
            for line in data
              @_.count_written++
              @__push line
          else
            if @options.fixedSize
              @_.fixed_size_buffer = line.substr size - length 
              data.push line.substr 0, size - length
            else
              data.push line
            @_.count_written++
            @__push data.join ''
          break
        length += lineLength
        data.push line

## `Generator.prototype._read(size)`

Put new data into the read queue.

    Generator.prototype.__push = (record) ->
      if @options.sleep
        setTimeout =>
          @push record
        , @options.sleep
      else
        @push record

## `Generator.ascii(gen)`

Generate an ASCII value.

    Generator.ascii = (gen) ->
      # Column
      column = []
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

## `Generator.camelize`

    Generator.camelize = (str) ->
      str.replace /_([a-z])/gi, (_, match, index) ->
        match.toUpperCase()
