
import { generate } from '../lib/index.js'

describe 'api end', ->

  it 'no chunk generated after end', (next) ->
    count = 0
    generator = generate()
    generator.on 'readable', ->
      while(generator.read())
        if end
          generator.emit 'error', Error 'Record emited after end'
        if count++ is 5
          end = true
          generator.end()
    generator.on 'error', next
    generator.on 'end', next

  it 'no record generated after end', (next) ->
    count = 0
    generator = generate objectMode: true
    generator.on 'readable', ->
      while(generator.read())
        if end
          generator.emit 'error', Error 'Record emited after end'
        if count++ is 5
          end = true
          generator.end()
    generator.on 'error', next
    generator.on 'end', next
