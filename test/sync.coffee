
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src/sync'

describe 'sync', ->
  
  it 'take a string and return records', ->
    data = parse 'field_1,field_2\nvalue 1,value 2'
    data.should.eql [ [ 'field_1', 'field_2' ], [ 'value 1', 'value 2' ] ]
      
  it 'take a buffer and return records', ->
    data = parse new Buffer 'field_1,field_2\nvalue 1,value 2'
    data.should.eql [ [ 'field_1', 'field_2' ], [ 'value 1', 'value 2' ] ]
    
  it 'honors columns option', ->
    data = parse 'field_1,field_2\nvalue 1,value 2', columns: true
    data.should.eql [ 'field_1': 'value 1', 'field_2': 'value 2' ]
    
    
    
  
