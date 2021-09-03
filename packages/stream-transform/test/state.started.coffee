
import transform from '../lib/index.js'

describe 'state.started', ->
  
  it 'start at 0', (next) ->
    transformer = transform ( (val) -> val), (err, data) ->
      next err
    transformer.state.started.should.eql 0
    transformer.write [i] for i in [1..3]
    transformer.end()
    
  it 'equals parallel', (next) ->
    transformer = transform (val, callback) ->
      setTimeout =>
        @state.started.should.be.within 1, 10
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
      transformer.state.started.should.eql 3
      next err
    transformer.write [i] for i in [1..3]
    transformer.end()
