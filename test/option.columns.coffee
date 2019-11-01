
parse = require '../lib'
assert_error = require './api.assert_error'

describe 'Option `columns`', ->
  
  describe 'validation', ->
        
    it 'check the columns value', ->
      (->
        parse "", columns: [{
          name: 'valid',
        },{
          invalid: 'oh no'
        }], (->)
      ).should.throw 'Invalid Option columns: property "name" is required at position 1 when column is an object literal'
    
    it 'check the columns value', ->
      (->
        parse "", columns: [{name: 'valid'}, true], (->)
      ).should.throw
        message: 'Invalid column definition: expect a string or a literal object, got true at position 1'
        code: 'CSV_INVALID_COLUMN_DEFINITION'
    
    it 'check the columns value', ->
      (->
        parse "", columns: {}, (->)
      ).should.throw
        message: 'Invalid option columns: expect an object, a function or true, got {}'
        code: 'CSV_INVALID_OPTION_COLUMNS'
  
    it 'skip columns with false value', (next) ->
      parse """
      1,2,3,4
      5,6,7,8
      """, columns: ["a", false, "c", false], (err, data) ->
        data.should.eql [
          { a: "1", c: "3" }
          { a: "5", c: "7" }
        ] unless err
        next err
        
    it 'dont mutate options', (next) ->
      columns = ["a", false, "c", false]
      parse """
      1,2,3,4
      5,6,7,8
      """, columns: columns, (err, data) ->
        columns.should.eql ["a", false, "c", false] unless err
        next err
  
  describe 'boolean', ->

    it 'read from first row if true', (next) ->
      parse """
      FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
      20322051544,1979,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974,8.8392926E7,DEF,23,2050-11-27
      """, columns: true, (err, data) ->
        data.should.eql [
          'FIELD_1': '20322051544'
          'FIELD_2': '1979'
          'FIELD_3': '8.8017226E7'
          'FIELD_4': 'ABC'
          'FIELD_5': '45'
          'FIELD_6': '2000-01-01'
        ,
          'FIELD_1': '28392898392'
          'FIELD_2': '1974'
          'FIELD_3':  '8.8392926E7'
          'FIELD_4': 'DEF'
          'FIELD_5': '23'
          'FIELD_6': '2050-11-27'
        ] unless err
        next err

    it 'disabled if false', (next) ->
      parse """
      a,b,c
      d,e,f
      """, columns: false, (err, data) ->
        data.should.eql [
          ['a', 'b', 'c']
          ['d', 'e', 'f']
        ] unless err
        next err
          
  describe 'boolean array', ->

    it 'enforced by user if array', (next) ->
      parse """
      20322051544,1979,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974,8.8392926E7,DEF,23,2050-11-27
      """, columns: ["FIELD_1", "FIELD_2", "FIELD_3", "FIELD_4", "FIELD_5", "FIELD_6"], (err, data) ->
        data.should.eql [
          "FIELD_1":"20322051544"
          "FIELD_2":"1979"
          "FIELD_3":"8.8017226E7"
          "FIELD_4":"ABC"
          "FIELD_5":"45"
          "FIELD_6":"2000-01-01"
        ,
          "FIELD_1":"28392898392"
          "FIELD_2":"1974"
          "FIELD_3":"8.8392926E7"
          "FIELD_4":"DEF"
          "FIELD_5":"23"
          "FIELD_6":"2050-11-27"
        ] unless err
        next err

    it 'validate options column length on first line', (next) ->
      parse """
      1,2,3
      4,5,6,x
      7,8,9,x
      """, columns: ["a", "b", "c", "d"], (err, data) ->
        assert_error err,
          message: 'Invalid Record Length: header length is 4, got 3 on line 1'
          code: 'CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS'
        next()

    it 'validate options column length on last line', (next) ->
      parse """
      1,2,3,x
      4,5,6,x
      7,8,9
      """, columns: ["a", "b", "c", "d"], (err, data) ->
        assert_error err,
          message: 'Invalid Record Length: header length is 4, got 3 on line 3'
          code: 'CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS'
        next()
    
    it 'context column is null when cast force the context creation', (next) ->
      # Trigger cast to force the creation of a context
      parse "a\nb,\n",
        columns: true
        cast: (value) -> value
      , (err, data) ->
        assert_error err,
          message: 'Invalid Record Length: header length is 1, got 2 on line 2'
          code: 'CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS'
          column: null
        next()

    it 'context column is null when columns number inferieur to record length, fix regression #259', (next) ->
      parse "a\nb,\n", columns: true, (err, data) ->
        assert_error err,
          message: 'Invalid Record Length: header length is 1, got 2 on line 2'
          code: 'CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS'
          column: null
        next()
    
    it 'skips column names defined as undefined', (next) ->
      parse """
      0,1,2,3,4
      5,6,7,8,9
      """, columns: ['a',,,, 'b'], (err, data) ->
        data.should.eql [
          {a: '0', b: '4'}
          {a: '5', b: '9'}
        ] unless err
        next err
    
    it 'skips column names defined as false', (next) ->
      parse """
      0,1,2,3,4
      5,6,7,8,9
      """, columns: ['a',false,false,false, 'b'], (err, data) ->
        data.should.eql [
          {a: '0', b: '4'}
          {a: '5', b: '9'}
        ] unless err
        next err
    
    it 'skips column names defined as null and last', (next) ->
      # Fix a but where error was not throw if columns empty count was equal to
      # the number of column in the dataset plus one.
      # It seems the bug is due to to JavaScript as
      # `console.log(JSON.stringify([,,]))`
      # report only 2 null values
      parse """
      0,1,2
      3,4,5
      """, columns: ['a',null,null], (err, data) ->
        data.should.eql [
          { a: '0' }
          { a: '3' }
        ] unless err
        next err
    
    it 'illustrate bug with undefined values', (next) ->
      # Be careful on how JavaScript handle multiple trailing commas as it
      # will discard the last one.
      # For exemple, `console.log(JSON.stringify([,,]))` report 2 null values
      parse """
      0,1,2
      3,4,5
      """, columns: ['a',,,], (err, data) ->
        data.should.eql [
          { a: '0' }
          { a: '3' }
        ] unless err
        next err
    
    it '', (next) ->
      # Trigger a bug where error is try to stringify and parse an undefined
      # value, conjointly triggered by a null column and a
      # CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS error
      parse """
      col_a,col_b,col_c
      foo,bar
      foo,bar,baz
      """
      , columns: ['a', 'b', null], (err, data) ->
        err.code.should.eql 'CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS'
        next()

  describe 'function', ->
  
    it 'takes first line as argument', (next) ->
      parse """
      FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
      20322051544,1979,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974,8.8392926E7,DEF,23,2050-11-27
      """, columns: (record) ->
        for column in record
          column.toLowerCase()
      , (err, data) ->
        data.should.eql [
          "field_1":"20322051544"
          "field_2":"1979"
          "field_3":"8.8017226E7"
          "field_4":"ABC"
          "field_5":"45"
          "field_6":"2000-01-01"
        ,
          "field_1":"28392898392"
          "field_2":"1974"
          "field_3": "8.8392926E7"
          "field_4":"DEF"
          "field_5":"23"
          "field_6":"2050-11-27"
        ] unless err
        next err

    it 'catch thrown errors', (next) ->
      parse """
      FIELD_1,FIELD_2,FIELD_3,FIELD_4
      abc,123,def,456
      hij,789,klm,0
      """, columns: (columns) ->
        throw Error 'Catchme'
      , (err) ->
        err.message.should.eql 'Catchme'
        next()

    it 'must return an array of headers', (next) ->
      parse """
      FIELD_1
      abc
      """, columns: (columns) ->
        return {FIELD: true}
      , (err) ->
        assert_error err,
          message: 'Invalid Column Mapping: expect an array from column function, got {"FIELD":true}'
          code: 'CSV_INVALID_COLUMN_MAPPING'
          headers: FIELD: true
        next()
