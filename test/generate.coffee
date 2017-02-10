
stream = require 'stream'
util = require 'util'
should = require 'should'
generate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'generate', ->

  it 'with default', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    generator = generate encoding: 'utf8', highWaterMark: 1024
    generator.on 'readable', ->
      while d = generator.read()
        ended.should.not.be.ok
        if count++ is 100
          ended = true
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      next()

  it 'with length using pipe', (next) ->
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
