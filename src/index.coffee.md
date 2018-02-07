
# CSV Parser

This module provides a CSV parser tested and used against large datasets. Over
the year, it has been enhance and is now full of useful options.

Please look at the [README], the [project website][site] the [samples] and the
[tests] for additional information.

    stream = require 'stream'
    util = require 'util'
    StringDecoder = require('string_decoder').StringDecoder

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
        # 1st arg is data:string or options:object
        if typeof arguments[0] is 'string' or Buffer.isBuffer arguments[0]
          data = arguments[0]
        else if isObjLiteral arguments[0]
          options = arguments[0]
        else
          err = "Invalid first argument: #{JSON.stringify arguments[0]}"
        # 2nd arg is options:object or callback:function
        if typeof arguments[1] is 'function'
          callback = arguments[1]
        else if isObjLiteral arguments[1]
          if options
          then err = 'Invalid arguments: got options twice as first and second arguments'
          else options = arguments[1]
        else
          err = "Invalid first argument: #{JSON.stringify arguments[1]}"
        if err
          unless callback
          then throw Error err
          else return callback Error err
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
      # @options = options
      @options = {}
      for k, v of options
        @options[k] = v
      @options.objectMode = true
      stream.Transform.call @, @options
      @options.rowDelimiter ?= null
      @options.rowDelimiter = [@options.rowDelimiter] if typeof @options.rowDelimiter is 'string'
      @options.delimiter ?= ','
      @options.quote = '' if @options.quote isnt undefined and not @options.quote
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
      if @options.auto_parse_date is true
        @options.auto_parse_date = (value) ->
          m = Date.parse(value)
          if !isNaN(m)
            value = new Date(m)
          value
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
      @_ =
        decoder: new StringDecoder()
        quoting: false
        commenting: false
        field: null
        nextChar: null
        closingQuote: 0
        line: [] # Current line being processed
        chunks: []
        rawBuf: ''
        buf: ''
        rowDelimiterLength: Math.max(@options.rowDelimiter.map( (v) -> v.length)...) if @options.rowDelimiter
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
      chunk = @_.decoder.write chunk if chunk instanceof Buffer
      err = @__write chunk, false
      return this.emit 'error', err if err
      callback()

    Parser.prototype._flush = (callback) ->
      err = @__write @_.decoder.end(), true
      return this.emit 'error', err if err
      if @_.quoting
        this.emit 'error', new Error "Quoted field not terminated at line #{@lines+1}"
        return
      if @_.line.length > 0
        err = @__push @_.line
        return callback err if err
      callback()

    Parser.prototype.__push = (line) ->
      return if @options.skip_lines_with_empty_values and line.join('').trim() is ''
      row = null
      if @options.columns is true
        @options.columns = line
        return
      else if typeof @options.columns is 'function'
        call_column_udf = (fn, line) ->
          try
            columns = fn.call null, line
            return [null, columns]
          catch err
            return [err]
        [err, columns] = call_column_udf @options.columns, line
        return err if err
        @options.columns = columns
        return
      if not @_.line_length and line.length > 0
        @_.line_length = if @options.columns then @options.columns.length else line.length
      # Dont check column count on empty lines
      if (line.length is 1 and line[0] is '')
        @empty_line_count++
      else if line.length isnt @_.line_length
        # Dont check column count with relax_column_count
        if @options.relax_column_count
          @count++
          @skipped_line_count++
        else if @options.columns?
          return Error "Number of columns on line #{@lines} does not match header"
        else
          return Error "Number of columns is inconsistent on line #{@lines}"
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
        @push { raw: @_.rawBuf, row: row }
        @_.rawBuf = ''
      else
        @push row
      null

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
        return value unless @options.auto_parse
        if typeof @options.auto_parse is 'function'
          return @options.auto_parse value
        # auto_parse == true
        if is_int value
          value = parseInt value
        else if is_float value
          value = parseFloat value
        else if @options.auto_parse_date
          value = @options.auto_parse_date(value)
        value
      ltrim = @options.trim or @options.ltrim
      rtrim = @options.trim or @options.rtrim
      chars = @_.buf + chars
      l = chars.length
      i = 0
      # Strip BOM header
      i++ if @lines is 0 and 0xFEFF is chars.charCodeAt 0
      while i < l
        # Ensure we get enough space to look ahead
        unless end
          remainingBuffer = chars.substr(i, l - i)
          break if (
            (not @options.rowDelimiter and i + 3 > l) or
            # (i+1000 >= l) or
            # Skip if the remaining buffer can be comment
            (not @_.commenting and l - i < @options.comment.length and @options.comment.substr(0, l - i) is remainingBuffer) or
            # Skip if the remaining buffer can be row delimiter
            (@options.rowDelimiter and l - i < @_.rowDelimiterLength and @options.rowDelimiter.some( (rd) -> rd.substr(0, l - i) is remainingBuffer)) or
            # Skip if the remaining buffer can be row delimiter following the closing quote
            (@options.rowDelimiter and @_.quoting and l - i < (@options.quote.length + @_.rowDelimiterLength) and @options.rowDelimiter.some((rd) => (@options.quote + rd).substr(0, l - i) is remainingBuffer)) or
            # Skip if the remaining buffer can be delimiter
            (l - i <= @options.delimiter.length and @options.delimiter.substr(0, l - i) is remainingBuffer) or
            # Skip if the remaining buffer can be escape sequence
            (l - i <= @options.escape.length and @options.escape.substr(0, l - i) is remainingBuffer)
          )
        char = if @_.nextChar then @_.nextChar else chars.charAt i
        @_.nextChar = if l > i + 1 then chars.charAt(i + 1) else ''
        @_.rawBuf += char if @options.raw
        # Auto discovery of rowDelimiter, unix, mac and windows supported
        if not @options.rowDelimiter?
          nextCharPos = i
          rowDelimiter = null
          # First empty line
          if not @_.quoting and char in ['\n', '\r']
            rowDelimiter = char
            nextCharPos += 1
          else if  @_.quoting and char is @options.quote and @_.nextChar in ['\n', '\r']
            rowDelimiter = @_.nextChar
            nextCharPos += 2
          if rowDelimiter
            rowDelimiter += '\n' if rowDelimiter is '\r' and chars.charAt(nextCharPos) is '\n'
            @options.rowDelimiter = [rowDelimiter]
            @_.rowDelimiterLength = rowDelimiter.length
        # Parse that damn char
        # Note, shouldn't we have sth like chars.substr(i, @options.escape.length)
        if not @_.commenting and char is @options.escape
          # Make sure the escape is really here for escaping:
          # If escape is same as quote, and escape is first char of a field 
          # and it's not quoted, then it is a quote
          # Next char should be an escape or a quote
          escapeIsQuote = @options.escape is @options.quote
          isEscape = @_.nextChar is @options.escape
          isQuote = @_.nextChar is @options.quote
          if not ( escapeIsQuote and not @_.field? and not @_.quoting ) and ( isEscape or isQuote )
            i++
            char = @_.nextChar
            @_.nextChar = chars.charAt i + 1
            @_.field = '' unless @_.field?
            @_.field += char
            # Since we're skipping the next one, better add it now if in raw mode.
            if @options.raw
              @_.rawBuf += char
            i++
            continue
        if not @_.commenting and char is @options.quote
          if @_.quoting
            # Make sure a closing quote is followed by a delimiter
            # If we have a next character and 
            # it isnt a rowDelimiter and 
            # it isnt an column delimiter and
            # it isnt the begining of a comment
            # Otherwise, if this is not "relax" mode, throw an error
            areNextCharsRowDelimiters = @options.rowDelimiter and @options.rowDelimiter.some((rd) -> chars.substr(i+1, rd.length) is rd)
            areNextCharsDelimiter = chars.substr(i+1, @options.delimiter.length) is @options.delimiter
            isNextCharAComment = @_.nextChar is @options.comment
            if @_.nextChar and not areNextCharsRowDelimiters and not areNextCharsDelimiter and not isNextCharAComment
              if @options.relax
                @_.quoting = false
                @_.field = "#{@options.quote}#{@_.field}" if @_.field
              else
                return Error "Invalid closing quote at line #{@lines+1}; found #{JSON.stringify(@_.nextChar)} instead of delimiter #{JSON.stringify(@options.delimiter)}"
            else
              @_.quoting = false
              @_.closingQuote = @options.quote.length
              i++
              if end and i is l
                @_.line.push auto_parse @_.field or ''
                @_.field = null
              continue
          else if not @_.field
            @_.quoting = true
            i++
            continue
          else if @_.field? and not @options.relax
            return Error "Invalid opening quote at line #{@lines+1}"
        # Otherwise, treat quote as a regular character
        isRowDelimiter = @options.rowDelimiter and @options.rowDelimiter.some((rd)-> chars.substr(i, rd.length) is rd)  
        @lines++ if isRowDelimiter or (end and i is l - 1)
        # Set the commenting flag
        wasCommenting = false
        if not @_.commenting and not @_.quoting and @options.comment and chars.substr(i, @options.comment.length) is @options.comment
          @_.commenting = true
        else if @_.commenting and isRowDelimiter
          wasCommenting = true
          @_.commenting = false
        isDelimiter = chars.substr(i, @options.delimiter.length) is @options.delimiter
        if not @_.commenting and not @_.quoting and (isDelimiter or isRowDelimiter)
          isRowDelimiterLength = @options.rowDelimiter.filter((rd)-> chars.substr(i, rd.length) is rd)[0].length if isRowDelimiter
          # Empty lines
          if isRowDelimiter and @_.line.length is 0 and not @_.field?
            if wasCommenting or @options.skip_empty_lines
              i += isRowDelimiterLength
              @_.nextChar = chars.charAt i
              continue
          if rtrim
            @_.field = @_.field?.trimRight() unless @_.closingQuote
          @_.line.push auto_parse @_.field or ''
          @_.closingQuote = 0
          @_.field = null
          if isDelimiter # End of field
            i += @options.delimiter.length
            @_.nextChar = chars.charAt i
            if end and not @_.nextChar
              isRowDelimiter = true
              @_.line.push ''
          if isRowDelimiter
            err = @__push @_.line
            return err if err
            # Some cleanup for the next row
            @_.line = []
            i += isRowDelimiterLength
            @_.nextChar = chars.charAt i
            continue
        else if not @_.commenting and not @_.quoting and (char in [' ', '\t'])
          # Left trim unless we are quoting or field already filled
          @_.field = '' unless @_.field?
          @_.field += char unless ltrim and not @_.field
          i++
        else if not @_.commenting
          @_.field = '' unless @_.field?
          @_.field += char
          i++
        else
          i++
        if not @_.commenting and @_.field?.length > @options.max_limit_on_data_read
          return Error "Field exceeds max_limit_on_data_read setting (#{@options.max_limit_on_data_read}) #{JSON.stringify(@options.delimiter)}"
        if not @_.commenting and @_.line?.length > @options.max_limit_on_data_read
          return Error "Row delimiter not found in the file #{JSON.stringify(@options.rowDelimiter)}"
      # Flush remaining fields and lines
      if end
        if @_.field?
          if rtrim
            @_.field = @_.field?.trimRight() unless @_.closingQuote
          @_.line.push auto_parse @_.field or ''
          @_.field = null
        if @_.field?.length > @options.max_limit_on_data_read
          return Error "Delimiter not found in the file #{JSON.stringify(@options.delimiter)}"
        if l is 0
          @lines++
        if @_.line.length > @options.max_limit_on_data_read
          return Error "Row delimiter not found in the file #{JSON.stringify(@options.rowDelimiter)}"
      # Store un-parsed chars for next call
      @_.buf = chars.substr i
      null

## Utils

    isObjLiteral = (_obj) ->
      _test  = _obj
      if typeof _obj isnt 'object' or _obj is null or Array.isArray _obj then false else
        (->
          while not false
            break if Object.getPrototypeOf( _test = Object.getPrototypeOf _test  ) is null
          Object.getPrototypeOf _obj is _test
        )()

[readme]: https://github.com/wdavidw/node-csv-parse
[site]: http://csv.adaltas.com/parse/
[samples]: https://github.com/wdavidw/node-csv-parse/tree/master/samples
[tests]: https://github.com/wdavidw/node-csv-parse/tree/master/test
[stream]: (http://nodejs.org/api/stream.html
[transform]: (http://nodejs.org/api/stream.html#stream_class_stream_transform_1)
