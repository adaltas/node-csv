
generate = require '../src'

describe 'option length', ->

  it 'raw text', (next) ->
    @timeout 1000000
    generate length: 20, encoding: 'ascii', (err, data) ->
      return next err if err
      data.split('\n').length.should.eql 20
      next()

  it 'object', (next) ->
    @timeout 1000000
    generate objectMode: true, length: 20, (err, data) ->
      return next err if err
      data.length.should.eql 20
      next()
