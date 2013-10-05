
should = require 'should'
mutate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'mutate', ->

  describe 'pass rows after inversing columns', ->

    it 'in sync mode', (next) ->
      data = []
      generator = csv.generator length: 1000, objectMode: true, seed: 1, headers: 2
      mutator = generator.pipe mutate {}
      mutator.transform (row) ->
        row.push row.shift()
        row
      mutator.on 'readable', ->
        while(d = mutator.read())
          data.push d
      mutator.on 'finish', ->
        data.slice(0,2).should.eql [
          [ 'ONKCHhJmjadoA', 'OMH' ]
          [ 'GeACHiN', 'D' ]
        ]
        next()

    it 'in async mode', (next) ->
      data = []
      generator = csv.generator length: 1000, objectMode: true, seed: 1, headers: 2
      mutator = generator.pipe mutate {}
      mutator.transform (row, callback) ->
        row.push row.shift()
        callback null, row
      mutator.on 'readable', ->
        while(d = mutator.read())
          data.push d
      mutator.on 'finish', ->
        data.slice(0,2).should.eql [
          [ 'ONKCHhJmjadoA', 'OMH' ]
          [ 'GeACHiN', 'D' ]
        ]
        next()

  it 'in parallel respect running', (next) ->
    @timeout 0
    data = []
    count = 0
    running = 0
    generator = csv.generator length: 1000, objectMode: true, highWaterMark: 40, headers: 2, seed: 1
    mutator = generator.pipe mutate(parallel: 5)
    mutator.transform (row, next) ->
      count++
      running++
      running.should.be.below 6
      setTimeout ->
        running--
        next null, "#{row[0]},#{row[1]}"
      , if count < 9 then 1 else Math.ceil Math.random() * 4
    mutator.on 'readable', ->
      while(d = mutator.read())
        data.push d
    mutator.on 'error', (err) ->
      next err
    mutator.on 'finish', ->
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



