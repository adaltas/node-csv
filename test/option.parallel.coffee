
pad = require 'pad'
generate = require 'csv-generate'
transform = require '../src'

letters = (number) ->
  text = "#{number}"
  text = "#{pad 3, text, '0'}"
  text = for c in text
    65 - 49 + 1 + c.charCodeAt 0
  String.fromCharCode text...

describe 'option parallel', ->

  it 'respect running', (next) ->
    @timeout 0
    data = []
    count = 0
    running = 0
    headers = -1
    generator = generate length: 1000, objectMode: true, highWaterMark: 40, headers: 2, seed: 1, columns: [
      (g) ->
        letters pad 3, g._.count_created, '0'
      (g) -> pad 3, g._.count_created-1, '0'
    ]
    transformer = generator.pipe transform (record, next) ->
      count++
      record[1] = letters count-1
      running++
      running.should.be.below 6
      setTimeout ->
        running--
        next null, "#{record[0]},#{record[1]}"
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
