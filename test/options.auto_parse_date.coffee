
fs = require 'fs'
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'Option "auto_parse_date"', ->
  
  it 'convert numbers', (next) ->
    data = []
    parser = parse({ auto_parse: true, auto_parse_date: true })
    parser.write """
    2000-01-01,date1
    2050-11-27,date2
    """
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'error', (err) ->
      next err
    parser.on 'finish', ->
      data[0][0].should.be.instanceOf Date
      data[1][0].should.be.instanceOf Date
      next()
    parser.end()
