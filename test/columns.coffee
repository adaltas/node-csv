
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'columns', ->
  
  describe 'in read option', ->
  
    it 'Test columns in true', (next) ->
      # Note: if true, columns are expected to be in first line
      csv()
      .from.path( "#{__dirname}/columns/in_true.in", columns: true )
      .to.path( "#{__dirname}/columns/in_true.tmp" )
      .transform (record, index) ->
        record.should.be.a 'object'
        record.should.not.be.an.instanceof Array
        if index is 0
          record.FIELD_1.should.eql '20322051544'
        else if index is 1
          record.FIELD_4.should.eql 'DEF'
        record
      .on 'close', (count) ->
        count.should.eql 2
        expect = fs.readFileSync "#{__dirname}/columns/in_true.out"
        result = fs.readFileSync "#{__dirname}/columns/in_true.tmp"
        result.should.eql expect
        fs.unlink("#{__dirname}/columns/in_true.tmp")
        next()
  
    it 'Test columns in named', (next) ->
      # Note: if true, columns are expected to be in first line
      csv()
      .from.path("#{__dirname}/columns/in_named.in", {
        columns: ["FIELD_1", "FIELD_2", "FIELD_3", "FIELD_4", "FIELD_5", "FIELD_6"]
      })
      .to.path("#{__dirname}/columns/in_named.tmp")
      .transform (record, index) ->
        record.should.be.a 'object'
        record.should.not.be.an.instanceof Array
        if index is 0
          record.FIELD_1.should.eql '20322051544'
        else if index is 1
          record.FIELD_4.should.eql 'DEF'
        record
      .on 'record', (record, index) ->
        record.should.be.a 'object'
        record.should.not.be.an.instanceof Array
      .on 'close', (count) ->
        count.should.eql 2
        expect = fs.readFileSync "#{__dirname}/columns/in_named.out"
        result = fs.readFileSync "#{__dirname}/columns/in_named.tmp"
        result.should.eql expect
        fs.unlink "#{__dirname}/columns/in_named.tmp"
        next()

    it 'should map the column property name to display name', (next) ->
      transformCount = 0
      data = [
        {field1: 'val11', field2: 'val12', field3: 'val13'}
        {field1: 'val21', field2: 'val22', field3: 'val23'}
      ]
      csv()
      .from(data, columns: {field1: 'column1', field3: 'column3'})
      .transform (record, index) ->
        transformCount++
        record.should.eql {field1: data[index].field1, field3: data[index].field3}
        record
      .to (data) ->
        data.should.eql 'column1,column3\nval11,val13\nval21,val23'
        transformCount.should.eql 2
        next()
      , header: true

  describe 'in write option', ->
  
    it 'should be the same length', (next) ->
      # Since there is not columns set in input options, we just expect
      # the output stream to contains 2 fields
      csv()
      .from.path("#{__dirname}/columns/out_no_transform.in")
      .to.path("#{__dirname}/columns/out_no_transform.tmp",
        columns: ["FIELD_1", "FIELD_2"]
      )
      .on 'record', (record, index) ->
        record.should.be.an.instanceof Array
      .on 'close', (count) ->
        count.should.eql 2
        expect = fs.readFileSync "#{__dirname}/columns/out_no_transform.out"
        result = fs.readFileSync "#{__dirname}/columns/out_no_transform.tmp"
        result.should.eql expect
        fs.unlink "#{__dirname}/columns/out_no_transform.tmp"
        next()
  
    it 'should filter from a transformed object', (next) ->
      # We are no returning an object
      csv()
      .from.path("#{__dirname}/columns/out_named.in")
      .to.path("#{__dirname}/columns/out_named.tmp",
        columns: ["FIELD_1", "FIELD_2"]
      )
      .transform (record, index) ->
        record.should.be.an.instanceof Array
        {FIELD_2: record[3], zombie: record[1], FIELD_1: record[4]}
      .on 'record', (record, index) ->
        record.should.be.a 'object'
        record.should.not.be.an.instanceof Array
      .on 'close', (count) ->
        count.should.eql 2
        expect = fs.readFileSync "#{__dirname}/columns/out_named.out"
        result = fs.readFileSync "#{__dirname}/columns/out_named.tmp"
        result.should.eql expect
        fs.unlink "#{__dirname}/columns/out_named.tmp"
        next()
   
    it 'should emit new columns in output', (next) ->
      csv()
      .from.path("#{__dirname}/columns/out_new.in", columns: true)
      .to.path("#{__dirname}/columns/out_new.tmp", newColumns: true, header: true)
      .transform (record) ->
        record.should.be.an.a 'object'
        record.FIELD_7 = 'new_field'
        record
      .on 'close', (count) ->
        count.should.eql 3
        expect = fs.readFileSync "#{__dirname}/columns/out_new.out"
        result = fs.readFileSync "#{__dirname}/columns/out_new.tmp"
        result.should.eql expect
        fs.unlink "#{__dirname}/columns/out_new.tmp"
        next()

    it 'should map the column property name to display name', (next) ->
      transformCount = 0
      data = [
        {field1: 'val11', field2: 'val12', field3: 'val13'}
        {field1: 'val21', field2: 'val22', field3: 'val23'}
      ]
      csv()
      .from(data)
      .transform (record, index) ->
        transformCount++
        record.should.eql data[index]
        record
      .to( (data) ->
        data.should.eql 'column1,column3\nval11,val13\nval21,val23'
        transformCount.should.eql 2
        next()
      , header: true, columns: {field1: 'column1', field3: 'column3'})

  describe 'with both options', ->

    it 'should accept from columns as true ans to columns as array', (next) ->
      data = 'field1,field2,field3\nval1,val2,val3'
      csv()
      .from(data, columns: true)
      .to (data) ->
        data.should.eql 'val1,val3'
        next()
      , columns: ['field1', 'field3']

    it 'should accept from columns as true ans to columns as object with header', (next) ->
      data = 'field1,field2,field3\nval1,val2,val3'
      csv()
      .from(data, columns: true)
      .to (data) ->
        data.should.eql 'column1,column3\nval1,val3'
        next()
      , columns: {field1: 'column1', field3: 'column3'}, header: true

    it 'should reorder if from and to columns are arrays', (next) ->
      csv()
      .from('val1,val2,val3', columns: ['a','b','c'])
      .to (data) ->
        data.should.eql 'val3,val2,val1'
        next()
      , columns: ['c','b','a']






