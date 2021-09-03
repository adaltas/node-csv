
import stream from 'stream'
import util from 'util'
import generate from '../lib/index.js'

describe 'api pipe', ->

  it 'to a custom writer', (next) ->
    @timeout 1000000
    Writer = ->
      stream.Writable.call @
      @_data = ''
      @
    util.inherits Writer, stream.Writable
    Writer.prototype._write = (chunk, encoding, callback) ->
      @_data += chunk.toString()
      callback()
    writer = new Writer
    writer.on 'finish', ->
      writer
      ._data.split('\n')
      .length.should.eql 3
      next()
    generator = generate length: 3
    generator.pipe writer
