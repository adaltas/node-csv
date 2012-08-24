
stream = require 'stream'
{EventEmitter} = require 'events'

###

`parse(chars)`
--------------

Parse a string which may hold multiple lines.
Private state object is enriched on each character until 
transform is called on a new line.

###
Parser = (csv) ->
  @writable = true
  @csv = csv
  @options = csv.options.from
  @state = csv.state
  @quoted = false
  @commented = false
  @

# Parser.prototype.__proto__ = stream.prototype
Parser.prototype.__proto__ = EventEmitter.prototype

Parser.prototype.parse =  (chars) ->
  return @error new Error 'Parser is not writable' unless @writable
  csv = @csv
  chars = '' + chars
  l = chars.length
  i = 0
  while i < l
    c = chars.charAt(i)
    switch c
      when @options.escape, @options.quote
        break if @commented
        isReallyEscaped = false
        if c is @options.escape
          # Make sure the escape is really here for escaping:
          # if escape is same as quote, and escape is first char of a field and it's not quoted, then it is a quote
          # next char should be an escape or a quote
          nextChar = chars.charAt(i + 1)
          escapeIsQuoted = @options.escape is @options.quote
          isEscaped = nextChar is @options.escape
          isQuoted = nextChar is @options.quote
          if not ( escapeIsQuoted and not @state.field and not @quoted ) and ( isEscaped or isQuoted )
            i++
            isReallyEscaped = true
            c = chars.charAt(i)
            @state.field += c
        if not isReallyEscaped and c is @options.quote
          if @state.field and not @quoted
            # Treat quote as a regular character
            @state.field += c
            break
          if @quoted
            # Make sure a closing quote is followed by a delimiter
            nextChar = chars.charAt i + 1
            if nextChar and nextChar isnt '\r' and nextChar isnt '\n' and nextChar isnt @options.delimiter
              return @error new Error 'Invalid closing quote; found ' + JSON.stringify(nextChar) + ' instead of delimiter ' + JSON.stringify(@options.delimiter)
            @quoted = false
          else if @state.field is ''
            @quoted = true
      when @options.delimiter
        break if @commented
        if @quoted
          @state.field += c
        else
          if @options.trim or @options.rtrim
            @state.field = @state.field.trimRight()
          @state.line.push @state.field
          @state.field = ''
        break
      when '\n', '\r'
        if @quoted
          @state.field += c
          break
        if not @options.quoted and @state.lastC is '\r'
          break
        if csv.options.to.lineBreaks is null
          # Auto-discovery of linebreaks
          csv.options.to.lineBreaks = c + ( if c is '\r' and chars.charAt(i+1) is '\n' then '\n' else '' )
        if @options.trim or @options.rtrim
          @state.field = @state.field.trimRight()
        @state.line.push @state.field
        @state.field = ''
        @emit 'row', @state.line
        # Some cleanup for the next row
        @state.line = []
      when ' ', '\t'
        if @quoted or (not @options.trim and not @options.ltrim ) or @state.field
          @state.field += c
          break
      else
        break if @commented
        @state.field += c
    @state.lastC = c
    i++

Parser.prototype.end = ->
    if @quoted
      return @error new Error 'Quoted field not terminated'
    # dump open record
    if @state.field or @state.lastC is @options.delimiter or @state.lastC is @options.quote
      if @options.trim or @options.rtrim
        @state.field = @state.field.trimRight()
      @state.line.push @state.field
      @state.field = ''
    if @state.line.length > 0
      @emit 'row', @state.line
    @emit 'end', null

Parser.prototype.error = (e) ->
  @writable = false
  @emit 'error', e

module.exports = (csv) -> new Parser csv


