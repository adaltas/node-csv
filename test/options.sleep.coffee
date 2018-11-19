
generate = require '../src'

describe 'option sleep', ->

  it 'as integer above 0', (next) ->
    @timeout 10000
    generate duration: 1000, sleep: 100, objectMode: true, (err, data) ->
      data.length.should.be.within(8, 12) unless err
      next err
