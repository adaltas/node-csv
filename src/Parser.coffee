
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
        break if @state.commented
        isReallyEscaped = false
        if c is @options.escape
          # Make sure the escape is really here for escaping:
          # if escape is same as quote, and escape is first char of a field and it's not quoted, then it is a quote
          # next char should be an escape or a quote
          nextChar = chars.charAt(i + 1)
          escapeIsQuoted = @options.escape is @options.quote
          isEscaped = nextChar is @options.escape
          isQuoted = nextChar is @options.quote
          if not ( escapeIsQuoted and not @state.field and not @state.quoted ) and ( isEscaped or isQuoted )
            i++
            isReallyEscaped = true
            c = chars.charAt(i)
            @state.field += c
        if not isReallyEscaped and c is @options.quote
          if @state.field and not @state.quoted
            # Treat quote as a regular character
            @state.field += c
            break
          if @state.quoted
            # Make sure a closing quote is followed by a delimiter
            nextChar = chars.charAt i + 1
            if nextChar and nextChar isnt '\r' and nextChar isnt '\n' and nextChar isnt @options.delimiter
              return @error new Error 'Invalid closing quote; found ' + JSON.stringify(nextChar) + ' instead of delimiter ' + JSON.stringify(@options.delimiter)
            @state.quoted = false
          else if @state.field is ''
            @state.quoted = true
      when @options.delimiter
        break if @state.commented
        if @state.quoted
          @state.field += c
        else
          if @options.trim or @options.rtrim
            @state.field = @state.field.trimRight()
          @state.line.push @state.field
          @state.field = ''
        break
      when '\n', '\r'
        if @state.quoted
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
      when ' ', '\t'
        if @state.quoted or (not @options.trim and not @options.ltrim ) or @state.field
          @state.field += c
          break
      else
        break if @state.commented
        @state.field += c
    @state.lastC = c
    i++

Parser.prototype.error = (e) ->
  @writable = false
  @emit 'error', e

module.exports = (csv) -> new Parser csv


