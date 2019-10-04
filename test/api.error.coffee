
parse = require '..'
assert_error = require './api.assert_error'

describe 'API error', ->
  
  it 'set code', ->
    err = new parse.CsvError 'MY_CODE', ['a', 'b', 'c']
    err.code.should.eql 'MY_CODE'
      
  it 'convert array message to string', ->
    err = new parse.CsvError 'MY_CODE', ['a', 'b', 'c']
    err.message.should.eql 'a b c'
      
  it 'set additional context information', ->
    err = new parse.CsvError 'MY_CODE', 'msg', a: 1, b: 2
    err.a.should.eql 1
    err.b.should.eql 2
      
  it 'errors are enriched by context', ->
    parse 'a"b', (err) ->
      assert_error err,
        message: /Invalid Opening Quote/
        code: 'INVALID_OPENING_QUOTE'
        column: 0
        empty_lines: 0
        header: false
        index: 0
        invalid_field_length: 0
        quoting: false
        lines: 1
        records: 0
        field: 'a'
