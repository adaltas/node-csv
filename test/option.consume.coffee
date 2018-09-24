
pad = require 'pad'
generate = require 'csv-generate'
transform = require '../src'

describe 'option consume', ->

  it 'async', (next) ->
    @timeout 0
    data = []
    count = 0
    generator = generate length: 100000, objectMode: true
    transformer = generator.pipe transform (row, callback) ->
      count++
      setImmediate  -> callback null, ''
    , parallel: 7, consume: true
    transformer.on 'error', next
    transformer.on 'finish', ->
      count.should.eql 100000
      next()

  it 'sync', (next) ->
    @timeout 0
    data = []
    count = 0
    generator = generate length: 100000, objectMode: true
    transformer = generator.pipe transform (row) ->
      count++
      ''
    , parallel: 10, consume: true
    transformer.on 'error', next
    transformer.on 'end', ->
      count.should.eql 100000
      next()

describe 'sequential', ->

  it 'async', (next) ->
    @timeout 0
    data = []
    count = 0
    generator = generate length: 100000, objectMode: true
    transformer = generator.pipe transform (row, callback) ->
      count++
      setImmediate  -> callback null, ''
    , parallel: 1, consume: true
    transformer.on 'finish', ->
      count.should.eql 100000
      next()

  it 'sync', (next) ->
    @timeout 0
    data = []
    count = 0
    generator = generate length: 100000, objectMode: true
    transformer = generator.pipe transform (row) ->
      count++
      ''
    , parallel: 1, consume: true
    transformer.on 'finish', ->
      count.should.eql 100000
      next()
    
