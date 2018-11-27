
generate = require '../src'

describe 'option high_water_mark', ->

  it 'generate slightly larger buffer lengths', (next) ->
    count = 0
    generator = generate fixed_size: true, highWaterMark: 64
    generator.on 'readable', ->
      while(data = generator.read())
        data.length.should.be.within 64, 128
        generator.end() if count++ is 100
    generator.on 'error', next
    generator.on 'end', next
