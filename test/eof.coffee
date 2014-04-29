
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'eof', ->
  
  it 'print line break when true', (next) ->
    stringify [
      ['a','b','c']
      ['1','2','3']
    ], eof: true, (err, data) ->
      return next err if err
      data.should.eql "a,b,c\n1,2,3\n"
      next()
  
  it 'dont print line break when false', (next) ->
    stringify [
      ['a','b','c']
      ['1','2','3']
    ], eof: false, (err, data) ->
      return next err if err
      data.should.eql "a,b,c\n1,2,3"
      next()
