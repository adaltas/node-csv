
import fs from 'fs'
import generate from 'csv-generate'
import stringify from '../lib/index.js'

describe 'API pipe', ->

  it 'pipe from source to destination', (next) ->
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

  it 'pipe to destination', (next) ->
    data = ''
    generate length: 1000, objectMode: true, seed: 1, columns: 2, (err, data) ->
      stringifier = stringify eof: false
      ws = fs.createWriteStream '/tmp/large.out'
      stringifier.pipe ws
      for row in data
        stringifier.write row
      stringifier.end()
      ws.on 'finish', ->
        fs.readFile '/tmp/large.out', 'ascii', (err, data) ->
          data.split('\n').length.should.eql 1000 unless err
          next err

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
