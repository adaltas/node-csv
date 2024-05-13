
import { parse } from '../lib/index.js'
import { assert_error } from './api.assert_error.coffee'

describe 'Option `on_skip`', ->
  
  it 'validation', ->
    parse '', on_skip: (->), (->)
    (->
      parse '', on_skip: 1, (->)
    ).should.throw 'Invalid Option: on_skip must be a function, got 1'
  
  it 'handle "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH" with bom (fix #411)', (next) ->
    errors = 0
    parser = parse
      bom: true
      skip_records_with_error: true
      on_skip: (err) ->
        assert_error err,
          message: 'Invalid Record Length: expect 4, got 3 on line 2'
          code: 'CSV_RECORD_INCONSISTENT_FIELDS_LENGTH'
          record: ['1', '2', '3']
        errors++
    , (err, records) ->
      records.should.eql [
        ['a', 'b', 'c', 'd']
        ['e', 'f', 'g', 'h']
      ] unless err
      errors.should.eql 1
      next err
    parser.write '''
    a,b,c,d
    1,2,3
    e,f,g,h
    '''
    parser.end()
