
should = require 'should'
produce = require 'produce'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'stringify', ->

  it 'write', (next) ->
    data = ''
    producer = produce length: 2, objectMode: true, seed: 1, headers: 2
    stringifier = stringify()
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    producer.on 'error', (err) ->
      next err
    producer.on 'end', (err) ->
      stringifier.end()
    producer.on 'readable', ->
      while(row = producer.read())
        stringifier.write row
    stringifier.on 'finish', ->
      data.should.eql """
      OMH,ONKCHhJmjadoA
      D,GeACHiN
      """
      next()

  it 'pipe', (next) ->
    data = ''
    producer = produce length: 2, objectMode: true, seed: 1, headers: 2
    stringifier = producer.pipe stringify()
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
   
    stringifier.on 'finish', ->
      data.should.eql """
      OMH,ONKCHhJmjadoA
      D,GeACHiN
      """
      next()
