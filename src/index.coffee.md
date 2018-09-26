
# CSV Stringifier

Please look at the [README], the [samples] and the [tests] for additional
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

    Stringifier = (opts = {}) ->
      # Immutable options
      options = {}
      options[k] = v for k, v of opts
      stream.Transform.call @, options
      ## Default options
      @options = options
      @options.delimiter ?= ','
      @options.quote ?= '"'
      @options.quoted ?= false
      @options.quotedEmpty ?= undefined
      @options.quotedString ?= false
      @options.eof ?= true
      @options.escape ?= '"'
      @options.header ?= false
      # Normalize the columns option
      @options.columns ?= null
      if @options.columns?
        unless typeof @options.columns is 'object'
          throw Error 'Invalid option "columns": expect an array or an object'
      @options.formatters ?= {}
      # Backward compatibility
      @options.formatters.boolean = @options.formatters.bool if @options.formatters.bool
      # Custom formatters
      @options.formatters.date ?= (value) ->
        # Cast date to timestamp string by default
        '' + value.getTime()
      @options.formatters.boolean ?= (value) ->
        # Cast boolean to string by default
        if value then '1' else ''
      @options.formatters.number ?= (value) ->
        # Cast number to string using native casting by default
        '' + value
      @options.formatters.object ?= (value) ->
        # Stringify object as JSON by default
        JSON.stringify value
      @options.rowDelimiter ?= '\n'
      # Internal usage, state related
      @countWriten ?= 0
      switch @options.rowDelimiter
        when 'auto'
          @options.rowDelimiter = null
        when 'unix'
          @options.rowDelimiter = "\n"
        when 'mac'
          @options.rowDelimiter = "\r"
        when 'windows'
          @options.rowDelimiter = "\r\n"
        when 'ascii'
          @options.rowDelimiter = "\u001e"
        when 'unicode'
          @options.rowDelimiter = "\u2028"
      @

    util.inherits Stringifier, stream.Transform

    module.exports.Stringifier = Stringifier

## `Stringifier.prototype.headers`

Print the header line if the option "header" is "true".

    Stringifier.prototype.headers = ->
      return unless @options.header
      return unless @options.columns
      labels = @options.columns
      # If columns is an object, keys are fields and values are labels
      if typeof labels is 'object'
        labels = for k, label of labels then label
      if @options.eof
        labels = @stringify(labels) + @options.rowDelimiter
      else
        labels = @stringify(labels)
      stream.Transform.prototype.write.call @, labels

    Stringifier.prototype.end = (chunk, encoding, callback)->
      @headers() if @countWriten is 0
      stream.Transform.prototype.end.apply @, arguments

    Stringifier.prototype.write = (chunk, encoding, callback) ->
      # Nothing to do if null or undefined
      return unless chunk?
      preserve = typeof chunk isnt 'object'
      # Emit and stringify the record if an object or an array
      unless preserve
        @options.columns ?= Object.keys chunk if @countWriten is 0 and not Array.isArray chunk
        try @emit 'record', chunk, @countWriten
        catch e then return @emit 'error', e
        # Convert the record into a string
        if @options.eof
          chunk = @stringify(chunk) + @options.rowDelimiter
        else
          chunk = @stringify(chunk)
          chunk = @options.rowDelimiter + chunk if @options.header or @countWriten
      # Emit the csv
      chunk = "#{chunk}" if typeof chunk is 'number'
      @headers() if @countWriten is 0
      @countWriten++ unless preserve
      stream.Transform.prototype.write.call @, chunk, encoding, callback

## `Stringifier.prototype._transform(line)`

    Stringifier.prototype._transform = (chunk, encoding, callback) ->
      @push chunk
      callback()

## `Stringifier.prototype.stringify(line)`

Convert a line to a string. Line may be an object, an array or a string.

    Stringifier.prototype.stringify = (record) ->
      return record if typeof record isnt 'object'
      columns = @options.columns
      columns = Object.keys columns if typeof columns is 'object' and columns isnt null and not Array.isArray columns
      delimiter = @options.delimiter
      quote = @options.quote
      escape = @options.escape
      unless Array.isArray record
        _record = []
        if columns
          for i in [0...columns.length]
            column = columns[i]
            value = get record, column
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
          if type is 'string'
            # fine 99% of the cases, keep going
          else if type is 'number'
            # Cast number to string
            field = @options.formatters.number(field)
          else if type is 'boolean'
            field = @options.formatters.boolean(field)
          else if field instanceof Date
            field = @options.formatters.date(field)
          else if type is 'object' and field isnt null
            field = @options.formatters.object(field)
          if field
            return @emit 'error', Error 'Formatter must return a string, null or undefined' unless typeof field is 'string'
            containsdelimiter = field.indexOf(delimiter) >= 0
            containsQuote = (quote isnt '') and field.indexOf(quote) >= 0
            containsEscape = field.indexOf(escape) >= 0 and (escape isnt quote)
            containsRowDelimiter = field.indexOf(@options.rowDelimiter) >= 0
            shouldQuote = containsQuote or containsdelimiter or containsRowDelimiter or @options.quoted or (@options.quotedString and typeof record[i] is 'string')
            if shouldQuote and containsEscape
              regexp = if escape is '\\' then new RegExp(escape + escape, 'g') else new RegExp(escape, 'g');
              field = field.replace(regexp, escape + escape)
            if containsQuote
              regexp = new RegExp(quote,'g')
              field = field.replace(regexp, escape + quote)
            if shouldQuote
              field = quote + field + quote
            newrecord += field
          else if @options.quotedEmpty or (not @options.quotedEmpty? and record[i] is '' and @options.quotedString)
            newrecord += quote + quote
          if i isnt record.length - 1
            newrecord += delimiter
        record = newrecord
      record

[readme]: https://github.com/wdavidw/node-csv-stringify
[samples]: https://github.com/wdavidw/node-csv-stringify/tree/master/samples
[tests]: https://github.com/wdavidw/node-csv-stringify/tree/master/test
