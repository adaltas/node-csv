
parse = require '../lib'

describe 'options relax_column_count', ->

  it 'throw error by default', (next) ->
    parse """
    1,2,3
    4,5
    """, (err, data) ->
      err.message.should.eql 'Invalid Record Length: expect 3, got 2 on line 2'
      next()

  it 'emit single error when column count is invalid on multiple lines', (next) ->
    parse """
    1,2
    1
    3,4
    5,6,7
    """
    , (err, data) ->
      err.message.should.eql 'Invalid Record Length: expect 2, got 1 on line 2'
      process.nextTick next

  it 'dont throw error if true', (next) ->
    parse """
    1,2,3
    4,5
    """, relax_column_count: true, (err, data) ->
      data.should.eql [
        [ '1', '2', '3' ]
        [ '4', '5' ]
      ] unless err
      next err

  it 'with column', (next) ->
    parse """
    1,2,3
    4,5
    """, columns: ['a','b','c','d'], relax_column_count: true, (err, data) ->
      data.should.eql [
        { "a":"1", "b":"2", "c":"3" }
        { "a":"4", "b":"5" }
      ] unless err
      next err

  it 'with columns and from, doesnt break count and relying options like from', (next) ->
    parse """
    1,2,3
    4,5
    6,7,8
    9,10
    """, relax_column_count: true, columns: ['a','b','c','d'], from: 3, (err, data) ->
      data.should.eql [
        { "a":"6", "b":"7", "c":"8" }
        { "a":"9", "b":"10" }
      ] unless err
      next err
