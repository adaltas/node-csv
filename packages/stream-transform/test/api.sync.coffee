
transform = require '../lib/sync'

describe 'api.sync', ->

  it 'accept data and handler without options', ->
    data = transform [
      ['a', 'b', 'c']
      ['1', '2', '3']
    ], (record) ->
      record.join '|'
    data.should.eql [
      'a|b|c'
      '1|2|3'
    ]

  it 'honors params option', ->
    data = transform [
      ['a', 'b', 'c']
      ['1', '2', '3']
    ], params: separator: '|', (record, params) ->
      record.join params.separator
    data.should.eql [
      'a|b|c'
      '1|2|3'
    ]

  it 'only sync handlers are supported', ->
    # Without options
    (->
      transform [
        ['a', 'b', 'c']
        ['1', '2', '3']
      ], ((record, callback) ->)
    ).should.throw 'Invalid Handler: only synchonous handlers are supported'
    # With options
    (->
      transform [
        ['a', 'b', 'c']
        ['1', '2', '3']
      ], params: a_key: 'a value', ((record, callback, params) ->)
    ).should.throw 'Invalid Handler: only synchonous handlers are supported'
