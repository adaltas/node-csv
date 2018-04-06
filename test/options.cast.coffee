
fs = require 'fs'
parse = require '../src'

describe 'options "cast"', ->
  
  it 'all columns', (next) ->
    parse '1,2,3', cast: true, (err, data) ->
      data.should.eql [ [1, 2, 3] ]
      next()
  
  it 'convert numbers', (next) ->
    data = []
    parser = parse({ cast: true })
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
    parse '123a,123,0123,', cast: true, (err, data) ->
      data.should.eql [ ['123a', 123, 123, ''] ]
      next()

  it 'float', (next) ->
    parse '123a,1.23,0.123,01.23,.123,123.', cast: true, (err, data) ->
      data.should.eql [ ['123a', 1.23, 0.123, 1.23, 0.123, 123] ]
      next()

  it 'custom function', (next) ->
    parse """
    2000-01-01,date1
    2050-11-27,date2
    """,
      cast: (value, context) ->
        if context.index is 0
        then new Date "#{value} 05:00:00"
        else {...context}
    , (err, records) ->
      records.should.eql [
        [ new Date('2000-01-01T04:00:00.000Z'), {quoting: false, count: 0, index: 1, column: 1} ]
        [ new Date('2050-11-27T04:00:00.000Z'), {quoting: false, count: 1, index: 1, column: 1} ]
      ] unless err
      next err

  it 'custom function with quoting context', (next) ->
    parse """
    "2000-01-01",date1
    2025-12-31,"date2"
    2050-11-27,"date3"
    """,
      cast: (value, {quoting}) ->
        quoting
    , (err, records) ->
      records.should.eql [
        [ true, false ]
        [ false, true ]
        [ false, true ]
      ] unless err
      next err
