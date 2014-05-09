
fs = require 'fs'
should = require 'should'
generate = require 'csv-generate'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'API pipe', ->

  it 'pipe to destination', (next) ->
    data = ''
    generator = generate length: 2, objectMode: true, seed: 1, columns: 2
    stringifier = stringify eof: false
    ws = fs.createWriteStream '/tmp/large.out'
    generator.pipe(stringifier).pipe(ws).on 'finish', ->
      fs.readFile '/tmp/large.out', 'ascii', (err, data) ->
        data.should.eql """
        OMH,ONKCHhJmjadoA
        D,GeACHiN
        """
        fs.unlink '/tmp/large.out', next

  it 'pipe from source', (next) ->
    data = ''
    generator = generate length: 2, objectMode: true, seed: 1, columns: 2
    stringifier = generator.pipe stringify eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'finish', ->
      data.should.eql """
      OMH,ONKCHhJmjadoA
      D,GeACHiN
      """
      next()