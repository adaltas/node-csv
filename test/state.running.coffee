
transform = require '../src'

describe 'state.running', ->
  
  it 'start at 0', (next) ->
    transformer = transform ( (val) -> val), (err, data) ->
      next err
    transformer.state.running.should.eql 0
    transformer.write [i] for i in [1..3]
    transformer.end()
    
  it 'equals parallel', (next) ->
    transformer = transform (val, callback) ->
      setTimeout =>
        @state.running.should.be.within 1, 3
        callback null, val
      , 100
    ,
      parallel: 3
    , (err, data) ->
      next err
    transformer.write [i] for i in [1..10]
    transformer.end()
      
  it 'end at 0', (next) ->
    transformer = transform ( (val) -> val), (err, data) ->
      transformer.state.running.should.eql 0
      next err
    transformer.write [i] for i in [1..3]
    transformer.end()
