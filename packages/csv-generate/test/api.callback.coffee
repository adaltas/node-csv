
generate = require '../lib'

describe 'api callback', ->

  it 'receive a buffer', (next) ->
    count = 0
    ended = false
    generator = generate length: 3, (err, data) ->
      Buffer.isBuffer(data).should.be.true() unless err
      next()

  it 'receive a string if encoding is defined', (next) ->
    count = 0
    ended = false
    generator = generate length: 3, encoding: 'utf8', (err, data) ->
      (typeof data is 'string').should.be.true() unless err
      next()
