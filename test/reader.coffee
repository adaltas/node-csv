
fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'reader', ->
    it 'Test exception in on(data)"', (next) ->
        count = 0
        errors = 0
        test = csv()
        .toPath( "#{__dirname}/write/write_array.tmp" )
        .on 'data', (data, index) ->
            throw new Error 'Error in data' if index % 10 is 0
        .on 'error', ->
            next()
        .on 'end', ->
            false.should.be.ok
        for i in [0...1000]
            test.write ['Test '+i, i, '"'] if test.writable