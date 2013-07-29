
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'columns', ->
  
  describe 'defined in read option', ->
  
    it 'accept a boolean true', (next) ->
      count = 0
      # Note: if true, columns are expected to be in first line
      csv()
      .from.string( """
        FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27
        """, columns: true )
      .transform (record, index) ->
        record.should.be.a 'object'
        record.should.not.be.an.instanceof Array
        if index is 0
          record.should.eql FIELD_1: '20322051544', FIELD_2: '1979', FIELD_3: '8.8017226E7', FIELD_4: 'ABC', FIELD_5: '45', FIELD_6: '2000-01-01'
        else if index is 1
          record.FIELD_4.should.eql 'DEF'
        record
      .on 'record', (record, index) ->
        record.should.be.a 'object'
        record.should.not.be.an.instanceof Array
        index.should.eql count
        if index is 0
          record.should.eql FIELD_1: '20322051544', FIELD_2: '1979', FIELD_3: '8.8017226E7', FIELD_4: 'ABC', FIELD_5: '45', FIELD_6: '2000-01-01'
        else if index is 1
          record.FIELD_4.should.eql 'DEF'
        count++
      .to.string (result) ->
        result.should.eql """
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27
        """
        next()
  
    it 'accept a list of column names', (next) ->
      count = 0
      # Note: if true, columns are expected to be in first line
      csv()
      .from.string("""
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27
        """, {
        columns: ["FIELD_1", "FIELD_2", "FIELD_3", "FIELD_4", "FIELD_5", "FIELD_6"]
      })
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
        index.should.eql count
        if index is 0
          record.FIELD_1.should.eql '20322051544'
        else if index is 1
          record.FIELD_4.should.eql 'DEF'
        count++
      .to.string (result) ->
        result.should.eql """
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27
        """
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

  describe 'defined in write option', ->
  
    it 'should be the same length', (next) ->
      # Since there is not columns set in input options, we just expect
      # the output stream to contains 2 fields
      csv()
      .from.string("""
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27
        """)
      .on 'record', (record, index) ->
        record.should.be.an.instanceof Array
      .to.string( (result) ->
        result.should.eql """
        20322051544,1979
        28392898392,1974
        """
        next()
      , columns: ["FIELD_1", "FIELD_2"])
  
    it 'should filter from a transformed object', (next) ->
      # We are no returning an object
      csv()
      .from.string("""
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27
        """)
      .transform (record, index) ->
        record.should.be.an.instanceof Array
        {FIELD_2: record[3], zombie: record[1], FIELD_1: record[4]}
      .on 'record', (record, index) ->
        record.should.be.a 'object'
        record.should.not.be.an.instanceof Array
      .on 'end', (count) ->
        count.should.eql 2
      .to.string( (result) ->
        result.should.eql """
        45,ABC
        23,DEF
        """
        next()
      , columns: ["FIELD_1", "FIELD_2"])
   
    it 'should emit new columns in output', (next) ->
      process.maxTickDepth = 2
      csv()
      .from.string("""
        FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27
        83929843999,1944,8.8349294E2,HIJ,17,2060-08-28
        """, columns: true)
      .transform (record) ->
        record.should.be.an.a 'object'
        record.FIELD_7 = 'new_field'
        record
      .on 'end', (count) ->
        count.should.eql 3
      .to.string( (result) ->
        result.should.eql """
        FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6,FIELD_7
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01,new_field
        28392898392,1974,8.8392926E7,DEF,23,2050-11-27,new_field
        83929843999,1944,8.8349294E2,HIJ,17,2060-08-28,new_field
        """
        next()
      , newColumns: true, header: true)

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

    it 'is defined as an array and output with to.array while skiping last column', (next) ->
      csv()
      .from("a,b,c,d")
      .to.array (data, count) ->
        data.should.eql [field1: 'a', field2: 'b', field3:'c']
        next()
      , columns: ['field1', 'field2', 'field3']

  describe 'with both options', ->

    it 'accepts from columns as true ans to columns as array', (next) ->
      csv()
      .from('field1,field2,field3\nval1,val2,val3', columns: true)
      .to (data) ->
        data.should.eql 'val1,val3'
        next()
      , columns: ['field1', 'field3']

    it 'accepts from columns as true ans to columns as object with header', (next) ->
      csv()
      .from('field1,field2,field3\nval1,val2,val3', columns: true)
      .to (data) ->
        data.should.eql 'column1,column3\nval1,val3'
        next()
      , columns: {field1: 'column1', field3: 'column3'}, header: true

    it 'accepts from and to as arrays inside to.array', (next) ->
      csv()
      .from("id,out,title,description\na,b,c,d", columns: true)
      .to.array (data, count) ->
        data.should.eql [id: 'a', title: 'c', description:'d']
        next()
      , columns: ['id', 'title', 'description']

    it 'reorders if from and to columns are arrays', (next) ->
      csv()
      .from('val1,val2,val3', columns: ['a','b','c'])
      .to (data) ->
        data.should.eql 'val3,val2,val1'
        next()
      , columns: ['c','b','a']






