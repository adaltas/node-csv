
import { generate } from '../lib/index.js'

describe 'Option `fixed_size`', ->

  it 'with fixed_size', (next) ->
    count = 0
    generator = generate fixed_size: true, highWaterMark: 1024
    generator.on 'readable', ->
      while(data = generator.read())
        # First generated data is twice the high water mark, don't know why
        data.length.should.eql 1024
        generator.end() if count++ is 100
    generator.on 'error', next
    generator.on 'end', next
