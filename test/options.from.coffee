
fs = require 'fs'
parse = require '../src'

describe 'options from', ->

  it 'start at defined position', (next) ->
    parse """
    1,2,3
    4,5,6
    7,8,9
    """, from: 3, (err, data) ->
      data.should.eql [
        [ '7','8','9' ]
      ] unless err
      next err

  it 'dont count headers', (next) ->
    parse """
    a,b,c
    1,2,3
    4,5,6
    7,8,9
    """, columns: true, from: 3, (err, data) ->
      data.should.eql [
        {a:'7',b:'8',c:'9'}
      ] unless err
      next err
