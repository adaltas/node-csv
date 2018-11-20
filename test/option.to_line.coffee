
parse = require '../lib'

describe 'Option `to_line`', ->

  it 'start at defined position', (next) ->
    parse """
    1,2,3
    4,5,6
    7,8,9
    """, to_line: 2, (err, data) ->
      data.should.eql [
        [ '1','2','3' ]
        [ '4','5','6' ]
      ] unless err
      next err

  it 'count headers', (next) ->
    parse """
    a,b,c
    1,2,3
    4,5,6
    7,8,9
    """, columns: true, to_line: 3, (err, data) ->
      data.should.eql [
        {a: '1',b: '2',c: '3'}
        {a: '4',b: '5',c: '6'}
      ] unless err
      next err

  it 'records with quoted line at the end of line', (next) ->
    parse """
    1,2,"
    
    3"
    4,5,"
    6"
    7,8,"
    9"
    """, to_line: 5, (err, data) ->
      data.should.eql [
        [ '1','2','\n\n3' ]
        [ '4','5','\n6' ]
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
    """, to_line: 6, (err, data) ->
      data.should.eql [
        [ '1','2','\n\n3' ]
        [ '4','5','\n6' ]
      ] unless err
      next err

  it 'not influenced by row delimiter', (next) ->
    parse """
    a,b,c:1,2,
    3:d,e,f:4,5,
    6:g,h,i:7,8,
    9
    """, to_line: 2, record_delimiter: ':', (err, data) ->
      data.should.eql [
        [ 'a','b','c' ]
        [ '1','2','\n3' ]
        [ 'd','e','f' ]
      ] unless err
      next err
