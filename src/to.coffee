
fs = require 'fs'
utils = require './utils'

###

Writing data to a source
--------------------------

The `to` property provide convenient functions to write some csv output.

###
module.exports = (csv) ->

    ###

    `to.options([options])`: Set or get options
    -------------------------------------------

    Options are:  

    *   `delimiter`     Set the field delimiter, one character only, defaults to `options.from.delimiter` which is a comma.
    *   `quote`         Defaults to the quote read option.
    *   `quoted`        Boolean, default to false, quote all the fields even if not required.
    *   `escape`        Defaults to the escape read option.
    *   `columns`       List of fields, applied when `transform` returns an object, order matters, see the transform and the columns sections below.
    *   `encoding`      Defaults to 'utf8', applied when a writable stream is created.
    *   `header`        Display the column names on the first line if the columns option is provided.

    *   `lineBreaks`    String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).
    *   `flags`         Defaults to 'w', 'w' to create or overwrite an file, 'a' to append to a file. Applied when using the `toPath` method.
    *   `bufferSize`    Internal buffer holding data before being flushed into a stream. Applied when destination is a stream.
    *   `end`           Prevent calling `end` on the destination, so that destination is no longer writable, similar to passing `{end: false}` option in `stream.pipe()`.
    *   `newColumns`    If the `columns` option is not specified (which means columns will be taken from the reader
                        options, will automatically append new columns if they are added during `transform()`.

    ###
    options: (options) ->
        if options?
            utils.merge csv.options.to, options
            csv
        else
            csv.options.to
    
    ###

    `to.stream(writeStream, [options])`: Write to a stream
    ---------------------------------------------------

    Take a readable stream as first argument and optionally on object of options as a second argument.
    
    ###
    stream: (writeStream, options) ->
        @options options
        switch csv.options.to.lineBreaks
            when 'auto'
                csv.options.to.lineBreaks = null
            when 'unix'
                csv.options.to.lineBreaks = "\n"
            when 'mac'
                csv.options.to.lineBreaks = "\r"
            when 'windows'
                csv.options.to.lineBreaks = "\r\n"
            when 'unicode'
                csv.options.to.lineBreaks = "\u2028"
        writeStream.on 'close', ->
            csv.emit 'end', csv.state.count
            csv.readable = false
            csv.writable = false
        csv.writeStream = writeStream
        csv.state.buffer = new Buffer csv.options.to.bufferSize or csv.from.options().bufferSize
        csv.state.bufferPosition = 0
        csv
    
    ###

    `to.path(path, [options])`: Write to a path
    ----------------------------------------

    Take a file path as first argument and optionally on object of options as a second argument.
    
    ###
    path: (path, options) ->
        # Merge user provided options
        @options options
        # Clone options
        options = utils.merge {}, csv.options.to
        # Delete end property which otherwise overwrite `WriteStream.end()`
        delete options.end
        # Create the write stream
        stream = fs.createWriteStream path, options
        csv.to.stream stream, null


