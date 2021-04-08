
parse = require '../lib'
assert_error = require './api.assert_error'

describe 'Option `on_record`', ->
  
  it 'validate', ->
    (->
      parse on_record: true
    ).should.throw
      message: 'Invalid option `on_record`: expect a function, got true'
      code: 'CSV_INVALID_OPTION_ON_RECORD'
        
  it 'alter records', (next) ->
    parse "a,b", on_record: (record) ->
      [record[1], record[0]]
    , (err, records) ->
      records.should.eql [ ['b', 'a'] ] unless err
      next err
        
  it 'filter records', (next) ->
    parse "a,b\nc,d\ne,f", on_record: (record, {lines}) ->
      if lines is 2 then null else record
    , (err, records) ->
      records.should.eql [ ['a', 'b'], ['e', 'f'] ] unless err
      next err
        
  it 'errors with callback', (next) ->
    parse "a,b\nc,d\ne,f",
      on_record: (record, {lines}) ->
        if lines is 2 then throw Error 'Error thrown on line 2' else record
    , (err, records) ->
      err.message.should.eql 'Error thrown on line 2'
      next()
  
  it 'errors with events', (next) ->
    parser = parse "a,a,a\nc,d\ne,f"
    parser.on 'error', (err) ->
      err.message.should.eql 'Invalid Record Length: expect 3, got 2 on line 2'
      next()
    parser.on 'end', () ->
      next Error 'Should not be called'
        
  it 'errors not handled by skip_lines_with_error', (next) ->
    parse "a,b\nc,d\ne,f",
      on_record: (record, {lines}) ->
        if lines is 2 then throw Error 'Error thrown on line 2' else record
      skip_lines_with_error: true
    , (err, records) ->
      err.message.should.eql 'Error thrown on line 2'
      next()
