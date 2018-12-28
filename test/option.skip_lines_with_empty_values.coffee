
parse = require '../lib'

describe 'Option `skip_lines_with_empty_values`', ->
  
  it 'validation', ->
    parse '', skip_lines_with_empty_values: true, (->)
    parse '', skip_lines_with_empty_values: false, (->)
    parse '', skip_lines_with_empty_values: null, (->)
    parse '', skip_lines_with_empty_values: undefined, (->)
    (->
      parse '', skip_lines_with_empty_values: 1, (->)
    ).should.throw 'Invalid Option: skip_lines_with_empty_values must be a boolean, got 1'
    (->
      parse '', skip_lines_with_empty_values: 'oh no', (->)
    ).should.throw 'Invalid Option: skip_lines_with_empty_values must be a boolean, got "oh no"'
  
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
