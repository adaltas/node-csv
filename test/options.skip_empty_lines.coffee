
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'skip_empty_lines', ->
  
  it 'dont skip by default', (next) ->
    parse """
    ABC\n\nDEF
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC' ]
        [ '' ]
        [ 'DEF' ]
      ]
      next()
  
  it 'skip', (next) ->
    parse """
    ABC\n\nDEF
    """, skip_empty_lines: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC' ]
        [ 'DEF' ]
      ]
      next()

  it 'skip respect parser.read', (next) ->
    data = []
    parser = parse skip_empty_lines: true
    parser.write """
    
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01

    28392898392,1974,8.8392926E7,DEF,23,2050-11-27

    """
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'error', (err) ->
      next err
    parser.on 'finish', ->
      data.should.eql [
        ['20322051544', '1979', '8.8017226E7', 'ABC', '45', '2000-01-01']
        ['28392898392', '1974', '8.8392926E7', 'DEF', '23', '2050-11-27']
      ]
      next()
    parser.end()