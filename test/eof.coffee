
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'eof', ->
  
  it 'should work with `to.string`', (next) ->
    stringify "a,b,c\n1,2,3", eof: true, (err, data) ->
      return next err if err
      data.should.eql "a,b,c\n1,2,3\n"
      next()
