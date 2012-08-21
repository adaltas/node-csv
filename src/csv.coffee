
###
Module CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

 |---------------|        |---------------|---------------|         |---------------|
 |               |        |               |               |         |               |
 |               |        |              CSV              |         |               |
 |               |        |               |               |         |               |
 |    Stream     |        |    Writer     |    Reader     |         |    Stream     |
 |    Reader     | .pipe( |     API       |     API       | ).pipe( |    Writer     | )
 |               |        |               |               |         |               |
 |               |        |               |               |         |               |
 |---------------|        |---------------|---------------|         |---------------|

 fs.createReadStream('in'.pipe(         csv()           ).pipe( fs.createWriteStream('out') )
###

stream = require 'stream'
from = require './from'
to = require './to'

module.exports = ->

    state =
        count: 0
        countWriten: 0
        field: ''
        line: []
        lastC: ''
        quoted: false
        commented: false
        buffer: null
        bufferPosition: 0
    # Are we currently inside the transform callback? If so,
    # we shouldn't increment `state.count` which count provided lines
    transforming = false
    
    CSV = () ->
        # Set options
        @writeOptions =
            delimiter: null
            quote: null
            quoted: false
            escape: null
            columns: null
            header: false
            lineBreaks: null
            flags: 'w'
            encoding: 'utf8'
            bufferSize: null
            newColumns: false
            end: true # Call `end()` on close
        # A boolean that is true by default, but turns false after an 'error' occurred, 
        # the stream came to an 'end', or destroy() was called. 
        @readable = true
        # A boolean that is true by default, but turns false after an 'error' occurred 
        # or end() / destroy() was called. 
        @writable = true
        @state = state
        @from = from this
        @to = to this
        @
    CSV.prototype.__proto__ = stream.prototype
    
    # Writting API
    
    ###
    Write data.
    Data may be string in which case it could span multiple lines. If data 
    is an object or an array, it must represent a single line.
    Preserve is for line which are not considered as CSV data.
    ###
    CSV.prototype.write = (data, preserve) ->
        return unless @writable
        if typeof data is 'string' and not preserve
            return parse data
        else if Array.isArray(data) and not transforming
            state.line = data
            return transform()
        if state.count is 0 and csv.writeOptions.header is true
            write csv.writeOptions.columns or csv.from.options().columns
        write data, preserve
        if not transforming and not preserve
            state.count++
    
    CSV.prototype.end = ->
        return unless @writable
        if state.quoted
            return error new Error 'Quoted field not terminated'
        # dump open record
        if state.field or state.lastC is @from.options().delimiter or state.lastC is @from.options().quote
            if csv.from.options().trim or csv.from.options().rtrim
                state.field = state.field.trimRight()
            state.line.push(state.field)
            state.field = ''
        if state.line.length > 0
            transform()
        if csv.writeStream
            if state.bufferPosition isnt 0
                csv.writeStream.write state.buffer.slice(0, state.bufferPosition)
            if @writeOptions.end
                csv.writeStream.end()
            else
                csv.emit 'end', state.count
                csv.readable = false
        else
            csv.emit 'end', state.count
            csv.readable = false
    
    # Transform API
    
    CSV.prototype.transform = (callback) ->
        @transformer = callback
        return @
    
    csv = new CSV()
    
    # Private API
    
    ###
    Parse a string which may hold multiple lines.
    Private state object is enriched on each character until 
    transform is called on a new line
    ###
    parse = (chars) ->
        chars = '' + chars
        l = chars.length
        i = 0
        while i < l
            c = chars.charAt(i)
            switch c
                when csv.from.options().escape, csv.from.options().quote
                    break if state.commented
                    isReallyEscaped = false
                    if c is csv.from.options().escape
                        # Make sure the escape is really here for escaping:
                        # if escape is same as quote, and escape is first char of a field and it's not quoted, then it is a quote
                        # next char should be an escape or a quote
                        nextChar = chars.charAt(i + 1)
                        escapeIsQuoted = csv.from.options().escape is csv.from.options().quote
                        isEscaped = nextChar is csv.from.options().escape
                        isQuoted = nextChar is csv.from.options().quote
                        if not ( escapeIsQuoted and not state.field and not state.quoted ) and ( isEscaped or isQuoted )
                            i++
                            isReallyEscaped = true
                            c = chars.charAt(i)
                            state.field += c
                    if not isReallyEscaped and c is csv.from.options().quote
                        if state.field and not state.quoted
                            # Treat quote as a regular character
                            state.field += c
                            break
                        if state.quoted
                            # Make sure a closing quote is followed by a delimiter
                            nextChar = chars.charAt i + 1
                            if nextChar and nextChar isnt '\r' and nextChar isnt '\n' and nextChar isnt csv.from.options().delimiter
                                return error new Error 'Invalid closing quote; found "' + nextChar + '" instead of delimiter "' + csv.from.options().delimiter + '"'
                            state.quoted = false
                        else if state.field is ''
                            state.quoted = true
                when csv.from.options().delimiter
                    break if state.commented
                    if state.quoted
                        state.field += c
                    else
                        if csv.from.options().trim or csv.from.options().rtrim
                            state.field = state.field.trimRight()
                        state.line.push state.field
                        state.field = ''
                    break
                when '\n', '\r'
                    if state.quoted
                        state.field += c
                        break
                    if not csv.from.options().quoted and state.lastC is '\r'
                        break
                    if csv.writeOptions.lineBreaks is null
                        # Auto-discovery of linebreaks
                        csv.writeOptions.lineBreaks = c + ( if c is '\r' and chars.charAt(i+1) is '\n' then '\n' else '' )
                    if csv.from.options().trim or csv.from.options().rtrim
                        state.field = state.field.trimRight()
                    state.line.push state.field
                    state.field = ''
                    transform()
                when ' ', '\t'
                    if state.quoted or (not csv.from.options().trim and not csv.from.options().ltrim ) or state.field
                        state.field += c
                        break
                else
                    break if state.commented
                    state.field += c
            state.lastC = c
            i++
    
    ###
    Called by the `parse` function on each line. It is responsible for 
    transforming the data and finally calling `write`.
    ###
    transform = ->
        line = null
        columns = csv.from.options().columns
        if columns
            # Extract column names from the first line
            if state.count is 0 and columns is true
                csv.from.options().columns = columns = state.line
                state.line = []
                state.lastC = ''
                return
            # Line stored as an object in which keys are column names
            line = {}
            for i in [0...columns.length]
                column = columns[i]
                line[column] = state.line[i] or null
            state.line = line
            line = null
        if csv.transformer
            transforming = true
            try
                line = csv.transformer state.line, state.count
            catch e
                return error e
            isObject = typeof line is 'object' and not Array.isArray line
            if csv.writeOptions.newColumns and not csv.writeOptions.columns and isObject
                Object.keys(line)
                .filter( (column) -> columns.indexOf(column) is -1 )
                .forEach( (column) -> columns.push(column) )
            transforming = false
        else
            line = state.line
        if state.count is 0 and csv.writeOptions.header is true
            write csv.writeOptions.columns or columns
        write line
        state.count++
        state.line = []
        state.lastC = ''
    
    ###
    Write a line to the written stream.
    Line may be an object, an array or a string
    Preserve is for line which are not considered as CSV data
    ###
    write = (line, preserve) ->
        if typeof line is 'undefined' or line is null
            return
        if not preserve
            try
                csv.emit 'data', line, state.count
            catch e
                return error e
        if typeof line is 'object'
            unless Array.isArray line
                columns = csv.writeOptions.columns or csv.from.options().columns
                _line = []
                if columns
                    for i in [0...columns.length]
                        column = columns[i]
                        _line[i] = if (typeof line[column] is 'undefined' or line[column] is null) then '' else line[column]
                else
                    for column of line
                        _line.push line[column]
                line = _line
                _line = null
            else if csv.writeOptions.columns
                # We are getting an array but the user want specified output columns. In
                # this case, we respect the columns indexes
                line.splice csv.writeOptions.columns.length
            if Array.isArray line
                newLine = if state.countWriten then csv.writeOptions.lineBreaks or "\n" else ''
                for i in [0...line.length]
                    field = line[i]
                    if typeof field is 'string'
                        # fine 99% of the cases, keep going
                    else if typeof field is 'number'
                        # Cast number to string
                        field = '' + field
                    else if typeof field is 'boolean'
                        # Cast boolean to string
                        field = if field then '1' else ''
                    else if field instanceof Date
                        # Cast date to timestamp string
                        field = '' + field.getTime()
                    if field
                        containsdelimiter = field.indexOf(csv.writeOptions.delimiter or csv.from.options().delimiter) >= 0
                        containsQuote = field.indexOf(csv.writeOptions.quote or csv.from.options().quote) >= 0
                        containsLinebreak = field.indexOf("\r") >= 0 or field.indexOf("\n") >= 0
                        if containsQuote
                            regexp = new RegExp(csv.writeOptions.quote or csv.from.options().quote,'g')
                            field = field.replace(regexp, (csv.writeOptions.escape or csv.from.options().escape) + (csv.writeOptions.quote or csv.from.options().quote))
                        if containsQuote or containsdelimiter or containsLinebreak or csv.writeOptions.quoted
                            field = (csv.writeOptions.quote or csv.from.options().quote) + field + (csv.writeOptions.quote or csv.from.options().quote)
                        newLine += field
                    if i isnt line.length - 1
                        newLine += csv.writeOptions.delimiter or csv.from.options().delimiter
                line = newLine
        else if typeof line is 'number'
            line = ''+line
        if state.buffer
            if state.bufferPosition + Buffer.byteLength(line, csv.writeOptions.encoding) > csv.from.options().bufferSize
                csv.writeStream.write(state.buffer.slice(0, state.bufferPosition))
                state.buffer = new Buffer(csv.from.options().bufferSize)
                state.bufferPosition = 0
            state.bufferPosition += state.buffer.write(line, state.bufferPosition, csv.writeOptions.encoding)
        state.countWriten++ unless preserve
        true

    error = (e) ->
        csv.readable = false
        csv.writable = false
        csv.emit 'error', e
        # Destroy the input stream
        csv.readStream.destroy() if csv.readStream
        e
    
    csv

