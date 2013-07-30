###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'
timers = require 'timers'
# Use process.nextTick when setImmediate isn't there for legacy support of node < 0.10
nextTick = if timers.setImmediate then timers.setImmediate else process.nextTick

describe 'transform', ->

  describe 'sync', ->
  
    it 'should be able to reorder fields', (next) ->
      count = 0
      csv()
      .from.string("""
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """)
      .transform (record, index) ->
        count.should.eql index
        count++
        record.unshift record.pop()
        record
      .on 'end', ->
        count.should.eql 2
      .to.string (result) ->
        result.should.eql """
        2000-01-01,20322051544,1979.0,8.8017226E7,ABC,45
        2050-11-27,28392898392,1974.0,8.8392926E7,DEF,23
        """
        next()
    
    it 'should skip all lines where transform return undefined', (next) ->
      count = 0
      csv()
      .from.string("""
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """)
      .transform (record, index) ->
        count.should.eql index
        count++
        null
      .on 'close', ->
        count.should.eql 2
      .to.string (result) ->
        result.should.eql ''
        next()
    
    it 'should skip all lines where transform return null', (next) ->
      count = 0
      csv()
      .from.string("""
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        82378392929,1972.0,8.8392926E7,FJI,23,2012-04-30
        47191084482,1978.0,8.8392926E7,2FF,23,2064-02-15
        28718040423,1973.0,8.8392926E7,FRE,23,1970-09-02
        24792823783,1971.0,8.8392926E7,POF,23,1978-06-09
        """)
      .transform (record, index) ->
        count.should.eql index
        count++
        if index % 2 then record else null
      .on 'close', ->
        count.should.eql 6
      .to.string (result) ->
        result.should.eql """
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        47191084482,1978.0,8.8392926E7,2FF,23,2064-02-15
        24792823783,1971.0,8.8392926E7,POF,23,1978-06-09
        """
        next()
    
    it 'should recieve an array and return an object', (next) ->
      # we don't define columns
      # recieve and array and return an object
      # also see the columns test
      csv()
      .from.string("""
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27
        """)
      .transform (record, index) ->
        { field_1: record[4], field_2: record[3] }
      .on 'close', (count) ->
        count.should.eql 2
      .on 'error', (e) ->
        should.be.ok false
      .to.string (result) ->
        result.should.eql """
        45,ABC
        23,DEF
        """
        next()
    
    it 'should accept a returned string', (next) ->
      csv()
      .from.string("""
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27
        """)
      .transform (record, index) ->
        ( if index > 0 then ',' else '' ) + record[4] + ":" + record[3]
      .on 'close', (count) ->
        count.should.eql 2
      .to.string (result) ->
        result.should.eql '45:ABC,23:DEF'
        next()
    
    it 'should accept a returned number', (next) ->
      csv()
      .from.string('a\nb\nc')
      .transform (record, index) ->
        index + 1
      .on 'close', (count) ->
        count.should.eql 2
      .to.string (data) ->
        data.should.eql '123'
        next()
    
    it 'should accept a returned integer', (next) ->
      result = ''
      test = csv()
      .transform (record, index) ->
        record[1]
      .on 'data', (record) ->
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
      .from.string("""
        20322051544,8.8017226E7,4.5,1978-10-09,,1
        28392898392,8.8392926E7,8.3,2000-01-01,1,
        """)
      .transform (record, index) ->
        record[3] = record[3].split('-')
        [parseInt(record[0]), parseFloat(record[1]), parseFloat(record[2]) ,Date.UTC(record[3][0], record[3][1], record[3][2]), !!record[4], !!record[5]]
      .on 'end', (count) ->
        count.should.eql 2
      .to.string (result) ->
        result.should.eql """
        20322051544,88017226,4.5,279417600000,,1
        28392898392,88392926,8.3,949363200000,1,
        """
        next()
    
    it 'should catch error thrown in transform callback', (next) ->
      count = 0
      error = false
      test = csv()
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
      .on 'end', ->
        false.should.be.ok
      .to.string (result) ->
        false.should.be.ok
      for i in [0...1000]
        test.write ['Test '+i, i, '"'] unless error

    it 'shoud handle columns option with header', (next) ->
      csv()
        .from('col1,col2\na1,a2\nb1,b2', columns:true)
        .to( (data) ->
          data.should.eql """
          col1,col2,foo
          a1,a2,bar
          b1,b2,bar
          """
          next()
        , newColumns:true, header:true)
        .transform (data, index) ->
          data.foo = 'bar';
          data

  describe 'async', ->

    it 'should output the record if passed in the callback as an arraw', (next) ->
      csv()
      .from('a1,b1\na2,b2')
      .to (data) ->
        data.should.eql 'b1,a1\nb2,a2'
        next()
      .transform (record, index, callback) ->
        nextTick ->
          callback null, record.reverse()

    it 'should output the record if passed in the callback as an object', (next) ->
      csv()
      .from('a1,b1\na2,b2')
      .to (data) ->
        data.should.eql 'b1,a1\nb2,a2'
        next()
      .transform (record, index, callback) ->
        nextTick ->
          callback null, a: record[1], b: record[0]

    it 'should skip the record if callback called without a record', (next) ->
      csv()
      .from('a1,b1\na2,b2\na3,b3\na4,b4')
      .to (data) ->
        data.should.eql 'a1,b1\na3,b3'
        next()
      .transform (record, index, callback) ->
        nextTick ->
          callback null, if index % 2 is 0 then record else null

    it 'should run 20 transforms in parallel by default', (next) ->
      count = 0
      test = csv()
      .to (data) ->
        next()
      .transform (record, index, callback) ->
        count++
        nextTick ->
          (count <= 20).should.be.ok
          count--
          callback null, record
      , parallel: 20
      for i in [0...100]
        test.write 'Goldorak go\n'
      test.end()

    it 'should run sequentially if parallel is 1', (next) ->
      running = 0
      count = 0
      test = csv()
      .to (data) ->
        next()
      .transform (record, index, callback) ->
        index.should.eql count
        count++
        running.should.equal 0
        running++
        nextTick ->
          running--
          running.should.equal 0
          callback null, record
      , parallel: 1
      for i in [0...100]
        test.write 'Goldorak go\n'
      test.end()

    it 'shoud handle columns option with header', (next) ->
      csv()
      .from('col1,col2\na1,a2\nb1,b2', columns:true)
      .to( (data) ->
        data.should.eql """
        col1,col2,foo
        a1,a2,bar
        b1,b2,bar
        """
        next()
      , newColumns:true, header:true)
      .transform (data, index, callback) ->
        nextTick ->
          data.foo = 'bar';
          callback null, data
