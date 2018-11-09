
parse = require '../lib'

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
    parser.on 'end', ->
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
        then "#{value}T05:00:00.000Z"
        else {...context}
    , (err, records) ->
      records.should.eql [
        [ '2000-01-01T05:00:00.000Z', {quoting: false, index: 1, column: 1, empty_line_count: 0, lines: 1, header: false, records: 0, skipped_line_count: 0} ]
        [ '2050-11-27T05:00:00.000Z', {quoting: false, index: 1, column: 1, empty_line_count: 0, lines: 2, header: false, records: 1, skipped_line_count: 0} ]
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

  it 'header is true on first line when columns is true', (next) ->
    parse """
    a,b,c
    1,2,3
    4,5,6
    """,
      columns: true
      cast: (value, context) ->
        if context.header then value else parseInt value
    , (err, records) ->
      records.should.eql [
        {a: 1, b: 2, c: 3}
        {a: 4, b: 5, c: 6}
      ] unless err
      next err

  it 'header is false when columns is an object', (next) ->
    parse """
    1,2,3
    4,5,6
    """,
      columns: ['a', 'b', 'c']
      cast: (value, context) ->
        context.header.should.be.false()
        parseInt value
    , (err, records) ->
      records.should.eql [
        {a: 1, b: 2, c: 3}
        {a: 4, b: 5, c: 6}
      ] unless err
      next err
