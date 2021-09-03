
import {generate, parse, transform, stringify} from '../lib/sync.js'

describe 'api sync', ->

  it 'generate', ->
    generate length: 1, columns: 1, seed: 1, objectMode: true
    .should.eql [ [ 'OMH' ] ]

  it 'parse', ->
    parse 'abc,def'
    .should.eql [ [ 'abc', 'def' ] ]

  it 'transform', ->
    transform [
      [ 'abc', 'def' ]
    ], (record) ->
      record.push record.shift()
      record
    .should.eql [ [ 'def', 'abc' ] ]

  it 'stringify', ->
    stringify [ [ 'abc', 'def' ] ]
    .should.eql 'abc,def\n'
    
