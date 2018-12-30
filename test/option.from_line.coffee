
parse = require '../lib'

describe 'Option `from_line`', ->
  
  it 'validation', ->
    parse '', from_line: 10, (->)
    parse '', from_line: "10", (->)
    parse '', from_line: null, (->)
    parse '', from_line: undefined, (->)
    (->
      parse '', from_line: -1, (->)
    ).should.throw 'Invalid Option: from_line must be a positive integer greater than 0, got -1'
    (->
      parse '', from_line: 0, (->)
    ).should.throw 'Invalid Option: from_line must be a positive integer greater than 0, got 0'
    (->
      parse '', from_line: true, (->)
    ).should.throw 'Invalid Option: from_line must be a positive integer greater than 0, got true'
    (->
      parse '', from_line: false, (->)
    ).should.throw 'Invalid Option: from_line must be a positive integer greater than 0, got false'
    (->
      parse '', from_line: 'oh no', (->)
    ).should.throw 'Invalid Option: from_line must be a positive integer greater than 0, got "oh no"'

  it 'start at defined position', (next) ->
    parse """
    1,2,3
    4,5,6
    7,8,9
    """, from_line: 3, (err, data) ->
      data.should.eql [
        [ '7','8','9' ]
      ] unless err
      next err

  it 'count headers', (next) ->
    parse """
    a,b,c
    1,2,3
    4,5,6
    7,8,9
    """, columns: true, from_line: 3, (err, data) ->
      data.should.eql [
        {a: '4',b: '5',c: '6'}
        {a: '7',b: '8',c: '9'}
      ] unless err
      next err

  it 'records with quoted line at the begining of line', (next) ->
    parse """
    1,2,"
    
    3"
    4,5,"
    6"
    7,8,"
    9"
    """, from_line: 4, (err, data) ->
      data.should.eql [
        [ '4','5','\n6' ]
        [ '7','8','\n9' ]
      ] unless err
      next err

  it 'records with quoted line in the middle of line', (next) ->
    parse """
    1,2,"
    
    3"
    4,5,"
    6"
    7,8,"
    9"
    """, from_line: 2, (err, data) ->
      data.should.eql [
        [ '4','5','\n6' ]
        [ '7','8','\n9' ]
      ] unless err
      next err

  it 'not influenced by record delimiters', (next) ->
    parse """
    a,b,c:1,2,
    3:d,e,f:4,5,
    6:g,h,i:7,8,
    9
    """, from_line: 3, record_delimiter: ':', (err, data) ->
      data.should.eql [
        [ 'g','h','i' ]
        [ '7','8','\n9' ]
      ] unless err
      next err

  it 'handle multiple bytes record delimiters', (next) ->
    parse """
    a,b\r\nc,d\r\ne,f
    """, from_line: 2, (err, data) ->
      data.should.eql [
        [ 'c','d' ]
        [ 'e','f' ]
      ] unless err
      next err
