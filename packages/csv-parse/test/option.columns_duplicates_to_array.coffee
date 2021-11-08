
import { parse } from '../lib/index.js'
import { assert_error } from './api.assert_error.coffee'

describe 'Option `group_columns_by_name`', ->
  
  it 'validate', ->
    (->
      parse "", group_columns_by_name: 'invalid'
    ).should.throw
      code: 'CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME'
      message: [
        'Invalid option group_columns_by_name:'
        'expect an boolean, got "invalid"'
      ].join ' '

  it 'require columns to be active', ->
    (->
      parse "", group_columns_by_name: true
    ).should.throw
      code: 'CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME'
      message: [
        'Invalid option group_columns_by_name:'
        'the `columns` mode must be activated.'
      ].join ' '
    
  it 'when false', (next) ->
    parse """
    FIELD_1,FIELD_1
    ABC,DEF
    GHI,JKL
    """, columns: true, group_columns_by_name: false, (err, records) ->
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
    """, columns: true, group_columns_by_name: true, (err, records) ->
      records.should.eql [
        'FIELD_1': ['ABC', 'DEF']
      ,
        'FIELD_1': ['GHI', 'JKL']
      ] unless err
      next err
