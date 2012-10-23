
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'
generator = if process.env.CSV_COV then require '../lib-cov/generator' else require '../src/generator'

describe 'from', ->

  describe 'auto', ->

    it 'should parse a string', (next) ->
      csv()
      .from('"1","2","3","4","5"')
      .on 'record', (record) ->
        record.length.should.eql 5
      .on 'end', ->
        next()

    it 'should parse an array', (next) ->
      csv()
      .from(['"1","2","3","4","5"',['1','2','3','4','5']])
      .on 'record', (record) ->
        record.length.should.eql 5
      .on 'end', ->
        next()

    it 'should parse a file', (next) ->
      csv()
      .from("#{__dirname}/from/file.csv")
      .on 'record', (record) ->
        record.length.should.eql 5
      .on 'end', ->
        next()

    it 'should parse a stream', (next) ->
      csv()
      .from(fs.createReadStream "#{__dirname}/from/file.csv")
      .on 'record', (record) ->
        record.length.should.eql 5
      .on 'end', ->
        next()

  describe 'stream', ->

    it 'should be able to pause', (next) ->
      paused = false
      csv()
      .from.stream(generator(start: true, duration: 500))
      .on 'record', (record, index) ->
        paused.should.be.false
        if index is 5
          @pause()
          @paused.should.be.true
          paused = true
          resume = () =>
            paused = false
            @resume()
          setTimeout resume, 100
      .on 'end', ->
        paused.should.be.false
        next()

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
  
  it 'Test string without destination', (next) ->
    string = """
    20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
    28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
    """
    csv()
    .from.string(string)
    .on 'record', (record, index) ->
      index.should.be.below 2
      if index is 0
        record[0].should.eql '20322051544'
      else if index is 1
        record[0].should.eql '28392898392'
    .on 'end', (count) ->
      count.should.eql 2
      next()

  describe 'array', ->

    it 'should emit all records as objects', (next) ->
      transformCount = onRecordCount = 0
      data = [
        {field1: 'val11', field2: 'val12', field3: 'val13'}
        {field1: 'val21', field2: 'val22', field3: 'val23'}
      ]
      csv()
      .from.array(data)
      .transform (record, index) ->
        transformCount++
        record.should.eql data[index]
        record
      .on 'record', (record, index) ->
        onRecordCount++
        record.should.eql data[index]
      .to (data) ->
        data.should.eql 'val11,val12,val13\nval21,val22,val23'
        transformCount.should.equal 2
        onRecordCount.should.equal 2
        next()

    it 'should handle column option set to true', (next) ->
      console.log 'todo'
      return next()
      transformCount = onRecordCount = 0
      data = [
        {field1: 'val11', field2: 'val12', field3: 'val13'}
        {field1: 'val21', field2: 'val22', field3: 'val23'}
      ]
      csv()
      .from.array(data, columns: true)
      .transform (record, index) ->
        transformCount++
        record.should.eql data[index]
        record
      .on 'record', (record, index) ->
        onRecordCount++
        record.should.eql data[index]
      .to (data) ->
        data.should.eql 'val11,val12,val13\nval21,val22,val23'
        transformCount.should.equal 2
        onRecordCount.should.equal 2
        next()

    it 'should filter by columns', (next) ->
      transformCount = onRecordCount = 0
      data = [
        {field1: 'val11', field2: 'val12', field3: 'val13'}
        {field1: 'val21', field2: 'val22', field3: 'val23'}
      ]
      csv()
      .from.array(data, columns: ['field1', 'field3'])
      .transform (record, index) ->
        transformCount++
        record.should.eql {field1: data[index].field1, field3: data[index].field3}
        record
      .on 'record', (record, index) ->
        onRecordCount++
        record.should.eql {field1: data[index].field1, field3: data[index].field3}
      .to (data) ->
        data.should.eql 'val11,val13\nval21,val23'
        transformCount.should.equal 2
        onRecordCount.should.equal 2
        next()




