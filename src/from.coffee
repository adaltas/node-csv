
fs = require 'fs'
utils = require './utils'

###

Reading data from a source
--------------------------

The `from` property provide convenient functions to read some csv input.

###
module.exports = (csv) ->
    ###

    `from.options([options])`: Set or get options
    ---------------------------------------------

    Options are:  

    *   `delimiter`     Set the field delimiter, one character only, defaults to comma.
    *   `quote`         Set the field delimiter, one character only, defaults to double quotes.
    *   `escape`        Set the field delimiter, one character only, defaults to double quotes.
    *   `columns`       List of fields or true if autodiscovered in the first CSV line, impact the `transform` argument and the `data` event by providing an object instead of an array, order matters, see the transform and the columns sections below.
    *   `flags`         
    *   `encoding`      Defaults to 'utf8', applied when a readable stream is created.
    *   `bufferSize`    
    *   `trim`          If true, ignore whitespace immediately around the delimiter, defaults to false.
    *   `ltrim`         If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields), defaults to false.
    *   `rtrim`         If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields), defaults to false.
    
    ###
    options: (options) ->
        if options?
            utils.merge csv.options.from, options
            csv
        else
            csv.options.from
    ###

    `from.array:(data, [options])`: Read from an array
    --------------------------------------------------
    
    Take an array as first argument and optionally some options 
    as a second argument. Each element of the array represents 
    a csv record. Those elements may be a string, a buffer, an
    array or an object.

    ###
    array: (data, options) ->
        this.options options
        process.nextTick ->
            for i in [0...data.length]
                csv.write data[i]
            csv.end()
        csv
    ###
    
    `from.string:(data, [options])`: Read from a string or a buffer
    ---------------------------------------------------------------
    
    Take a string as first argument and optionally an object 
    of options as a second argument. The string must be the 
    complete csv data and may contains more than one line.
    
    ###
    string: (data, options) ->
        this.options options
        process.nextTick ->
            # A string is handle exactly the same way as a single `write` call 
            # which is then closed. This is because the `write` function may receive
            # multiple and incomplete lines.
            csv.write data
            csv.end()
        csv
    ###
    
    `from.path(path, [options])`: Read from a file path
    ---------------------------------------------------
    
    Take a file path as first argument and optionally an object 
    of options as a second argument.
    
    ###
    path: (path, options) ->
        this.options options
        stream = fs.createReadStream path, csv.from.options()
        stream.setEncoding csv.from.options().encoding
        csv.from.stream stream, null
    ###
    
    `from.stream(readStream, [options])`: Read from a stream
    --------------------------------------------------------
    
    Take a readable stream as first argument and optionally 
    an object of options as a second argument.
    
    ###
    stream: (readStream, options) ->
        this.options options
        readStream.on 'data', (data) ->
            csv.write data.toString()
        readStream.on 'error', (e) ->
            error e
        readStream.on 'end', ->
            csv.end()
        csv.readStream = readStream
        csv


