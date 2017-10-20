
generate = require 'csv-generate'
transform = require '../src'

describe 'option params', ->

  it 'sync', (next) ->
    generator = generate length: 100, objectMode: true, seed: 1
    transformer = generator.pipe transform (row, params) ->
      params.my_key.should.eql 'my value'
    , parallel: 10, consume: true, params: my_key: 'my value'
    transformer.on 'error', next
    transformer.on 'finish', ->
      next()

  it 'async', (next) ->
    generator = generate length: 100, objectMode: true, seed: 1
    transformer = generator.pipe transform (row, callback, params) ->
      params.my_key.should.eql 'my value'
      setImmediate  -> callback null, ''
    , parallel: 10, consume: true, params: my_key: 'my value'
    transformer.on 'error', next
    transformer.on 'finish', ->
      next()
