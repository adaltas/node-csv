
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'header', ->

  it 'as "true" and without "column" option with objects', (next) ->
    stringify [
      {field1: 'val11', field2: 'val12', field3: 'val13'}
      {field1: 'val21', field2: 'val22', field3: 'val23'}
    ], header: true, (err, data) ->
      return next err if err
      data.should.eql 'field1,field2,field3\nval11,val12,val13\nval21,val22,val23\n'
      next()

  it 'as "true" and without "column" option with arrays', (next) ->
    stringify [
      ['field1', 'field2', 'field3']
      ['val11', 'val12', 'val13']
      ['val21', 'val22', 'val23']
    ], header: true, (err, data) ->
      return next err if err
      data.should.eql 'field1,field2,field3\nval11,val12,val13\nval21,val22,val23\n'
      next()

  it 'emit header', (next) ->
    count = 0
    data = ''
    stringifier = stringify(columns: [ 'col1', 'col2' ], header: true, rowDelimiter: 'unix')
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 2
      data.should.eql 'col1,col2\nfoo1,goo1\nfoo2,goo2\n'
      next()
    stringifier.write col1: 'foo1', col2: 'goo1'
    stringifier.write col1: 'foo2', col2: 'goo2'
    stringifier.end()
  
  it 'emit header even without a source', (next) ->
    count = 0
    data = ''
    stringifier = stringify(columns: [ 'col1', 'col2' ], header: true, rowDelimiter: 'unix')
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'finish', ->
      data.should.eql 'col1,col2\n'
      next()
    stringifier.end()

  it 'should print headers with defined write columns', (next) ->
    stringify [
      [ 20322051544, 1979, '8.8017226E7', 'ABC', 45, '2000-01-01' ]
      [ 28392898392, 1974, '8.8392926E7', 'DEF', 23, '2050-11-27' ]
    ], header: true, columns: ["FIELD_1", "FIELD_2"], eof: false, (err, data) ->
      data.should.eql """
      FIELD_1,FIELD_2
      20322051544,1979
      28392898392,1974
      """
      next()

  it 'should print headers with true read columns and defined write columns', (next) ->
    stringify [
      { FIELD_1: 20322051544, FIELD_2: '1979', FIELD_3: '8.8017226E7', FIELD_4: 'ABC', FIELD_5: '45', FIELD_6: '2000-01-01' }
      { FIELD_1: 28392898392, FIELD_2: '1974', FIELD_3: '8.8392926E7', FIELD_4: 'DEF', FIELD_5: '23', FIELD_6: '2050-11-27' }
    ], header: true, columns: ["FIELD_1", "FIELD_3"], eof: false, (err, data) ->
      data.should.eql """
      FIELD_1,FIELD_3
      20322051544,8.8017226E7
      28392898392,8.8392926E7
      """
      next()

  it 'should print headers if no records to parse', (next) ->
    stringify [], header: true, columns: ['some', 'headers'], (err, data) ->
      data.should.eql 'some,headers\n'
      next()

  it 'should not print headers if no records to parse and no header option', (next) ->
    stringify [], header: false, columns: ['some', 'headers'], (err, data) ->
      data.should.eql ''
      next()


