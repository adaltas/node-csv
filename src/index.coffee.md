
# CSV Stringifier

Please look at the [project documentation](https://csv.js.org/stringify/) for additional
information.

    stream = require 'stream'
    util = require 'util'

## Usage

This module export a function as its main entry point and return a transform
stream.

Refers to the [official prject documentation](http://csv.adaltas.com/stringify/)
on how to call this function.

    module.exports = ->
      if arguments.length is 3
        data = arguments[0]
        options = arguments[1]
        callback = arguments[2]
      else if arguments.length is 2
        if Array.isArray arguments[0]
        then data = arguments[0]
        else options = arguments[0]
        if typeof arguments[1] is 'function'
        then callback = arguments[1]
        else options = arguments[1]
      else if arguments.length is 1
        if typeof arguments[0] is 'function'
        then callback = arguments[0]
        else if Array.isArray arguments[0]
        then data = arguments[0]
        else options = arguments[0]
      options ?= {}
      stringifier = new Stringifier options
      if data
        process.nextTick ->
          stringifier.write d for d in data
          stringifier.end()
      if callback
        chunks = []
        stringifier.on 'readable', ->
          while chunk = stringifier.read()
            chunks.push chunk
        stringifier.on 'error', (err) ->
          callback err
        stringifier.on 'end', ->
          callback null, chunks.join ''
      stringifier

You can also use *util.promisify* native function (Node.js 8+) in order to wrap callbacks into promises for more convenient use when source is a readable stream and you are OK with storing entire result set in memory:

```
const { promisify } = require('util');
const csv = require('csv');
const stringifyAsync = promisify(csv.stringify);

//returns promise
function generateCsv(sourceData) {
    return stringifyAsync(sourceData);
}
```

## `Stringifier([options])`

Options are documented [here](http://csv.adaltas.com/stringify/).

    class Stringifier extends stream.Transform
      
      constructor: (opts = {}) ->
        super {{writableObjectMode: true}..., options...}
        options = {}
        # Immutable options and camelcase conversion
        options[underscore k] = v for k, v of opts
        # Normalize option `delimiter`
        if options.delimiter is null or options.delimiter is undefined
          options.delimiter = ','
        else
          if Buffer.isBuffer options.delimiter
            options.delimiter = options.delimiter.toString()
          else if typeof options.delimiter isnt 'string'
            throw new Error "Invalid Option: delimiter must be a buffer or a string, got #{JSON.stringify options.delimiter}"
        # Normalize option `quote`
        if options.quote is null or options.quote is undefined
          options.quote = '"'
        else
          if options.quote is true
            options.quote = '"'
          else if options.quote is false
            options.quote = ''
          else if Buffer.isBuffer options.quote
            options.quote = options.quote.toString()
          else if typeof options.quote isnt 'string'
            throw new Error "Invalid Option: quote must be a boolean, a buffer or a string, got #{JSON.stringify options.quote}"
        # Normalize option `quoted`
        options.quoted ?= false
        options.quoted_empty ?= undefined
        options.quoted_string ?= false
        options.eof ?= true
        # Normalize option `escape`
        if options.escape is null or options.escape is undefined
          options.escape = '"'
        else
          if Buffer.isBuffer options.escape
            options.escape = options.escape.toString()
          if typeof options.escape isnt 'string'
            throw new Error "Invalid Option: escape must be a buffer or a string, got #{JSON.stringify options.escape}"
          else if options.escape.length > 1
            throw new Error "Invalid Option: escape must be one character, got #{options.escape.length} characters"
        options.header ?= false
        # Normalize the columns option
        options.columns = @normalize_columns options.columns
        options.cast ?= {}
        # Normalize option `quoted_match`
        if options.quoted_match is undefined or options.quoted_match is null or options.quoted_match is false
          options.quoted_match = null
        else if not Array.isArray options.quoted_match
          options.quoted_match = [options.quoted_match]
        if options.quoted_match then for quoted_match in options.quoted_match
          isString = typeof quoted_match is 'string'
          isRegExp = quoted_match instanceof RegExp
          if not isString and not isRegExp
            throw new Error "Invalid Option: quoted_match must be a string or a regex, got #{JSON.stringify quoted_match}"
        # Backward compatibility
        options.cast.boolean = options.cast.bool if options.cast.bool
        # Custom cast
        options.cast.boolean ?= (value) ->
          # Cast boolean to string by default
          if value then '1' else ''
        options.cast.date ?= (value) ->
          # Cast date to timestamp string by default
          '' + value.getTime()
        options.cast.number ?= (value) ->
          # Cast number to string using native casting by default
          '' + value
        options.cast.object ?= (value) ->
          # Stringify object as JSON by default
          JSON.stringify value
        options.cast.string ?= (value) ->
          value
        # Normalize option `record_delimiter`
        if options.record_delimiter is undefined or options.record_delimiter is null
          options.record_delimiter ?= '\n'
        else
          if Buffer.isBuffer options.record_delimiter
            options.record_delimiter = options.record_delimiter.toString()
          else if typeof options.record_delimiter isnt 'string'
            throw new Error "Invalid Option: record_delimiter must be a buffer or a string, got #{JSON.stringify options.record_delimiter}"
          switch options.record_delimiter
            when 'auto'
              options.record_delimiter = null
            when 'unix'
              options.record_delimiter = "\n"
            when 'mac'
              options.record_delimiter = "\r"
            when 'windows'
              options.record_delimiter = "\r\n"
            when 'ascii'
              options.record_delimiter = "\u001e"
            when 'unicode'
              options.record_delimiter = "\u2028"
        # Expose options
        @options = options
        # Internal state
        @state =
          stop: false
        # Information
        @info =
          records: 0
        @

## `Stringifier.prototype._transform(chunk, encoding, callback)`

Implementation of the [transform._transform function](https://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback).

      _transform: (chunk, encoding, callback) ->
        if @state.stop is true
          return
        # Chunk validation
        unless Array.isArray(chunk) or typeof chunk is 'object'
          @state.stop = true
          return callback Error "Invalid Record: expect an array or an object, got #{JSON.stringify chunk}"
        # Detect columns from the first record
        if @info.records is 0
          if Array.isArray chunk
            if @options.header is true and not @options.columns
              @state.stop = true
              return callback Error 'Undiscoverable Columns: header option requires column option or object records'
          else
            @options.columns ?= @normalize_columns Object.keys chunk
        # Emit the header
        @headers() if @info.records is 0
        # Emit and stringify the record if an object or an array
        try
          @emit 'record', chunk, @info.records
        catch e
          @state.stop = true
          return @emit 'error', e
        # Convert the record into a string
        if @options.eof
          chunk = @stringify(chunk)
          return unless chunk?
          chunk = chunk + @options.record_delimiter
        else
          chunk = @stringify(chunk)
          return unless chunk?
          chunk = @options.record_delimiter + chunk if @options.header or @info.records
        # Emit the csv
        @info.records++
        @push chunk
        callback()

## `Stringifier.prototype._flush(callback)`

Implementation of the [transform._flush function](https://nodejs.org/api/stream.html#stream_transform_flush_callback).

      _flush: (callback) ->
        @headers() if @info.records is 0
        callback()

## `Stringifier.prototype.stringify(line)`

Convert a line to a string. Line may be an object, an array or a string.

      stringify: (chunk) ->
        return chunk if typeof chunk isnt 'object'
        {columns, header} = @options
        record = []
        # Record is an array
        if Array.isArray chunk
          # We are getting an array but the user has specified output columns. In
          # this case, we respect the columns indexes
          chunk.splice columns.length if columns
          # Cast record elements
          for field, i in chunk
            [err, value] = @__cast field, index: i, column: i, records: @info.records, header: header and @info.records is 0
            if err
              @emit 'error', err
              return
            record[i] = [value, field]
        # Record is a literal object
        else
          if columns
            for i in [0...columns.length]
              field = get chunk, columns[i].key
              [err, value] = @__cast field, index: i, column: columns[i].key, records: @info.records, header: header and @info.records is 0
              if err
                @emit 'error', err
                return
              record[i] = [value, field]
          else
            for column of chunk
              field = chunk[column]
              [err, value] = @__cast field, index: i, column: columns[i].key, records: @info.records, header: header and @info.records is 0
              if err
                @emit 'error', err
                return
              record.push [value, field]
        csvrecord = ''
        for i in [0...record.length]
          [value, field] = record[i]
          if typeof value is 'string'
            options = @options
          else if isObject value
            {value, options...} = value
            unless typeof value is 'string' or value is undefined or value is null
              @emit 'error', Error "Invalid Casting Value: returned value must return a string, null or undefined, got #{JSON.stringify value}"
              return
            options = {this.options..., options...}
          else if value is undefined or value is null
            options = @options
          else
            @emit 'error', Error "Invalid Casting Value: returned value must return a string, an object, null or undefined, got #{JSON.stringify value}"
            return
          {delimiter, escape, quote, quoted, quoted_empty, quoted_string, quoted_match, record_delimiter} = options
          if value
            unless typeof value is 'string'
              @emit 'error', Error "Formatter must return a string, null or undefined, got #{JSON.stringify value}"
              return null
            containsdelimiter = delimiter.length && value.indexOf(delimiter) >= 0
            containsQuote = (quote isnt '') and value.indexOf(quote) >= 0
            containsEscape = value.indexOf(escape) >= 0 and (escape isnt quote)
            containsRowDelimiter = value.indexOf(record_delimiter) >= 0
            quotedString = quoted_string and typeof field is 'string'
            quotedMatch = quoted_match and typeof field is 'string' and quoted_match.filter (quoted_match) ->
              if typeof quoted_match is 'string'
                value.indexOf(quoted_match) isnt -1
              else
                quoted_match.test value
            quotedMatch = quotedMatch and quotedMatch.length > 0
            shouldQuote = containsQuote or containsdelimiter or containsRowDelimiter or quoted or quotedString or quotedMatch
            if shouldQuote and containsEscape
              regexp = if escape is '\\'
              then new RegExp escape + escape, 'g'
              else new RegExp escape, 'g'
              value = value.replace(regexp, escape + escape)
            if containsQuote
              regexp = new RegExp quote,'g'
              value = value.replace regexp, escape + quote
            if shouldQuote
              value = quote + value + quote
            csvrecord += value
          else if quoted_empty or (not quoted_empty? and field is '' and quoted_string)
            csvrecord += quote + quote
          if i isnt record.length - 1
            csvrecord += delimiter
        csvrecord

## `Stringifier.prototype.headers`

Print the header line if the option "header" is "true".

      headers: ->
        return unless @options.header
        return unless @options.columns
        headers = @options.columns.map (column) -> column.header
        if @options.eof
          headers = @stringify(headers) + @options.record_delimiter
        else
          headers = @stringify(headers)
        @push headers

      __cast: (value, context) ->
        type = typeof value
        try
          if type is 'string'
            # Fine for 99% of the cases
            [undefined, @options.cast.string value, context]
          else if type is 'number'
            [undefined, @options.cast.number value, context]
          else if type is 'boolean'
            [undefined, @options.cast.boolean value, context]
          else if value instanceof Date
            [undefined, @options.cast.date value, context]
          else if type is 'object' and value isnt null
            [undefined, @options.cast.object value, context]
          else
            [undefined, value, value]
        catch err
          [err]

## `Stringifier.prototype.normalize_columns`

      normalize_columns: (columns) ->
        return null unless columns?
        if columns?
          unless typeof columns is 'object'
            throw Error 'Invalid option "columns": expect an array or an object'
          unless Array.isArray columns
            columns = for k, v of columns
              key: k
              header: v
          else
            columns = for column in columns
              if typeof column is 'string'
                key: column
                header: column
              else if typeof column is 'object' and column? and not Array.isArray column
                throw Error 'Invalid column definition: property "key" is required' unless column.key
                column.header ?= column.key
                column
              else
                throw Error 'Invalid column definition: expect a string or an object'
        columns

    module.exports.Stringifier = Stringifier
  
    isObject = (obj) ->
      typeof obj is 'object' and obj isnt null and not Array.isArray obj

    underscore = (str) ->
      str.replace /([A-Z])/g, (_, match, index) ->
        return '_' + match.toLowerCase()

## Lodash implementation of `get`

    charCodeOfDot = '.'.charCodeAt(0)
    reEscapeChar = /\\(\\)?/g
    rePropName = RegExp(
      # Match anything that isn't a dot or bracket.
      '[^.[\\]]+' + '|' +
      # Or match property names within brackets.
      '\\[(?:' +
        # Match a non-string expression.
        '([^"\'][^[]*)' + '|' +
        # Or match strings (supports escaping characters).
        '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
      ')\\]'+ '|' +
      # Or match "" as the space between consecutive dots or empty brackets.
      '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
    , 'g')
    isSymbol = (value) ->
      type = typeof value
      type is 'symbol' or (type is 'object' and value isnt null and getTag(value) is '[object Symbol]')
    castPath = (string) ->
      result = []
      if string.charCodeAt(0) is charCodeOfDot
        result.push ''
      string.replace rePropName, (match, expression, quote, subString) ->
        key = match
        if quote
          key = subString.replace(reEscapeChar, '$1')
        else if expression
          key = expression.trim()
        result.push key
      result
    toKey = (value) ->
      if typeof value is 'string' or isSymbol value
        return value
      result = "#{value}"
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
    get = (object, path) ->
      path = if Array.isArray path
      then path
      else castPath path, object
      index = 0
      length = path.length
      while object? and index < length
        object = object[toKey(path[index++])]
      if index && index is length then object else undefined
