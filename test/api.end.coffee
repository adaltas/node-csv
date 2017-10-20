
generate = require '../src'

describe 'api end', ->

  it 'with fixed_size', (next) ->
    count = 0
    ended = false
    generator = generate()
    generator.on 'readable', ->
      while(data = generator.read())
        ended.should.be.false()
        if count++ is 100
          ended = true
          generator.end()
    generator.on 'error', next
    generator.on 'end', next
