
fs = require 'fs'
utils = require './utils'

###

Writing data to a source
--------------------------

The `to` property provide convenient functions to write some csv output.

###
module.exports = (csv) ->
    ###

    `stream(writeStream, [options])`: Write to a stream
    ---------------------------------------------------

    Take a readable stream as first argument and optionally on object of options as a second argument.
    
    ###
    stream: (writeStream, options) ->
        utils.merge csv.writeOptions, options if options
        switch csv.writeOptions.lineBreaks
            when 'auto'
                csv.writeOptions.lineBreaks = null
            when 'unix'
                csv.writeOptions.lineBreaks = "\n"
            when 'mac'
                csv.writeOptions.lineBreaks = "\r"
            when 'windows'
                csv.writeOptions.lineBreaks = "\r\n"
            when 'unicode'
                csv.writeOptions.lineBreaks = "\u2028"
        writeStream.on 'close', ->
            csv.emit 'end', csv.state.count
            csv.readable = false
            csv.writable = false
        csv.writeStream = writeStream
        csv.state.buffer = new Buffer csv.writeOptions.bufferSize or csv.from.options().bufferSize
        csv.state.bufferPosition = 0
        csv
    ###

    `path(path, [options])`: Write to a path
    ----------------------------------------

    Take a file path as first argument and optionally on object of options as a second argument.
    
    ###
    path: (path, options) ->
        # Merge user provided options
        utils.merge csv.writeOptions,options if options
        # clone options
        options = utils.merge {}, csv.writeOptions
        # Delete end property which otherwise overwrite `WriteStream.end()`
        delete options.end
        # Create the write stream
        stream = fs.createWriteStream path, options
        csv.to.stream stream, null


