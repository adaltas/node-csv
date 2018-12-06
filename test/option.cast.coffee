
parse = require '../lib'

describe 'Option `cast`', ->
  
  describe 'boolean true', ->
  
    it 'all columns', (next) ->
      parse '1,2,3', cast: true, (err, data) ->
        data.should.eql [ [1, 2, 3] ]
        next()
    
    it 'convert numbers', (next) ->
      data = []
      parser = parse({ cast: true })
      parser.write """
      20322051544,1979,8.8017226E7,8e2,ABC,45,2000-01-01
      28392898392,1974,8.8392926e7,8E2,DEF,23,2050-11-27
      """
      parser.on 'readable', ->
        while d = parser.read()
          data.push d
      parser.on 'error', (err) ->
        next err
      parser.on 'end', ->
        data.should.eql [
          [20322051544, 1979, 8.8017226e7, 800, 'ABC', 45, '2000-01-01']
          [28392898392, 1974, 8.8392926e7, 800, 'DEF', 23, '2050-11-27']
        ]
        next()
      parser.end()

    it 'ints', (next) ->
      parse '123a,123,0123,', cast: true, (err, data) ->
        data.should.eql [ ['123a', 123, 123, ''] ]
        next()

    it 'float', (next) ->
      parse '123a,1.23,0.123,01.23,.123,123.', cast: true, (err, data) ->
        data.should.eql [ ['123a', 1.23, 0.123, 1.23, 0.123, 123] ]
        next()
    
  describe 'function', ->

    it 'custom function', (next) ->
      parse """
      2000-01-01,date1
      2050-11-27,date2
      """,
        cast: (value, context) ->
          if context.index is 0
          then "#{value}T05:00:00.000Z"
          else {...context}
      , (err, records) ->
        records.should.eql [
          [ '2000-01-01T05:00:00.000Z', {
            column: 1, empty_lines: 0, header: false, index: 1, 
            invalid_field_length: 0, lines: 1, quoting: false, records: 0
          } ]
          [ '2050-11-27T05:00:00.000Z', {
            column: 1, empty_lines: 0, header: false, index: 1, 
            invalid_field_length: 0, lines: 2, quoting: false, records: 1
          } ]
        ] unless err
        next err

    it 'column is a string', (next) ->
      parse """
      1,2
      3,4,5
      6
      """,
        columns: ['a', 'b']
        relax_column_count: true
        cast: (value, {header, column}) ->
          typeof column
      , (err, records) ->
        records.should.eql [
          {a: 'string', b: 'string'}
          {a: 'string', b: 'string'}
          {a: 'string'}
        ] unless err
        next err

    it 'dont call cast on unreferenced columns', (next) ->
      parse """
      1,2
      3,4,5,6
      7
      """,
        columns: ['a', 'b']
        relax_column_count: true
        cast: (value, {header, column}) ->
          throw Error 'Oh no' if value > 4 and value < 7
      , (err, records) ->
        next err

    it 'custom function with quoting context', (next) ->
      parse """
      "2000-01-01",date1
      2025-12-31,"date2"
      2050-11-27,"date3"
      """,
        cast: (value, {quoting}) ->
          quoting
      , (err, records) ->
        records.should.eql [
          [ true, false ]
          [ false, true ]
          [ false, true ]
        ] unless err
        next err
      
      it 'return undefined', ->

    it 'accept all values', (next) ->
      parse """
      1,2,3
      4,5,6
      """,
        max_record_size: 10
        cast: (value, {index}) ->
          switch index
            when 0
              undefined
            when 1
              false
            when 2
              null
      , (err, records) ->
        records.shift().should.eql [undefined, false, null]
        next err
    
  describe 'columns', ->

    it 'header is true on first line when columns is true', (next) ->
      parse """
      a,b,c
      1,2,3
      4,5,6
      """,
        columns: true
        cast: (value, {header}) ->
          if header then value else parseInt value
      , (err, records) ->
        records.should.eql [
          {a: 1, b: 2, c: 3}
          {a: 4, b: 5, c: 6}
        ] unless err
        next err

    it 'header is false when columns is an object', (next) ->
      parse """
      1,2,3
      4,5,6
      """,
        columns: ['a', 'b', 'c']
        cast: (value, {header}) ->
          header.should.be.false()
          parseInt value
      , (err, records) ->
        records.should.eql [
          {a: 1, b: 2, c: 3}
          {a: 4, b: 5, c: 6}
        ] unless err
        next err

    it 'dont count header line', (next) ->
      parse """
      a,b,c
      1,2,3
      4,5,6
      """,
        columns: true
        cast: (value) ->
          value
      , (err, records) ->
        next err

  describe 'error', ->
    
    it 'catch error', (next) ->
      parse """
      1,2,3
      4,5,6
      """,
        cast: (value) ->
          if value is '6' then throw Error 'Catchme'
          value
      , (err, records) ->
        err.message.should.eql 'Catchme'
        next()
