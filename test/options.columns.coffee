
should = require 'should'
parse = require '../src'

describe 'columns', ->

  it 'read from first row if true', (next) ->
    parse """
    FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    28392898392,1974,8.8392926E7,DEF,23,2050-11-27
    """, columns: true, (err, data) ->
      return next err if err
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
        "FIELD_3": "8.8392926E7"
        "FIELD_4":"DEF"
        "FIELD_5":"23"
        "FIELD_6":"2050-11-27"
      ]
      next()

  it 'enforced by user if array', (next) ->
    parse """
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    28392898392,1974,8.8392926E7,DEF,23,2050-11-27
    """, columns: ["FIELD_1", "FIELD_2", "FIELD_3", "FIELD_4", "FIELD_5", "FIELD_6"], (err, data) ->
      return next err if err
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
        "FIELD_3": "8.8392926E7"
        "FIELD_4":"DEF"
        "FIELD_5":"23"
        "FIELD_6":"2050-11-27"
      ]
      next()
      
  it 'skip columns with false value', (next) ->
    parse """
    abc,123,def,456
    hij,789,klm,789
    """, columns: ["FIELD_1", false, "FIELD_2", false], (err, data) ->
      return next err if err
      data.should.eql [
        "FIELD_1":"abc"
        "FIELD_2":"def"
      ,
        "FIELD_1":"hij"
        "FIELD_2":"klm"
      ]
      next()

  it 'validate options column length on first line', (next) ->
    parse """
    1,2,3
    4,5,6,x
    7,8,9,x
    """, columns: ["a", "b", "c", "d"], (err, data) ->
      err.message.should.eql 'Number of columns on line 1 does not match header'
      next()

  it 'emit single error when column count is invalid on multiple lines', (next) ->
    parse """
    1;2
    1
    3;4
    5;6;7
    """
    , delimiter: ';', skip_empty_lines: true, (err, data) ->
      err.message.should.eql 'Number of columns is inconsistent on line 2'
      process.nextTick next

  it 'validate options column length on last line', (next) ->
    parse """
    1,2,3,x
    4,5,6,x
    7,8,9
    """, columns: ["a", "b", "c", "d"], (err, data) ->
      err.message.should.eql 'Number of columns on line 3 does not match header'
      next()

  it 'handles missing column if number of columns is inconsistent', (next) ->
    parse """
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    28392898392,1974,8.8392926E7,23,2050-11-27
    """, (err, data) ->
      err.message.should.eql 'Number of columns is inconsistent on line 2'
      next()

  describe 'function', ->

    it 'takes first line as argument', (next) ->
      parse """
      FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
      20322051544,1979,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974,8.8392926E7,DEF,23,2050-11-27
      """, columns: (columns) ->
        for column in columns
          column.toLowerCase()
      , (err, data) ->
        return next err if err
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
        ]
        next()

    it 'catch thrown errors', (next) ->
      parse """
      FIELD_1,FIELD_2,FIELD_3,FIELD_4
      abc,123,def,456
      hij,789,klm,0
      """, columns: (columns) ->
        throw Error 'Catchme'
      , (err, data) ->
        err.message.should.eql 'Catchme'
        next()
