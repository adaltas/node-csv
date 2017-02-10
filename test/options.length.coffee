
should = require 'should'
generate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'callback', ->

  it 'raw text', (next) ->
    @timeout 1000000
    generate length: 20, (err, data) ->
      return next err if err
      data.split('\n').length.should.eql 20
      next()

  it 'object', (next) ->
    @timeout 1000000
    generate objectMode: true, length: 20, (err, data) ->
      return next err if err
      data.length.should.eql 20
      next()
