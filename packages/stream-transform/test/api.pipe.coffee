
import stream from 'stream'
import generate from 'csv-generate'
import transform from '../lib/index.js'

describe 'api.pipe', ->

  describe 'source', ->

    it 'in sync mode', (next) ->
      data = []
      generator = generate length: 1000, objectMode: true, seed: 1, columns: 2
      transformer = generator.pipe transform (record) ->
        record.push record.shift()
        record
      transformer.on 'readable', ->
        while(d = transformer.read())
          data.push d
      transformer.on 'end', ->
        data.length.should.eql 1000
        data.slice(0,2).should.eql [
          [ 'ONKCHhJmjadoA', 'OMH' ]
          [ 'GeACHiN', 'D' ]
        ]
        next()

    it 'in async mode', (next) ->
      data = []
      generator = generate length: 1000, objectMode: true, seed: 1, columns: 2
      transformer = generator.pipe transform (record, callback) ->
        record.push record.shift()
        callback null, record
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
      .pipe transform (record) ->
        record.join ','
      .pipe destination

    it 'in async mode', (next) ->
      @timeout 0
      generator = generate length: 10000, objectMode: true, seed: 1, columns: 2
      destination = new stream.Writable
      destination._write = (chunk, encoding, callback) ->
        setImmediate callback
      destination.on 'finish', next
      generator
      .pipe transform (record, callback) ->
        setImmediate ->
          callback null, record.join ','
      .pipe destination
