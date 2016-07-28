
should = require 'should'
parse = require '../src'

describe 'relax_column_count', ->

  it 'read from first row if true', (next) ->
    parse """
    1,2,3
    4,5
    """, columns: ['a','b','c','d'], relax_column_count: true, (err, data) ->
      data.should.eql [
        "a":"1", "b":"2", "c":"3"
      ,
        "a":"4", "b":"5"
      ] unless err
      next err
