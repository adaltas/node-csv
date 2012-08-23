
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'reader', ->

  describe 'string', ->

    it 'should call record event when record is provided in from', (next) ->
      csv()
      .from.string('"1","2","3","4","5"')
      .on 'record', (record) ->
        record.length.should.eql 5
      .on 'end', ->
        next()

    it 'should include empty last column', (next) ->
      csv()
      .from.string('"1","2","3","4","5",')
      .on 'record', (record) ->
        record.length.should.eql 6
      .on 'end', ->
        next()

    it 'should include empty last column surrounded by quotes', (next) ->
      csv()
      .from.string('"1","2","3","4","5",""')
      .on 'record', (record) ->
        record.length.should.eql 6
      .on 'end', ->
        next()

    it 'should include empty last column if followed by linebreak', (next) ->
      csv()
      .from.string('"1","2","3","4","5",""\n')
      .on 'record', (record) ->
        record.length.should.eql 6
      .on 'end', ->
        next()
