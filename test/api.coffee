
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'api', ->

  it 'exports Parser class', ->
    parse.Parser.should.be.a.Function

