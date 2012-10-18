
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'transform', ->
  
  it 'should be able to reorder fields', (next) ->
    count = 0
    csv()
    .from.path("#{__dirname}/transform/reorder.in")
    .to.path("#{__dirname}/transform/reorder.tmp")
    .transform (record, index) ->
      count.should.eql index
      count++
      record.unshift record.pop()
      record
    .on 'close', ->
      count.should.eql 2
      expect = fs.readFileSync("#{__dirname}/transform/reorder.out").toString()
      result = fs.readFileSync("#{__dirname}/transform/reorder.tmp").toString()
      result.should.eql expect
      fs.unlink "#{__dirname}/transform/reorder.tmp", next
  
  it 'should skip all lines where transform return undefined', (next) ->
    count = 0
    csv()
    .from.path("#{__dirname}/transform/undefined.in")
    .to.path("#{__dirname}/transform/undefined.tmp")
    .transform (record, index) ->
      count.should.eql index
      count++
      null
    .on 'close', ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/transform/undefined.out"
      result = fs.readFileSync "#{__dirname}/transform/undefined.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/transform/undefined.tmp", next
  
  it 'should skip all lines where transform return null', (next) ->
    count = 0
    csv()
    .from.path("#{__dirname}/transform/null.in")
    .to.path("#{__dirname}/transform/null.tmp")
    .transform (record, index) ->
      count.should.eql index
      count++
      if index % 2 then record else null
    .on 'close', ->
      count.should.eql 6
      expect = fs.readFileSync "#{__dirname}/transform/null.out"
      result = fs.readFileSync "#{__dirname}/transform/null.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/transform/null.tmp", next
  
  it 'should recieve an array and return an object', (next) ->
    # we don't define columns
    # recieve and array and return an object
    # also see the columns test
    csv()
    .from.path("#{__dirname}/transform/object.in")
    .to.path("#{__dirname}/transform/object.tmp")
    .transform (record, index) ->
      { field_1: record[4], field_2: record[3] }
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/transform/object.out"
      result = fs.readFileSync "#{__dirname}/transform/object.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/transform/object.tmp", next
    .on 'error', (e) ->
      should.be.ok false
  
  it 'should accept a returned string', (next) ->
    csv()
    .from.path("#{__dirname}/transform/string.in")
    .to.path("#{__dirname}/transform/string.tmp")
    .transform (record, index) ->
      ( if index > 0 then ',' else '' ) + record[4] + ":" + record[3]
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/transform/string.out"
      result = fs.readFileSync "#{__dirname}/transform/string.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/transform/string.tmp", next
  
  it 'should accept a returned integer', (next) ->
    result = ''
    test = csv()
    .transform (record, index) ->
      record[1]
    .on 'record', (record) ->
      result += record
    .on 'end', ->
      result.should.eql '210'
      next()
    for i in [2..0]
      test.write ['Test '+i, i, '"']
    test.end()
  
  it 'should accept a returned array with different types', (next) ->
    # Test date, int and float
    csv()
    .from.path("#{__dirname}/transform/types.in")
    .to.path("#{__dirname}/transform/types.tmp")
    .transform (record, index) ->
      record[3] = record[3].split('-')
      [parseInt(record[0]), parseFloat(record[1]), parseFloat(record[2]) ,Date.UTC(record[3][0], record[3][1], record[3][2]), !!record[4], !!record[5]]
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/transform/types.out"
      result = fs.readFileSync "#{__dirname}/transform/types.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/transform/types.tmp", next
  
  it 'should catch error thrown in transform callback', (next) ->
    count = 0
    error = false
    test = csv()
    .to.path( "#{__dirname}/write/write_array.tmp" )
    .transform (record, index) ->
      throw new Error "Error at index #{index}" if index % 10 is 9
      record
    .on 'error', (e) ->
      error = true
      e.message.should.equal 'Error at index 9'
      # Test if readstream is destroyed on error
      # Give it some time in case transform keep being called even after the error
      setTimeout next, 100
    .on 'record', (record) ->
      record[1].should.be.below 9
    .on 'close', ->
      false.should.be.ok
      next()
    for i in [0...1000]
      test.write ['Test '+i, i, '"'] unless error

  describe 'async', ->

    it 'should output the record if passed in the callback as an arraw', (next) ->
      csv()
      .from('a1,b1\na2,b2')
      .to( (data) ->
        data.should.eql 'b1,a1\nb2,a2'
        next() )
      .transform (record, index, callback) ->
        process.nextTick ->
          callback null, record.reverse()

    it 'should output the record if passed in the callback as an object', (next) ->
      csv()
      .from('a1,b1\na2,b2')
      .to( (data) ->
        data.should.eql 'b1,a1\nb2,a2'
        next() )
      .transform (record, index, callback) ->
        process.nextTick ->
          callback null, a: record[1], b: record[0]

    it 'should skip the record if callback called without a record', (next) ->
      csv()
      .from('a1,b1\na2,b2\na3,b3\na4,b4')
      .to( (data) ->
        data.should.eql 'a1,b1\na3,b3'
        next() )
      .transform (record, index, callback) ->
        process.nextTick ->
          callback null, if index % 2 is 0 then record else null





