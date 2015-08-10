
fs = require 'fs'
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'Option "auto_parse"', ->
  
  it 'convert numbers', (next) ->
    data = []
    parser = parse({ auto_parse: true })
    parser.write """
    20322051544,1979,8.8017226E7,8e2,ABC,45,2000-01-01
    28392898392,1974,8.8392926e7,8E2,DEF,23,2050-11-27
    """
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'error', (err) ->
      next err
    parser.on 'finish', ->
      data.should.eql [
        [20322051544, 1979, 8.8017226e7, 800, 'ABC', 45, '2000-01-01']
        [28392898392, 1974, 8.8392926e7, 800, 'DEF', 23, '2050-11-27']
      ]
      next()
    parser.end()

  it 'ints', (next) ->
    parse '123a,123,0123,', auto_parse: true, (err, data) ->
      data.should.eql [ ['123a', 123, 123, ''] ]
      next()

  it 'float', (next) ->
    parse '123a,1.23,0.123,01.23,.123,123.', auto_parse: true, (err, data) ->
      data.should.eql [ ['123a', 1.23, 0.123, 1.23, 0.123, 123] ]
      next()

