
should = require 'should'
generate = require 'csv-generate'
transform = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'error', ->

  it 'catch using stream api', (next) ->
      transformer = transform (row) ->
        throw new Error 'Custom Error'
      transformer.on 'error', (err) ->
        err.message.should.eql 'Custom Error'
        next()
      transformer.on 'finish', ->
        next new Error 'Should not be called'
      transformer.write [ 'trigger' ]

  it 'catch using pipe api', (next) ->
      generator = generate length: 1000, objectMode: true, seed: 1, headers: 2
      transformer = generator.pipe transform (row) ->
        throw new Error 'Custom Error'
      transformer.on 'error', (err) ->
        err.message.should.eql 'Custom Error'
        next()
      transformer.on 'finish', ->
        next new Error 'Should not be called'
      transformer.write [ 'trigger' ]

  it 'catch using callback api', (next) ->
    transform [
      [ '20322051544' ]
      [ '28392898392' ]
      [ '83929843999' ]
    ], (row) ->
      throw new Error 'Custom Error'
    , (err, data) ->
      # thrown multiple times for now
      err.message.should.eql 'Custom Error'
      next()
