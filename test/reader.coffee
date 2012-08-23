
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'reader', ->

    it 'should call data event when data is provided in from', (next) ->
        csv()
        .from.string('"1","2","3","4","5"')
        .on 'data', (data) ->
            data.length.should.eql 5
        .on 'end', ->
            next()

    it 'should include empty last column', (next) ->
        csv()
        .from.string('"1","2","3","4","5",')
        .on 'data', (data) ->
            data.length.should.eql 6
        .on 'end', ->
            next()

    it 'should include empty last column surrounded by quotes', (next) ->
        csv()
        .from.string('"1","2","3","4","5",""')
        .on 'data', (data) ->
            data.length.should.eql 6
        .on 'end', ->
            next()

    it 'should include empty last column if followed by linebreak', (next) ->
        csv()
        .from.string('"1","2","3","4","5",""\n')
        .on 'data', (data) ->
            data.length.should.eql 6
        .on 'end', ->
            next()

    it 'should call error event if exception is thrown in data event', (next) ->
        count = 0
        errors = 0
        test = csv()
        .to.path( "#{__dirname}/write/write_array.tmp" )
        .on 'data', (data, index) ->
            throw new Error "Error in data #{index}" if index % 10 is 0
        .on 'error', (e) ->
            e.message.should.equal 'Error in data 0'
            next()
        .on 'end', ->
            false.should.be.ok
        for i in [0...1000]
            test.write ['Test '+i, i, '"'] if test.writable