
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'eof', ->
  
  it 'should work with `to.string`', (next) ->
    string = "a,b,c\n1,2,3"
    csv()
    .from.string(string)
    .to.string (data) ->
      data.should.eql "a,b,c\n1,2,3\n"
      next()
    , eof: true