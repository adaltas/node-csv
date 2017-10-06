
should = require 'should'
parse = require '../src'

describe 'relax_column_count', ->

  it 'read from first row if true', (next) ->
    parse """
    1,2,3
    4,5
    """, columns: ['a','b','c','d'], relax_column_count: true, (err, data) ->
      data.should.eql [
        { "a":"1", "b":"2", "c":"3" }
        { "a":"4", "b":"5" }
      ] unless err
      next err

  it 'doesnt break count and relying options like from', (next) ->
    parse """
    1,2,3
    4,5
    6,7,8
    9,10
    """, columns: ['a','b','c','d'], relax_column_count: true, from: 3, (err, data) ->
      data.should.eql [
        { "a":"6", "b":"7", "c":"8" }
        { "a":"9", "b":"10" }
      ] unless err
      next err
