
# CSV Stringifier

Please look at the [project documentation](https://csv.js.org/stringify/) for additional
information.

    stream = require 'stream'
    util = require 'util'
    get = require 'lodash.get'

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
        ## Default options
        options.delimiter ?= ','
        options.quote ?= '"'
        options.quoted ?= false
        options.quoted_empty ?= undefined
        options.quoted_string ?= false
        options.eof ?= true
        options.escape ?= '"'
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
            throw Error "Invalid Option: quoted_match must be a string or a regex, got #{JSON.stringify quoted_match}"
        # Backward compatibility
        options.cast.boolean = options.cast.bool if options.cast.bool
        # Custom cast
        options.cast.string ?= (value) ->
          value
        options.cast.date ?= (value) ->
          # Cast date to timestamp string by default
          '' + value.getTime()
        options.cast.boolean ?= (value) ->
          # Cast boolean to string by default
          if value then '1' else ''
        options.cast.number ?= (value) ->
          # Cast number to string using native casting by default
          '' + value
        options.cast.object ?= (value) ->
          # Stringify object as JSON by default
          JSON.stringify value
        if options.record_delimiter is undefined or options.record_delimiter is null or options.record_delimiter is false
          options.record_delimiter ?= '\n'
        else if typeof options.record_delimiter is 'string'
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
        else if Buffer.isBuffer options.record_delimiter
          options.record_delimiter = options.record_delimiter.toString()
        else
          throw Error "Invalid Option: record_delimiter must be a string or a buffer, got #{JSON.stringify options.record_delimiter}"
        # Internal usage, state related
        @countWriten ?= 0
        # Expose options
        @options = options
        @

## `Stringifier.prototype._transform(chunk, encoding, callback)`

Implementation of the [transform._transform function](https://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback).

      _transform: (chunk, encoding, callback) ->
        # Nothing to do if null or undefined
        return unless chunk?
        preserve = typeof chunk isnt 'object'
        # Emit and stringify the record if an object or an array
        unless preserve
          # Detect columns from the first record
          if @countWriten is 0 and not Array.isArray chunk
            @options.columns ?= @normalize_columns Object.keys chunk
          try @emit 'record', chunk, @countWriten
          catch e then return @emit 'error', e
          # Convert the record into a string
          if @options.eof
            chunk = @stringify(chunk)
            return unless chunk?
            chunk = chunk + @options.record_delimiter
          else
            chunk = @stringify(chunk)
            return unless chunk?
            chunk = @options.record_delimiter + chunk if @options.header or @countWriten
        # Emit the csv
        chunk = "#{chunk}" if typeof chunk is 'number'
        @headers() if @countWriten is 0
        @countWriten++ unless preserve
        @push chunk
        callback()

## `Stringifier.prototype._flush(callback)`

Implementation of the [transform._flush function](https://nodejs.org/api/stream.html#stream_transform_flush_callback).

      _flush: (callback) ->
        @headers() if @countWriten is 0
        callback()

## `Stringifier.prototype.stringify(line)`

Convert a line to a string. Line may be an object, an array or a string.

      stringify: (record) ->
        return record if typeof record isnt 'object'
        columns = @options.columns
        delimiter = @options.delimiter
        quote = @options.quote
        escape = @options.escape
        unless Array.isArray record
          _record = []
          if columns
            for i in [0...columns.length]
              value = get record, columns[i].key
              _record[i] = if (typeof value is 'undefined' or value is null) then '' else value
          else
            for column of record
              _record.push record[column]
          record = _record
          _record = null
        else if columns # Note, we used to have @options.columns
          # We are getting an array but the user want specified output columns. In
          # this case, we respect the columns indexes
          record.splice columns.length
        if Array.isArray record
          newrecord = ''
          for i in [0...record.length]
            field = record[i]
            type = typeof field
            try
              if type is 'string'
                # fine 99% of the cases
                field = @options.cast.string(field)
              else if type is 'number'
                field = @options.cast.number(field)
              else if type is 'boolean'
                field = @options.cast.boolean(field)
              else if field instanceof Date
                field = @options.cast.date(field)
              else if type is 'object' and field isnt null
                field = @options.cast.object(field)
            catch err
              @emit 'error', err
              return
            if field
              unless typeof field is 'string'
                @emit 'error', Error 'Formatter must return a string, null or undefined'
                return null
              containsdelimiter = field.indexOf(delimiter) >= 0
              containsQuote = (quote isnt '') and field.indexOf(quote) >= 0
              containsEscape = field.indexOf(escape) >= 0 and (escape isnt quote)
              containsRowDelimiter = field.indexOf(@options.record_delimiter) >= 0
              quoted = @options.quoted
              quotedString = @options.quoted_string and typeof record[i] is 'string'
              quotedMatch = @options.quoted_match and typeof record[i] is 'string' and @options.quoted_match.filter (quoted_match) ->
                if typeof quoted_match is 'string'
                  record[i].indexOf(quoted_match) isnt -1
                else
                  quoted_match.test record[i]
              quotedMatch = quotedMatch and quotedMatch.length > 0
              shouldQuote = containsQuote or containsdelimiter or containsRowDelimiter or quoted or quotedString or quotedMatch
              if shouldQuote and containsEscape
                regexp = if escape is '\\' then new RegExp(escape + escape, 'g') else new RegExp(escape, 'g');
                field = field.replace(regexp, escape + escape)
              if containsQuote
                regexp = new RegExp(quote,'g')
                field = field.replace(regexp, escape + quote)
              if shouldQuote
                field = quote + field + quote
              newrecord += field
            else if @options.quoted_empty or (not @options.quoted_empty? and record[i] is '' and @options.quoted_string)
              newrecord += quote + quote
            if i isnt record.length - 1
              newrecord += delimiter
          record = newrecord
        record

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

## `Stringifier.prototype.headers`

Print the header line if the option "header" is "true".

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

    underscore = (str) ->
      str.replace /([A-Z])/g, (_, match, index) ->
        return '_' + match.toLowerCase()
