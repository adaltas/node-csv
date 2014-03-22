
should = require 'should'
generate = require 'csv-generate'
transform = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'parallel', ->


  it 'respect running', (next) ->
    @timeout 0
    data = []
    count = 0
    running = 0
    generator = generate length: 1000, objectMode: true, highWaterMark: 40, headers: 2, seed: 1
    transformer = generator.pipe transform (row, next) ->
      count++
      running++
      running.should.be.below 6
      setTimeout ->
        running--
        next null, "#{row[0]},#{row[1]}"
      , if count < 9 then 1 else Math.ceil Math.random() * 4
    , parallel: 5
    transformer.on 'readable', ->
      while(d = transformer.read())
        data.push d
    transformer.on 'error', next
    transformer.on 'finish', ->
      # count.should.eql 1000
      data = data.slice(0, 8)
      data = data.sort (d1,d2) -> d1.toLowerCase() > d2.toLowerCase()
      data.should.eql [
        'bgIjadnn,fENLEOMIkbhLDK'
        'D,GeACHiN'
        'fENL,Jn'
        'KB,dmiM'
        'NIl,JnnmjadnmiNL'
        'nnmiN,CGfDKB'
        'OMH,ONKCHhJmjadoA'
        'opEMIkdmiOMFckep,MIj'
      ]
      next()