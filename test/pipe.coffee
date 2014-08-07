
should = require 'should'
stream = require 'stream'
generate = require 'csv-generate'
transform = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'pipe', ->

  describe 'source', ->

    it 'in sync mode', (next) ->
      data = []
      generator = generate length: 1000, objectMode: true, seed: 1, columns: 2
      transformer = generator.pipe transform (row) ->
        row.push row.shift()
        row
      transformer.on 'readable', ->
        while(d = transformer.read())
          data.push d
      transformer.on 'end', ->
        data.slice(0,2).should.eql [
          [ 'ONKCHhJmjadoA', 'OMH' ]
          [ 'GeACHiN', 'D' ]
        ]
        next()

    it 'in async mode', (next) ->
      data = []
      generator = generate length: 1000, objectMode: true, seed: 1, columns: 2
      transformer = generator.pipe transform (row, callback) ->
        row.push row.shift()
        callback null, row
      transformer.on 'readable', ->
        while(d = transformer.read())
          data.push d
      transformer.on 'end', ->
        data.slice(0,2).should.eql [
          [ 'ONKCHhJmjadoA', 'OMH' ]
          [ 'GeACHiN', 'D' ]
        ]
        next()

  describe 'source and destination', ->

    it 'in sync mode', (next) ->
      @timeout 0
      count = 0
      generator = generate length: 10000, objectMode: true, seed: 1, columns: 2
      destination = new stream.Writable
      destination._write = (chunk, encoding, callback) ->
        setImmediate callback
      destination.on 'finish', next
      generator
      .pipe transform (row) ->
        row.join ','
      .pipe destination

    it 'in async mode', (next) ->
      @timeout 0
      generator = generate length: 10000, objectMode: true, seed: 1, columns: 2
      destination = new stream.Writable
      destination._write = (chunk, encoding, callback) ->
        setImmediate callback
      destination.on 'finish', next
      generator
      .pipe transform (row, callback) ->
        setImmediate ->
          callback null, row.join ','
      .pipe destination


