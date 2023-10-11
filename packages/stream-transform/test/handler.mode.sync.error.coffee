
import { generate } from 'csv-generate'
import { transform } from '../lib/index.js'

describe 'handler.mode.sync.error', ->

  it 'catch using stream api', (next) ->
    transformer = transform (record) ->
      throw new Error 'Custom Error'
    transformer.on 'error', (err) ->
      err.message.should.eql 'Custom Error'
      next()
    transformer.on 'finish', ->
      next new Error 'Should not be called'
    transformer.write [ 'trigger 1', 'trigger 2' ]

  it 'catch using pipe api', (next) ->
    generator = generate length: 1000, objectMode: true, seed: 1, headers: 2
    transformer = generator.pipe transform (record) ->
      throw new Error 'Custom Error'
    transformer.on 'error', (err) ->
      err.message.should.eql 'Custom Error'
      next()
    transformer.on 'finish', ->
      next new Error 'Should not be called'
    transformer.write [ 'trigger 1', 'trigger 2' ]

  it 'catch using callback api', (next) ->
    transform [
      [ 'trigger 1' ]
      [ 'trigger 2' ]
      [ 'trigger 3' ]
    ], (record) ->
      throw new Error 'Custom Error'
    , (err, data) ->
      # thrown multiple times for now
      err.message.should.eql 'Custom Error'
      next()
