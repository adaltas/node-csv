
import { stringify } from '../lib/sync.js'

describe 'sync', ->
  
  it 'work on object',  ->
    data = stringify [ {a: '1', b: '2'}, {a: '3', b: '4'}]
    data.should.eql "1,2\n3,4\n"
      
  it 'work on array',  ->
    data = stringify [ ['1', '2'], ['3', '4']]
    data.should.eql "1,2\n3,4\n"
  
  it 'pass options',  ->
    data = stringify [ {a: '1', b: '2'}, {a: '3', b: '4'}], quoted: true, eof: false
    data.should.eql '"1","2"\n"3","4"'
  
  it 'catch error', ->
    (->
      stringify([ 1, {a: '3', b: '4'}])
    ).should.throw 'Invalid Record: expect an array or an object, got 1'
