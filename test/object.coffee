
should = require 'should'
transform = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'object', ->

  it 'recieve object emit new columns', (next) ->
    transform [
      { FIELD_1: '20322051544', FIELD_2: '1979', FIELD_3: 'ABC' }
      { FIELD_1: '28392898392', FIELD_2: '1974', FIELD_3: 'DEF' }
      { FIELD_1: '83929843999', FIELD_2: '1944', FIELD_3: 'HIJ' }
    ], (record) ->
      record.should.not.be.an.Array
      record.FIELD_4 = 'new_field'
      record
    , (err, data) ->
      return next err if err
      data.should.eql [
        { FIELD_1: '20322051544', FIELD_2: '1979', FIELD_3: 'ABC', FIELD_4: 'new_field' }
        { FIELD_1: '28392898392', FIELD_2: '1974', FIELD_3: 'DEF', FIELD_4: 'new_field' }
        { FIELD_1: '83929843999', FIELD_2: '1944', FIELD_3: 'HIJ', FIELD_4: 'new_field' }
      ]
      next()
