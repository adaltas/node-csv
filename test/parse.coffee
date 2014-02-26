
fs = require 'fs'
should = require 'should'
produce = require 'produce'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'parser', ->

  it 'pipe', (next) ->
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

  describe 'relax', ->

    it 'work around invalid quotes', (next) ->
      data = []
      parser = parse(quote: '"', escape: '"', relax: true)
      parser.write """
      384682,"SAMAY" Hostel,Jiron "Florida 285"
      """
      parser.on 'readable', ->
        while(d = parser.read())
          data.push d
      parser.on 'error', (err) ->
        next err
      parser.on 'finish', ->
        data.should.eql [
          [ '384682', 'SAMAY Hostel', 'Jiron "Florida 285"' ]
        ]
        next()
      parser.end()

