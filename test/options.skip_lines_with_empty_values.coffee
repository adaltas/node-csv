
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
    IJK,LMN
    ,
    """, skip_lines_with_empty_values: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC', 'DEF' ]
        [ 'IJK', 'LMN' ]
      ]
      next()
  
  it 'skip space and tabs', (next) ->
    parse """
    ABC,DEF
    \t , \t
    IJK,LMN
    \t , \t
    """, skip_lines_with_empty_values: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC', 'DEF' ]
        [ 'IJK', 'LMN' ]
      ]
      next()
