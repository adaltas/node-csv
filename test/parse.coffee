
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

  it 'handle empty lines', (next) ->
    data = []
    parser = parse()
    parser.write """
    
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01

    28392898392,1974,8.8392926E7,DEF,23,2050-11-27

    """
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'error', (err) ->
      next err
    parser.on 'finish', ->
      data.should.eql [
        ['20322051544', '1979', '8.8017226E7', 'ABC', '45', '2000-01-01']
        ['28392898392', '1974', '8.8392926E7', 'DEF', '23', '2050-11-27']
      ]
      next()
    parser.end()

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

