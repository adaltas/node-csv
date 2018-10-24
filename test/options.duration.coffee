
generate = require '../src'

describe 'option duration', ->

  it 'as millisecond', (next) ->
    @timeout 1000000
    generate duration: 1000, encoding: 'ascii', (err, data) ->
      return next err if err
      data.split('\n').length.should.be.above 10000
      next()
