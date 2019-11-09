
parse = require '../lib'
assert_error = require './api.assert_error'

describe 'Option `on_record`', ->
  
  it 'validate', ->
    (->
      parse on_record: true
    ).should.throw
      message: 'Invalid option `on_record`: expect a function, got true'
      code: 'CSV_INVALID_OPTION_ON_RECORD'
        
  it 'alter records', ->
    parse "a,b", on_record: (record) ->
      [record[1], record[0]]
    , (err, records) ->
      records.should.eql [ ['b', 'a'] ]
        
  it 'filter records', ->
    parse "a,b\nc,d\ne,f", on_record: (record, {lines}) ->
      if lines is 2 then null else record
    , (err, records) ->
      records.should.eql [ ['a', 'b'], ['e', 'f'] ]
