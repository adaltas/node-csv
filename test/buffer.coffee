
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'buffer', ->

  it 'should consider data the first argument when reading from a csv file and no options are passed in', (next) ->
    parse new Buffer('hello,world'), (err, data) ->
      return next err if err

      data.should.match [ [ 'hello', 'world' ] ]
      next()