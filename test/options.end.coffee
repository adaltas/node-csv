
generate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'option end', ->

  it 'as millisecond', (next) ->
    @timeout 1000000
    generate end: Date.now() + 1000, (err, data) ->
      return next err if err
      data.split('\n').length.should.be.above 10000
      next()

  it 'as millisecond dont generate record if inferior to now', (next) ->
    @timeout 1000000
    generate end: Date.now()-1, (err, data) ->
      return next err if err
      data.should.eql ""
      next()

  it 'as date', (next) ->
    @timeout 1000000
    generate end: new Date(Date.now() + 1000), (err, data) ->
      return next err if err
      data.split('\n').length.should.be.above 10000
      next()
