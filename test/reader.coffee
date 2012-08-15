
fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'reader', ->
    it 'should call error event if exception is thrown in data event', (next) ->
        count = 0
        errors = 0
        test = csv()
        .toPath( "#{__dirname}/write/write_array.tmp" )
        .on 'data', (data, index) ->
            throw new Error "Error in data #{index}" if index % 10 is 0
        .on 'error', (e) ->
            e.message.should.equal 'Error in data 0'
            next()
        .on 'end', ->
            false.should.be.ok
        for i in [0...1000]
            test.write ['Test '+i, i, '"'] if test.writable