
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'api', ->

  it 'exports Parser class', ->
    parse.Parser.should.be.a.Function

  it 'call with options', (next) ->
    data = []
    parser = parse columns: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'err', (err) ->
      next err
    parser.on 'finish', ->
      data.should.eql [field_1: 'value 1', field_2: 'value 2']
      next()
    parser.write 'field_1,field_2\nvalue 1,value 2'
    parser.end()

  it 'call with options and callback', (next) ->
    parser = parse columns: true, (err, data) ->
      data.should.eql [field_1: 'value 1', field_2: 'value 2']
      next()
    parser.write 'field_1,field_2\nvalue 1,value 2'
    parser.end()

