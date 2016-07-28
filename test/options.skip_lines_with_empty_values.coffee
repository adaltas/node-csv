
should = require 'should'
parse = require '../src'

describe 'skip_lines_with_empty_values', ->
  
  it 'dont skip by default', (next) ->
    parse """
    ABC,DEF
    ,
    IJK,LMN
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC', 'DEF' ]
        [ '', '' ]
        [ 'IJK', 'LMN' ]
      ]
      next()
  
  it 'skip', (next) ->
    parse """
    ABC,DEF
    ,
    """, skip_lines_with_empty_values: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC', 'DEF' ]
      ]
      next()

  it 'skip respect parser.read', (next) ->
    data = []
    parser = parse skip_lines_with_empty_values: true
    parser.write """
    ,,,,,
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    ,,,,,
    28392898392,1974,8.8392926E7,DEF,23,2050-11-27
    ,,,,,
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
