
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'options', ->

  it 'copy the first level of properties', (next) ->
    options = columns: true
    parse """
    FIELD_1,FIELD_2
    20322051544,1979
    28392898392,1974
    """, options, (err, data) ->
      return next err if err
      options.columns.should.be.True
      parse """
      FIELD_1,FIELD_2
      20322051544,1979
      28392898392,1974
      """, options, (err, data) ->
        return next err if err
        data.should.eql [
          "FIELD_1":"20322051544"
          "FIELD_2":"1979"
        ,
          "FIELD_1":"28392898392"
          "FIELD_2":"1974"
        ]
        next()