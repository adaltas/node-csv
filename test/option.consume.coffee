
pad = require 'pad'
generate = require 'csv-generate'
transform = require '../src'

letters = (number) ->
  text = "#{number}"
  text = "#{pad 3, text, '0'}"
  text = for c in text
    65 - 49 + 1 + c.charCodeAt 0
  String.fromCharCode text...

describe 'option consume', ->

  it 'async', (next) ->
    @timeout 0
    data = []
    count = 0
    generator = generate length: 100000, objectMode: true, seed: 1
    transformer = generator.pipe transform (row, callback) ->
      count++
      setImmediate  -> callback null, ''
    , parallel: 10, consume: true
    transformer.on 'finish', ->
      count.should.eql 100000
      next()

  it 'sync', (next) ->
    @timeout 0
    data = []
    count = 0
    generator = generate length: 100000, objectMode: true, seed: 1
    transformer = generator.pipe transform (row) ->
      count++
      ''
    , parallel: 10, consume: true
    transformer.on 'finish', ->
      count.should.eql 100000
      next()

describe 'sequential', ->

  it 'async', (next) ->
    @timeout 0
    data = []
    count = 0
    generator = generate length: 100000, objectMode: true, seed: 1
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
    generator = generate length: 100000, objectMode: true, seed: 1
    transformer = generator.pipe transform (row) ->
      count++
      ''
    , parallel: 1, consume: true
    transformer.on 'finish', ->
      count.should.eql 100000
      next()
    
