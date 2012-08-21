
fs = require 'fs'
utils = require './utils'

module.exports = (csv) ->
    options =
        delimiter: ','
        quote: '"'
        escape: '"'
        columns: null
        flags: 'r'
        encoding: 'utf8'
        bufferSize: 8 * 1024 * 1024
        trim: false
        ltrim: false
        rtrim: false
    options: ->
        if arguments.length
            utils.merge options, arguments[0]
            csv
        else
            options
    array: (data, options) ->
        this.options options
        process.nextTick ->
            for i in [0...data.length]
                csv.write data[i]
            csv.end()
        csv
    string: (data, options) ->
        this.options options
        process.nextTick ->
            # A string is handle exactly the same way as a single `write` call 
            # which is then closed. This is because the `write` function may receive
            # multiple and incomplete lines.
            csv.write data
            csv.end()
        csv
    path: (path, options) ->
        this.options options
        stream = fs.createReadStream path, csv.from.options()
        stream.setEncoding csv.from.options().encoding
        csv.from.stream stream, null
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


