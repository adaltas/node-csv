
fs = require 'fs'
should = require 'should'
generate = require 'csv-generate'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'stringify', ->

  it 'implement transform', (next) ->
    data = ''
    generator = generate length: 2, objectMode: true, seed: 1, headers: 2
    stringifier = stringify()
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

  it 'pipe to file', (next) ->
    data = ''
    generator = generate length: 2, objectMode: true, seed: 1, headers: 2
    stringifier = stringify()
    ws = fs.createWriteStream '/tmp/large.out'
    generator.pipe(stringifier).pipe(ws).on 'finish', ->
      fs.readFile '/tmp/large.out', 'ascii', (err, data) ->
        data.should.eql """
        OMH,ONKCHhJmjadoA
        D,GeACHiN
        """
        next()

  it 'pipe', (next) ->
    data = ''
    generator = generate length: 2, objectMode: true, seed: 1, headers: 2
    stringifier = generator.pipe stringify()
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
   
    stringifier.on 'finish', ->
      data.should.eql """
      OMH,ONKCHhJmjadoA
      D,GeACHiN
      """
      next()
