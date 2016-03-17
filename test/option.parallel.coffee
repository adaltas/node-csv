
pad = require 'pad'
should = require 'should'
generate = require 'csv-generate'
transform = if process.env.CSV_COV then require '../lib-cov' else require '../src'

letters = (number) ->
  text = "#{number}"
  text = "#{pad 3, text, '0'}"
  text = for c in text
    65 - 49 + 1 + c.charCodeAt 0
  String.fromCharCode text...

describe 'parallel', ->

  it 'respect running', (next) ->
    @timeout 0
    data = []
    count = 0
    running = 0
    headers = -1
    generator = generate length: 1000, objectMode: true, highWaterMark: 40, headers: 2, seed: 1, columns: [
      (g) -> letters pad 3, g.count_created, '0'
      (g) -> pad 3, g.count_created-1, '0'
    ]
    transformer = generator.pipe transform (row, next) ->
      count++
      row[1] = letters count-1
      running++
      running.should.be.below 6
      setTimeout ->
        running--
        next null, "#{row[0]},#{row[1]}"
      , 1 + Math.ceil count % 5
    , parallel: 5
    transformer.on 'readable', ->
      while(d = transformer.read())
        data.push d
    transformer.on 'error', next
    transformer.on 'finish', ->
      data = data.sort()
      data = data.slice 0, 8
      data.should.eql [
        'AAA,AAA'
        'AAB,AAB'
        'AAC,AAC'
        'AAD,AAD'
        'AAE,AAE'
        'AAF,AAF'
        'AAG,AAG'
        'AAH,AAH'
      ]
      next()



