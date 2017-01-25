
should = require 'should'
fs = require 'fs'
parse = require '../src'

describe 'to', ->

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
