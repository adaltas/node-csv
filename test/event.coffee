
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'event', ->

  describe 'record', ->

    it 'should call error event if exception is thrown', (next) ->
      count = 0
      errors = 0
      test = csv()
      .on 'record', (record, index) ->
        throw new Error "Error in record #{index}" if index % 10 is 0
      .on 'error', (e) ->
        e.message.should.equal 'Error in record 0'
        next()
      .on 'close', ->
        false.should.be.ok
      .to.string (result) ->
        should.not.be.true false
      for i in [0...1000]
        test.write ['Test '+i, i, '"'] if test.writable
