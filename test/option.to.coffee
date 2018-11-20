
parse = require '../lib'

describe 'Option `to`', ->

  it 'start at defined position', (next) ->
    parse """
    1,2,3
    4,5,6
    7,8,9
    """, to: 2, (err, data) ->
      return next err if err
      data.should.eql [
        [ '1','2','3' ]
        [ '4','5','6' ]
      ]
      next()

  it 'dont count headers', (next) ->
    parse """
    a,b,c
    1,2,3
    4,5,6
    7,8,9
    """, columns: true, to: 2, (err, data) ->
      return next err if err
      data.should.eql [
        {a:'1',b:'2',c:'3'}
        {a:'4',b:'5',c:'6'}
      ]
      next()

  it 'end stream when "to" is reached, further lines are not parsed', (next) ->
    parse """
    1,2,3
    4,5,6
    7,8
    """, to: 2, (err, data) ->
      return next err if err
      data.should.eql [
        [ '1','2','3' ]
        [ '4','5','6' ]
      ]
      next()

  it 'not influenced by lines', (next) ->
    parse """
    1,2,"
    3"
    4,5,"
    6"
    7,8,"
    9"
    """, to: 2, (err, data) ->
      data.should.eql [
        [ '1','2','\n3' ]
        [ '4','5','\n6' ]
      ] unless err
      next err

  it 'not influenced by row delimiter', (next) ->
    parse """
    1,2,3:4,5,6:7,8,9
    """, to: 2, record_delimiter: ':', (err, data) ->
      data.should.eql [
        [ '1','2','3' ]
        [ '4','5','6' ]
      ] unless err
      next err
