
parse = require '../lib'
assert_error = require './api.assert_error'

describe 'Option `columns_duplicates_to_array`', ->

  it 'when false', (next) ->
    parse """
    FIELD_1,FIELD_1
    ABC,DEF
    GHI,JKL
    """, columns: true, columns_duplicates_to_array: false, (err, data) ->
      data.should.eql [
        'FIELD_1': 'DEF'
      ,
        'FIELD_1': 'JKL'
      ] unless err
      next err

  it 'when true', (next) ->
    parse """
    FIELD_1,FIELD_1
    ABC,DEF
    GHI,JKL
    """, columns: true, columns_duplicates_to_array: true, (err, data) ->
      data.should.eql [
        'FIELD_1': ['ABC', 'DEF']
      ,
        'FIELD_1': ['GHI', 'JKL']
      ] unless err
      next err
