
import generate from '../lib/index.js'

describe 'option duration', ->

  it 'as millisecond', (next) ->
    @timeout 1000000
    start = Date.now()
    generate duration: 1000, encoding: 'ascii', (err, data) ->
      end = Date.now()
      (end - start).should.be.within(1000, 1100) unless err
      data.split('\n').length.should.be.above 10000 unless err
      next err
