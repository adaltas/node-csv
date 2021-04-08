
transform = require '../src'

describe 'handler', ->

  it 'context sync', (next) ->
    transformer = transform [
      [ 'a','b','c' ]
      [ '1','2','3' ]
    ], (record) ->
      transformer.should.eql this
      return record
    , next

  it 'context async', (next) ->
    transformer = transform [
      [ 'a','b','c' ]
      [ '1','2','3' ]
    ], (record, callback) ->
      transformer.should.eql this
      callback null, record
    , next
    
  
