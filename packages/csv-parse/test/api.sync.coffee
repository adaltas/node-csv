
import { parse } from '../lib/sync.js'

describe 'API sync', ->
  
  it 'take a string and return records', ->
    data = parse 'field_1,field_2\nvalue 1,value 2'
    data.should.eql [ [ 'field_1', 'field_2' ], [ 'value 1', 'value 2' ] ]
  
  it 'take a buffer and return records', ->
    data = parse Buffer.from 'field_1,field_2\nvalue 1,value 2'
    data.should.eql [ [ 'field_1', 'field_2' ], [ 'value 1', 'value 2' ] ]
  
  it 'honors columns option', ->
    data = parse 'field_1,field_2\nvalue 1,value 2', columns: true
    data.should.eql [ 'field_1': 'value 1', 'field_2': 'value 2' ]
  
  it 'honors objname option', ->
    data = parse 'field_1,field_2\nname 1,value 1\nname 2,value 2', objname: 'field_1', columns: true
    data.should.eql {
      'name 1': {'field_1': 'name 1', 'field_2': 'value 1'},
      'name 2': {'field_1': 'name 2', 'field_2': 'value 2'}
    }
  
  it 'honors to_line', ->
    data = parse '1\n2\n3\n4', to_line: 2
    data.should.eql [ [ '1' ], [ '2' ] ]
  
  it 'catch errors', ->
    try
      parse 'A,B\nB\nC,K', trim: true
      throw Error 'Error not catched'
    catch err
      err.message.should.eql 'Invalid Record Length: expect 2, got 1 on line 2'
  
  it 'catch err in last line while flushing', ->
    ( ->
      parse """
      headerA, headerB
      A2, B2
      A1, B1, C2, D2
      """
    ).should.throw 'Invalid Record Length: expect 2, got 4 on line 3'
    
    
  
