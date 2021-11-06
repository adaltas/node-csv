
import { parse } from '../lib/index.js'
import { assert_error } from './api.assert_error.coffee'

describe 'Option `columns_duplicates_to_array`', ->
  
  it 'validate', ->
    (->
      parse "", columns_duplicates_to_array: 'invalid'
    ).should.throw
      code: 'CSV_INVALID_OPTION_COLUMNS_DUPLICATES_TO_ARRAY'
      message: [
        'Invalid option columns_duplicates_to_array:'
        'expect an boolean, got "invalid"'
      ].join ' '

  it 'require columns to be active', ->
    (->
      parse "", columns_duplicates_to_array: true
    ).should.throw
      code: 'CSV_INVALID_OPTION_COLUMNS_DUPLICATES_TO_ARRAY'
      message: [
        'Invalid option columns_duplicates_to_array:'
        'the `columns` mode must be activated.'
      ].join ' '
    
  it 'when false', (next) ->
    parse """
    FIELD_1,FIELD_1
    ABC,DEF
    GHI,JKL
    """, columns: true, columns_duplicates_to_array: false, (err, records) ->
      records.should.eql [
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
    """, columns: true, columns_duplicates_to_array: true, (err, records) ->
      records.should.eql [
        'FIELD_1': ['ABC', 'DEF']
      ,
        'FIELD_1': ['GHI', 'JKL']
      ] unless err
      next err
