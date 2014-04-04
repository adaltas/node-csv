
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

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
  
  it 'returned by user with the help of the first line', (next) ->
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
