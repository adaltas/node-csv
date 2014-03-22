
should = require 'should'
generate = require 'csv-generate'
transform = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'pipe', ->

  describe 'pass rows after inversing columns', ->

    it 'in sync mode', (next) ->
      data = []
      generator = generate length: 1000, objectMode: true, seed: 1, headers: 2
      transformer = generator.pipe transform (row) ->
        row.push row.shift()
        row
      transformer.on 'readable', ->
        while(d = transformer.read())
          data.push d
      transformer.on 'finish', ->
        data.slice(0,2).should.eql [
          [ 'ONKCHhJmjadoA', 'OMH' ]
          [ 'GeACHiN', 'D' ]
        ]
        next()

    it 'in async mode', (next) ->
      data = []
      generator = generate length: 1000, objectMode: true, seed: 1, headers: 2
      transformer = generator.pipe transform (row, callback) ->
        row.push row.shift()
        callback null, row
      transformer.on 'readable', ->
        while(d = transformer.read())
          data.push d
      transformer.on 'finish', ->
        data.slice(0,2).should.eql [
          [ 'ONKCHhJmjadoA', 'OMH' ]
          [ 'GeACHiN', 'D' ]
        ]
        next()


