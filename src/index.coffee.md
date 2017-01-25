

# CSV Parser

This module provides a CSV parser tested and used against large datasets. Over
the year, it has been enhance and is now full of useful options.

Please look at the [README], the [project website][site] the [samples] and the
[tests] for additional information.

    stream = require 'stream'
    util = require 'util'
    {StringDecoder} = require 'string_decoder'

## Usage

Callback approach, for ease of use:   

`parse(data, [options], callback)`     

[Node.js Stream API][stream], for maximum of power:   

`parse([options], [callback])`   

    module.exports = ->
      if arguments.length is 3
        data = arguments[0]
        options = arguments[1]
        callback = arguments[2]
        throw Error "Invalid callback argument: #{JSON.stringify callback}" unless typeof callback is 'function'
        return callback Error "Invalid data argument: #{JSON.stringify data}" unless typeof data is 'string' or Buffer.isBuffer arguments[0]
      else if arguments.length is 2
        if typeof arguments[0] is 'string' or Buffer.isBuffer arguments[0]
        then data = arguments[0]
        else options = arguments[0]
        if typeof arguments[1] is 'function'
        then callback = arguments[1]
        else options = arguments[1]
      else if arguments.length is 1
        if typeof arguments[0] is 'function'
        then callback = arguments[0]
        else options = arguments[0]
      options ?= {}
      parser = new Parser options
      if data?
        process.nextTick ->
          parser.write data
          parser.end()
      if callback
        called = false
        chunks = if options.objname then {} else []
        parser.on 'readable', ->
          while chunk = parser.read()
            if options.objname
              chunks[chunk[0]] = chunk[1]
            else
              chunks.push chunk
        parser.on 'error', (err) ->
          called = true
          callback err
        parser.on 'end', ->
          callback null, chunks unless called
      parser

## `Parser([options])`

Options are documented [here](http://csv.adaltas.com/parse/).

    Parser = (options = {}) ->
      options.objectMode = true
      # @options = options
      @options = {}
      for k, v of options
        @options[k] = v
      stream.Transform.call @, @options
      @options.rowDelimiter ?= null
      @options.rowDelimiter = [@options.rowDelimiter] if typeof @options.rowDelimiter is 'string'
      @options.delimiter ?= ','
      @options.quote ?= '"'
      @options.escape ?= '"'
      @options.columns ?= null
      @options.comment ?= ''
      @options.objname ?= false
      @options.trim ?= false
      @options.ltrim ?= false
      @options.rtrim ?= false
      @options.auto_parse ?= false
      @options.auto_parse_date ?= false
      @options.relax ?= false
      @options.relax_column_count ?= false
      @options.skip_empty_lines ?= false
      @options.max_limit_on_data_read ?= 128000
      @options.skip_lines_with_empty_values ?= false
      # Counters
      # lines = count + skipped_line_count + empty_line_count
      @lines = 0 # Number of lines encountered in the source dataset
      @count = 0 # Number of records being processed
      @skipped_line_count = 0 # Number of records skipped due to errors
      @empty_line_count = 0 # Number of empty lines
      # Constants
      @is_int = /^(\-|\+)?([1-9]+[0-9]*)$/
      # @is_float = /^(\-|\+)?([0-9]+(\.[0-9]+)([eE][0-9]+)?|Infinity)$/
      # @is_float = /^(\-|\+)?((([0-9])|([1-9]+[0-9]*))(\.[0-9]+)([eE][0-9]+)?|Infinity)$/
      @is_float = (value) -> (value - parseFloat( value ) + 1) >= 0 # Borrowed from jquery
      # Internal state
      @decoder = new StringDecoder()
      @buf = ''
      @quoting = false
      @commenting = false
      @field = null
      @nextChar = null
      @closingQuote = 0
      @line = [] # Current line being processed
      @chunks = []
      @rawBuf = ''
      @_ = {}
      @_.rowDelimiterLength = Math.max(@options.rowDelimiter.map( (v) -> v.length)...) if @options.rowDelimiter
      @

## Internal API

The Parser implement a [`stream.Transform` class][transform].

### Events

The library extends Node [EventEmitter][event] class and emit all
the events of the Writable and Readable [Stream API][stream]. 

    util.inherits Parser, stream.Transform

For extra flexibility, you can get access to the original Parser
class: `require('csv-parse').Parser`.

    module.exports.Parser = Parser

### `_transform(chunk, encoding, callback)`

*   `chunk` Buffer | String   
    The chunk to be transformed. Will always be a buffer unless the decodeStrings option was set to false.
*   `encoding` String   
    If the chunk is a string, then this is the encoding type. (Ignore if decodeStrings chunk is a buffer.)
*   `callback` Function   
    Call this function (optionally with an error argument) when you are done processing the supplied chunk.

Implementation of the [`stream.Transform` API][transform]

    Parser.prototype._transform = (chunk, encoding, callback) ->
      if chunk instanceof Buffer
        chunk = @decoder.write chunk
      try
        @__write chunk, false
        callback()
      catch err
        this.emit 'error', err

    Parser.prototype._flush = (callback) ->
      try
        @__write @decoder.end(), true
        if @quoting
          this.emit 'error', new Error "Quoted field not terminated at line #{@lines+1}"
          return
        if @line.length > 0
          @__push @line
        callback()
      catch err
        this.emit 'error', err

    Parser.prototype.__push = (line) ->
      return if @options.skip_lines_with_empty_values and line.join('').trim() is ''
      row = null
      if @options.columns is true
        @options.columns = line
        rawBuf = ''
        return
      else if typeof @options.columns is 'function'
        @options.columns = @options.columns line
        rawBuf = ''
        return
      if not @line_length and line.length > 0
        @line_length = if @options.columns then @options.columns.length else line.length
      # Dont check column count on empty lines
      if (line.length is 1 and line[0] is '')
        @empty_line_count++
      else if line.length isnt @line_length
        # Dont check column count with relax_column_count
        if @options.relax_column_count
          @skipped_line_count++
        else if @options.columns?
          throw Error "Number of columns on line #{@lines} does not match header"
        else
          throw Error "Number of columns is inconsistent on line #{@lines}"
      else
        @count++
      if @options.columns?
        lineAsColumns = {}
        for field, i in line
          continue if this.options.columns[i] is false
          lineAsColumns[@options.columns[i]] = field
        if @options.objname
          row = [lineAsColumns[@options.objname], lineAsColumns]
        else
          row = lineAsColumns
      else
        row = line
      return if @count < @options.from
      return if @count > @options.to
      if @options.raw
        @push { raw: @rawBuf, row: row }
        @rawBuf = ''
      else
        @push row

    Parser.prototype.__write =  (chars, end) ->
      is_int = (value) =>
        if typeof @is_int is 'function'
          @is_int value
        else
          @is_int.test value
      is_float = (value) =>
        if typeof @is_float is 'function'
          @is_float value
        else
          @is_float.test value
      auto_parse = (value) =>
        if @options.auto_parse and is_int value
          value = parseInt value
        else if @options.auto_parse and is_float value
          value = parseFloat value
        else if @options.auto_parse and @options.auto_parse_date
          m = Date.parse value
          value = new Date m unless isNaN m
        value
      ltrim = @options.trim or @options.ltrim
      rtrim = @options.trim or @options.rtrim
      chars = @buf + chars
      l = chars.length
      i = 0
      # Strip BOM header
      i++ if @lines is 0 and 0xFEFF is chars.charCodeAt 0
      while i < l
        # Ensure we get enough space to look ahead
        if not end
          remainingBuffer = chars.substr(i, l - i)
          break if (
            # Skip if the remaining buffer can be comment
            (not @commenting and l - i < @options.comment.length and @options.comment.substr(0, l - i) is remainingBuffer) or
            # Skip if the remaining buffer can be row delimiter
            (@options.rowDelimiter and l - i < @_.rowDelimiterLength and @options.rowDelimiter.some( (rd) -> rd.substr(0, l - i) is remainingBuffer)) or
            # Skip if the remaining buffer can be row delimiter following the closing quote
            (@options.rowDelimiter and @quoting and l - i < (@options.quote.length + @_.rowDelimiterLength) and @options.rowDelimiter.some((rd) => (@options.quote + rd).substr(0, l - i) is remainingBuffer)) or
            # Skip if the remaining buffer can be delimiter
            (l - i <= @options.delimiter.length and @options.delimiter.substr(0, l - i) is remainingBuffer) or
            # Skip if the remaining buffer can be escape sequence
            (l - i <= @options.escape.length and @options.escape.substr(0, l - i) is remainingBuffer)
          )
        char = if @nextChar then @nextChar else chars.charAt i
        @nextChar = if l > i + 1 then chars.charAt(i + 1) else ''
        @rawBuf += char if @options.raw
        # Auto discovery of rowDelimiter, unix, mac and windows supported
        unless @options.rowDelimiter?
          # First empty line
          if (not @quoting) and (char is '\n' or char is '\r')
            rowDelimiter = char
            nextCharPos = i+1
          else if @nextChar is '\n' or @nextChar is '\r'
            rowDelimiter = @nextChar
            nextCharPos = i+2
            if @raw
              rawBuf += @nextChar
          if rowDelimiter
            rowDelimiter += '\n' if rowDelimiter is '\r' and chars.charAt(nextCharPos) is '\n'
            @options.rowDelimiter = [rowDelimiter]
            @_.rowDelimiterLength = rowDelimiter.length
        # Parse that damn char
        # Note, shouldn't we have sth like chars.substr(i, @options.escape.length)
        if not @commenting and char is @options.escape
          # Make sure the escape is really here for escaping:
          # If escape is same as quote, and escape is first char of a field 
          # and it's not quoted, then it is a quote
          # Next char should be an escape or a quote
          escapeIsQuote = @options.escape is @options.quote
          isEscape = @nextChar is @options.escape
          isQuote = @nextChar is @options.quote
          if not ( escapeIsQuote and not @field? and not @quoting ) and ( isEscape or isQuote )
            i++
            char = @nextChar
            @nextChar = chars.charAt i + 1
            @field = '' unless @field?
            @field += char
            # Since we're skipping the next one, better add it now if in raw mode.
            if @options.raw
              @rawBuf += char
            i++
            continue
        if not @commenting and char is @options.quote
          if @quoting
            # Make sure a closing quote is followed by a delimiter
            # If we have a next character and 
            # it isnt a rowDelimiter and 
            # it isnt an column delimiter and
            # it isnt the begining of a comment
            # Otherwise, if this is not "relax" mode, throw an error
            areNextCharsRowDelimiters = @options.rowDelimiter and @options.rowDelimiter.some((rd) -> chars.substr(i+1, rd.length) is rd)
            areNextCharsDelimiter = chars.substr(i+1, @options.delimiter.length) is @options.delimiter
            isNextCharAComment = @nextChar is @options.comment
            if @nextChar and not areNextCharsRowDelimiters and not areNextCharsDelimiter and not isNextCharAComment
              if @options.relax
                @quoting = false
                @field = "#{@options.quote}#{@field}"
              else
                throw Error "Invalid closing quote at line #{@lines+1}; found #{JSON.stringify(@nextChar)} instead of delimiter #{JSON.stringify(@options.delimiter)}"
            else
              @quoting = false
              @closingQuote = @options.quote.length
              i++
              if end and i is l
                @line.push auto_parse @field or ''
                @field = null
              continue
          else if not @field
            @quoting = true
            i++
            continue
          else if @field? and not @options.relax
            throw Error "Invalid opening quote at line #{@lines+1}"
        # Otherwise, treat quote as a regular character
        isRowDelimiter = (@options.rowDelimiter and @options.rowDelimiter.some((rd)-> chars.substr(i, rd.length) is rd))
        isRowDelimiterLength = @options.rowDelimiter.filter((rd)-> chars.substr(i, rd.length) is rd)[0].length if isRowDelimiter
        @lines++ if isRowDelimiter or (end and i is l - 1)
        # Set the commenting flag
        wasCommenting = false
        if not @commenting and not @quoting and @options.comment and chars.substr(i, @options.comment.length) is @options.comment
          @commenting = true
        else if @commenting and isRowDelimiter
          wasCommenting = true
          @commenting = false
        isDelimiter = chars.substr(i, @options.delimiter.length) is @options.delimiter
        if not @commenting and not @quoting and (isDelimiter or isRowDelimiter)
          # Empty lines
          if isRowDelimiter and @line.length is 0 and not @field?
            if wasCommenting or @options.skip_empty_lines
              i += isRowDelimiterLength
              @nextChar = chars.charAt i
              continue
          if rtrim
            @field = @field?.trimRight() unless @closingQuote
          @line.push auto_parse @field or ''
          @closingQuote = 0
          @field = null
          if isDelimiter # End of field
            i += @options.delimiter.length
            @nextChar = chars.charAt i
            if end and not @nextChar
              isRowDelimiter = true
              @line.push ''
          if isRowDelimiter
            @__push @line
            # Some cleanup for the next row
            @line = []
            i += isRowDelimiterLength
            @nextChar = chars.charAt i
            continue
        else if not @commenting and not @quoting and (char is ' ' or char is '\t')
          # Left trim unless we are quoting or field already filled
          @field = '' unless @field?
          @field += char unless ltrim and not @field
          i++
        else if not @commenting
          @field = '' unless @field?
          @field += char
          i++
        else
          i++
        if not @commenting and @field?.length > @options.max_limit_on_data_read
          throw Error "Delimiter not found in the file #{JSON.stringify(@options.delimiter)}"
        if not @commenting and @line?.length > @options.max_limit_on_data_read
          throw Error "Row delimiter not found in the file #{JSON.stringify(@options.rowDelimiter)}"
      # Flush remaining fields and lines
      if end
        if @field?
          if rtrim
            @field = @field?.trimRight() unless @closingQuote
          @line.push auto_parse @field or ''
          @field = null
        if @field?.length > @options.max_limit_on_data_read
          throw Error "Delimiter not found in the file #{JSON.stringify(@options.delimiter)}"
        if l is 0
          @lines++
        if @line.length > @options.max_limit_on_data_read
          throw Error "Row delimiter not found in the file #{JSON.stringify(@options.rowDelimiter)}"
      # Store un-parsed chars for next call
      @buf = ''
      while i < l
        @buf += chars.charAt i
        i++

[readme]: https://github.com/wdavidw/node-csv-parse
[site]: http://csv.adaltas.com/parse/
[samples]: https://github.com/wdavidw/node-csv-parse/tree/master/samples
[tests]: https://github.com/wdavidw/node-csv-parse/tree/master/test
[stream]: (http://nodejs.org/api/stream.html
[transform]: (http://nodejs.org/api/stream.html#stream_class_stream_transform_1)
