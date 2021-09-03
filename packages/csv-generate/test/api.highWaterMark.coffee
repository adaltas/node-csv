
import generate from '../lib/index.js'

describe 'api highWaterMark', ->

  it 'honors option', (next) ->
    values = []
    generator = generate length: 100, highWaterMark: 100
    generator.on 'readable', ->
      while row = generator.read()
        values.push row.length
    generator.on 'error', next
    generator.on 'end', ->
      # we dont test first and last values:
      # First time, length is twice the highWaterMark
      # Last time, length is only what's left
      values.shift()
      values.pop()
      for value in values then value.should.be.within 100, 250
      next()
