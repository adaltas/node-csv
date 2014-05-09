
fs = require 'fs'
should = require 'should'
generate = require 'csv-generate'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'API', ->

  it 'write and listen to readable event', (next) ->
    data = ''
    generator = generate length: 2, objectMode: true, seed: 1, columns: 2
    stringifier = stringify eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    generator.on 'error', next
    generator.on 'end', (err) ->
      stringifier.end()
    generator.on 'readable', ->
      while(row = generator.read())
        stringifier.write row
    stringifier.on 'finish', ->
      data.should.eql """
      OMH,ONKCHhJmjadoA
      D,GeACHiN
      """
      next()
