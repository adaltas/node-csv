

# CSV Parser

This module provides a CSV parser tested and used against large datasets. Over
the year, it has been enhance and is now full of useful options.

*   Follow the Node.js streaming API   
*   Support delimiters, quotes, escape characters and comments   
*   Line breaks discovery   
*   Support big datasets   
*   Complete test coverage and samples for inspiration   
*   no external dependencies   
*   to be used conjointly with `csv-generate`, `stream-transform` and `csv-stringify`   

Please look at the [README], the [samples] and the [tests] for additional
information.

    stream = require 'stream'
    util = require 'util'

## Usage

Callback approach, for ease of use:   

`parse(data, [options], callback)`     

Stream API, for maximum of power:   

`parse([options], [callback])`   

    module.exports = ->
      if arguments.length is 3
        data = arguments[0]
        options = arguments[1]
        callback = arguments[2]
      else if arguments.length is 2
        if typeof arguments[0] is 'string'
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
      if data
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

*   `delimiter`         Set the field delimiter. One character only, defaults to comma.   
*   `rowDelimiter`      String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).   
*   `quote`             Optionnal character surrounding a field, one character only, defaults to double quotes.   
*   `escape`            Set the escape character, one character only, defaults to double quotes.   
*   `columns`           List of fields as an array, a user defined callback accepting the first line and returning the column names or true if autodiscovered in the first CSV line, default to null, affect the result data set in the sense that records will be objects instead of arrays.   
*   `comment`           Treat all the characteres after this one as a comment, default to '#'.   
*   `objname`           Name of header-record title to name objects by.   
*   `skip_empty_lines`  Dont generate empty values for empty lines.   
*   `trim`              If true, ignore whitespace immediately around the delimiter, defaults to false.   
*   `ltrim`             If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields), defaults to false.   
*   `rtrim`             If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields), defaults to false.   
*   `auto_parse`        If true, the parser will attempt to convert read data types to native types.   

All options are optional.

    Parser = (options = {}) ->
      options.objectMode = true
      stream.Transform.call @, options
      @options = options
      @options.rowDelimiter ?= null
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
      @options.skip_empty_lines ?= false
      # Counter
      @lines = 0
      # Internal state
      @buf = ''
      @quoting = false
      @commenting = false
      @field = ''
      @lastC = ''
      @nextChar = null
      @closingQuote = 0
      @line = [] # Current line being processed
      @chunks = []
      @floatRegexp = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      @

## Interal API

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
      chunk = chunk.toString() if chunk instanceof Buffer
      try
        @__write chunk, false
        callback()
      catch err
        this.emit 'error', err

    Parser.prototype._flush = (callback) ->
      try
        @__write '', true
        if @quoting
          this.emit 'error', new Error "Quoted field not terminated at line #{@lines+1}"
          return
        # dump open record
        if @field or @lastC is @options.delimiter or @lastC is @options.quote
          if @options.trim or @options.rtrim
            @field = @field.trimRight()
          @line.push @field
          @field = ''
        if @line.length > 0
          @__push @line
        callback()
      catch err
        this.emit 'error', err

    Parser.prototype.__push = (line) ->
      if @options.columns is true
        @options.columns = line
        return
      else if typeof @options.columns is 'function'
        @options.columns = @options.columns line
        return
      if @options.columns?
        lineAsColumns = {}
        for field, i in line
          lineAsColumns[@options.columns[i]] = field
        if @options.objname
          @push [lineAsColumns[@options.objname], lineAsColumns]
        else
          @push lineAsColumns
      else
        @push line

    Parser.prototype.__write =  (chars, end, callback) ->
      ltrim = @options.trim or @options.ltrim
      rtrim = @options.trim or @options.rtrim
      chars = @buf + chars
      l = chars.length
      delimLength = if @options.rowDelimiter then @options.rowDelimiter.length else 0
      i = 0
      # Strip BOM header
      i++ if @lines is 0 and 0xFEFF is chars.charCodeAt 0
      while i < l
        # we stop if all are true
        # - the last chars aren't the delimiters
        # - this isnt the last line (the end argument)
        break if (i+delimLength >= l and chars.substr(i, @options.rowDelimiter.length) isnt @options.rowDelimiter) and not end
        # we stop if all are true
        # - the last chars are an espace char
        # - this isnt the last line (the end argument)
        break if (i+@options.escape.length >= l and chars.substr(i, @options.escape.length) is @options.escape) and not end
        char = if @nextChar then @nextChar else chars.charAt i
        @lastC = char # this should be removed, only used in buggy end function
        @nextChar = chars.charAt i + 1
        # Auto discovery of rowDelimiter, unix, mac and windows supported
        unless @options.rowDelimiter?
          # First empty line
          if (@field is '') and (char is '\n' or char is '\r')
            rowDelimiter = char
            nextCharPos = i+1
          else if @nextChar is '\n' or @nextChar is '\r'
            rowDelimiter = @nextChar
            nextCharPos = i+2
          if rowDelimiter
            rowDelimiter += '\n' if rowDelimiter is '\r' and chars.charAt(nextCharPos) is '\n'
            @options.rowDelimiter = rowDelimiter
            delimLength = @options.rowDelimiter.length
        # Parse that damn char
        # Note, shouldn't we have sth like chars.substr(i, @options.escape.length)
        if char is @options.escape
          # Make sure the escape is really here for escaping:
          # If escape is same as quote, and escape is first char of a field 
          # and it's not quoted, then it is a quote
          # Next char should be an escape or a quote
          escapeIsQuote = @options.escape is @options.quote
          isEscape = @nextChar is @options.escape
          isQuote = @nextChar is @options.quote
          if not ( escapeIsQuote and not @field and not @quoting ) and ( isEscape or isQuote )
            i++
            char = @nextChar
            @nextChar = chars.charAt i + 1
            @field += char
            i++
            continue
        if char is @options.quote
          if @quoting
            # Make sure a closing quote is followed by a delimiter
            # If we have a next character and 
            # it isnt a rowDelimiter and 
            # it isnt an column delimiter and
            # it isnt the begining of a comment
            areNextCharsRowDelimiters = @options.rowDelimiter and chars.substr(i+1, @options.rowDelimiter.length) is @options.rowDelimiter
            if not @options.relax and @nextChar and not areNextCharsRowDelimiters and @nextChar isnt @options.delimiter and @nextChar isnt @options.comment
              throw new Error "Invalid closing quote at line #{@lines+1}; found #{JSON.stringify(@nextChar)} instead of delimiter #{JSON.stringify(@options.delimiter)}"
            @quoting = false
            @closingQuote = i
            i++
            continue
          else if not @field
            @quoting = true
            i++
            continue
          else if @field and not @options.relax
            throw new Error "Invalid opening quote at line #{@lines+1}"
          # Otherwise, treat quote as a regular character
        # Between two columns
        isDelimiter = (char is @options.delimiter)
        isRowDelimiter = (@options.rowDelimiter and chars.substr(i, @options.rowDelimiter.length) is @options.rowDelimiter)
        # Set the commenting flag
        if not @commenting and not @quoting and char is @options.comment
          @commenting = true
        else if @commenting and isRowDelimiter
          wasCommenting = true
          @commenting = false
        if not @commenting and not @quoting and (isDelimiter or isRowDelimiter)
          # Empty lines
          if isRowDelimiter and @line.length is 0 and @field is ''
            if wasCommenting or @options.skip_empty_lines
              i += @options.rowDelimiter.length
              @nextChar = chars.charAt i
              continue
          if rtrim
            if @closingQuote
              @field = @field.substr 0, @closingQuote
            else
              @field = @field.trimRight()
          if (@options.auto_parse and @floatRegexp.test(@field))
            @line.push parseFloat(@field)
          else
            @line.push @field
          @closingQuote = 0
          @field = ''
          # End of row, flush the row
          if isRowDelimiter
            @__push @line
            @lines++
            # Some cleanup for the next row
            @line = []
            i += @options.rowDelimiter.length
            @nextChar = chars.charAt i
            continue
        else if not @commenting and not @quoting and (char is ' ' or char is '\t')
          # Discard space unless we are quoting, in a field
          @field += char unless ltrim and not @field
        else if not @commenting
          @field += char
        i++
      # Ok, maybe we still have some char that are left, 
      # we stored them for next call
      @buf = ''
      while i < l
        @buf += chars.charAt i
        i++

[readme]: https://github.com/wdavidw/node-csv-parse
[samples]: https://github.com/wdavidw/node-csv-parse/tree/master/samples
[tests]: https://github.com/wdavidw/node-csv-parse/tree/master/test
[transform]: (http://nodejs.org/api/stream.html#stream_class_stream_transform_1)
