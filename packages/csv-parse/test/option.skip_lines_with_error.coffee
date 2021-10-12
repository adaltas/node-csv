
import { parse } from '../lib/index.js'
import { assert_error } from './api.assert_error.coffee'

describe 'Option `skip_lines_with_error`', ->
  
  it 'validation', ->
    parse '', skip_lines_with_error: true, (->)
    parse '', skip_lines_with_error: false, (->)
    parse '', skip_lines_with_error: null, (->)
    parse '', skip_lines_with_error: undefined, (->)
    (->
      parse '', skip_lines_with_error: 1, (->)
    ).should.throw 'Invalid Option: skip_lines_with_error must be a boolean, got 1'
    (->
      parse '', skip_lines_with_error: 'oh no', (->)
    ).should.throw 'Invalid Option: skip_lines_with_error must be a boolean, got "oh no"'
  
  it 'handle "Invalid closing quote"', (next) ->
    errors = 0
    parser = parse skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ["a","b","c"]
        ["one","two","three"]
        ["seven","eight","nine"]
      ] unless err
      errors.should.eql 1
      next err
    parser.on 'skip', (err) ->
      assert_error err,
        message: 'Invalid Closing Quote: got " " at line 3 instead of delimiter, record delimiter, trimable character (if activated) or comment'
        code: 'CSV_INVALID_CLOSING_QUOTE'
      errors++
    parser.write '''
    "a","b","c"
    "one","two","three"
    "four"," " ","six"
    "seven","eight","nine"
    '''
    parser.end()

  it 'handle "Invalid opening quote"', (next) ->
    errors = []
    parser = parse skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ["line","1"]
        ["line", "3"]
      ] unless err
      assert_error errors, [
        message: 'Invalid Opening Quote: a quote is found inside a field at line 2'
        code: 'INVALID_OPENING_QUOTE'
        field: 'invalid h'
      ,
        message: 'Invalid Opening Quote: a quote is found inside a field at line 2'
        code: 'INVALID_OPENING_QUOTE'
        field: 'invalid h"ere'
      ]
      errors.length.should.eql 2
      next err
    parser.on 'skip', (err, context) ->
      errors.push err
    parser.write '''
    "line",1
    "line",invalid h"ere"
    line,3
    '''
    parser.end()
  
  it 'handle "Quoted field not terminated"', (next) ->
    errors = 0
    parser = parse skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c', 'd']
      ] unless err
      errors.should.eql 1
      next err
    parser.on 'skip', (err) ->
      assert_error err,
        message: 'Quote Not Closed: the parsing is finished with an opening quote at line 2'
        code: 'CSV_QUOTE_NOT_CLOSED'
      errors++
    parser.write '''
      "a",b,"c",d
      "",1974,8.8392926E7,"","
      '''
    parser.end()

  it 'handle "CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH"', (next) ->
    errors = 0
    parser = parse skip_lines_with_error: true, columns: ["a", "b", "c", "d"], (err, data) ->
      data.should.eql [
        { a: '4', b: '5', c: '6', d: 'x'}
        { a: '7', b: '8', c: '9', d: 'y'}
      ] unless err
      errors.should.eql 1
      next err
    parser.on 'skip', (err) ->
      assert_error err,
        message: 'Invalid Record Length: columns length is 4, got 3 on line 1'
        code: 'CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH'
        record: ['1', '2', '3']
      errors++
    parser.write '''
    1,2,3
    4,5,6,x
    7,8,9,y
    '''
    parser.end()
    

  it 'handle "CSV_INCONSISTENT_RECORD_LENGTH"', (next) ->
    errors = 0
    parser = parse skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c', 'd']
        ['e', 'f', 'g', 'h']
      ] unless err
      errors.should.eql 1
      next err
    parser.on 'skip', (err) ->
      assert_error err,
        message: 'Invalid Record Length: expect 4, got 3 on line 2'
        code: 'CSV_INCONSISTENT_RECORD_LENGTH'
        record: ['1', '2', '3']
      errors++
    parser.write '''
    a,b,c,d
    1,2,3
    e,f,g,h
    '''
    parser.end()
