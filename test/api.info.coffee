
parse = require '../lib'

describe 'API info', ->

  it 'is exported in the callback on error', (next) ->
    parse '''
    1,2,3
    a,b,
    ''', (err, data, info) ->
      info.should.eql
        comment_lines: 0
        empty_lines: 0
        invalid_field_length: 0
        lines: 2
        records: 2
      next()

  it 'is exported in the callback on success', (next) ->
    parse '''
    1,2,3
    a,b,c
    ''', (err, data, info) ->
      info.should.eql
        comment_lines: 0
        empty_lines: 0
        invalid_field_length: 0
        lines: 2
        records: 2
      next err

  it 'with multiline records', (next) ->
    parse '''
    a,b,c
    d,"e
    ",f
    g,h,i
    ''', (err, data, info) ->
      info.should.eql
        comment_lines: 0
        empty_lines: 0
        invalid_field_length: 0
        lines: 4
        records: 3
      next err
