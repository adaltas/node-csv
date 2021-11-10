
import { generate } from '../lib/index.js'
import { Writable } from 'stream';

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

  it 'sync read text', (next) ->
    # This bug is only reproduced in objectMode, message is
    # `Uncaught Error [ERR_STREAM_PUSH_AFTER_EOF]: stream.push() after EOF`
    # when the internal data stack contains more than one element
    # and the internal `end` property was set before the latest record were send
    myReadable = new Writable
      objectMode: true
      write: (chunk, encoding, callback) ->
        callback()
    generator = generate length: 2, objectMode: true, highWaterMark: 10, columns: [
      (g) -> 'value'
    ]
    # generator = generate length: 2, objectMode: true, highWaterMark: 10
      # body...
    generator.pipe(myReadable).on 'finish', ->
      setTimeout next, 1000
