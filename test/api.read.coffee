
should = require 'should'
generate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'api read', ->

  it 'sync read', (next) ->
    rows = []
    generator = generate length: 5, objectMode: true, seed: 1, columns: 2
    generator.on 'readable', ->
      while row = generator.read()
        rows.push row
    generator.on 'error', next
    generator.on 'end', ->
      rows.should.eql [
        [ 'OMH', 'ONKCHhJmjadoA' ]
        [ 'D', 'GeACHiN' ]
        [ 'nnmiN', 'CGfDKB' ]
        [ 'NIl', 'JnnmjadnmiNL' ]
        [ 'KB', 'dmiM' ]
      ]
      next()

  it 'async read', (next) ->
    @timeout 0
    rows = []
    generator = generate length: 5, objectMode: true, seed: 1, columns: 2
    generator.on 'readable', ->
      length = 0
      run = ->
        row = generator.read()
        return unless row
        length += row.join('').length
        rows.push row
        setTimeout run, 10
      run()
    generator.on 'error', next
    generator.on 'end', ->
      rows.should.eql [
        [ 'OMH', 'ONKCHhJmjadoA' ]
        [ 'D', 'GeACHiN' ]
        [ 'nnmiN', 'CGfDKB' ]
        [ 'NIl', 'JnnmjadnmiNL' ]
        [ 'KB', 'dmiM' ]
      ]
      next()
