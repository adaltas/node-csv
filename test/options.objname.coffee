
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'objname', ->

  it 'should print object of objects with properties using value of given column from columns', (next) ->
    parse """
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    28392898392,1974,8.8392926E7,DEF,23,2050-11-27
    """, objname: "FIELD_1", columns: ["FIELD_1", "FIELD_2", "FIELD_3", "FIELD_4", "FIELD_5", "FIELD_6"], (err, data) ->
      return next err if err
      data.should.eql "20322051544":
        "FIELD_1":"20322051544"
        "FIELD_2":"1979"
        "FIELD_3":"8.8017226E7"
        "FIELD_4":"ABC"
        "FIELD_5":"45"
        "FIELD_6":"2000-01-01"
      ,
      "28392898392":
        "FIELD_1":"28392898392"
        "FIELD_2":"1974"
        "FIELD_3": "8.8392926E7"
        "FIELD_4":"DEF"
        "FIELD_5":"23"
        "FIELD_6":"2050-11-27"
      next()

  it 'should print object of objects with properties using value of given column from header row', (next) ->
    parse """
    FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    28392898392,1974,8.8392926E7,DEF,23,2050-11-27
    """, objname: "FIELD_1", columns: true, (err, data) ->
      return next err if err
      data.should.eql "20322051544":
        "FIELD_1":"20322051544"
        "FIELD_2":"1979"
        "FIELD_3":"8.8017226E7"
        "FIELD_4":"ABC"
        "FIELD_5":"45"
        "FIELD_6":"2000-01-01"
      ,
      "28392898392":
        "FIELD_1":"28392898392"
        "FIELD_2":"1974"
        "FIELD_3": "8.8392926E7"
        "FIELD_4":"DEF"
        "FIELD_5":"23"
        "FIELD_6":"2050-11-27"
      next()
