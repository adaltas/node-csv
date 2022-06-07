
import { parse } from '../lib/index.js'
import { assert_error } from './api.assert_error.coffee'

describe 'Option `cast_date`', ->
  
  it 'validate', ->
    (->
      parse cast: true, cast_date: 'ohno', ( -> )
    ).should.throw
      message: 'Invalid option cast_date: cast_date must be true or a function, got "ohno"'
      code: 'CSV_INVALID_OPTION_CAST_DATE'
  
  it 'true', (next) ->
    parser = parse """
    2000-01-01,date1
    2050-11-27,date2
    """,
      cast: true
      cast_date: true
    , (err, records) ->
      records.should.eql [
        [ new Date('2000-01-01T00:00:00.000Z'), 'date1' ],
        [ new Date('2050-11-27T00:00:00.000Z'), 'date2' ]
      ]
      next err
  
  it 'value end with space and number (issue #342)', (next) ->
    # Current implementation rely on `isNaN(Date.parse(value))`
    # While it return `NaN` in Firefox, Node.js return a timestamp for
    # `node -e 'console.info(Date.parse("Test 1"))'`
    parser = parse """
    Test 1
    """,
      cast: true
      cast_date: true
    , (err, [[record]]) ->
      record.toISOString().should.match /^\d{4}-\d{2}-\d{2}/
      next err
