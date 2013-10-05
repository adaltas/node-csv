
fs = require 'fs'
should = require 'should'
produce = require 'produce'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'parser', ->

  it 'parser', (next) ->
    parser = parse()
    data = []
    producer = produce length: 2, seed: 1, headers: 2, fixed_size: true
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'OMH', 'ONKCHhJmjadoA' ]
        [ 'D', 'GeACHiN' ]
      ]
      next()
    producer.pipe(parser)






