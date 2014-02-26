
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'header', ->
  
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
      data.should.eql """
      col1,col2
      foo1,goo1
      foo2,goo2
      """
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
      data.should.eql """
      col1,col2
      """
      next()
    stringifier.end()