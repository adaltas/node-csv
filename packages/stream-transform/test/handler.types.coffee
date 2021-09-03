
import transform from '../lib/index.js'

describe 'handler.types', ->

  it 'receive object and add new column', (next) ->
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

  it 'receive string and return object', (next) ->
    transform [
      '20322-051544'
      '28392-898392'
      '83929-843999'
    ], (record) ->
      record.should.not.be.an.Array
      [value_1, value_2] = record.split '-'
      record =
        FIELD_1: value_1
        FIELD_2: value_2
      record
    , (err, data) ->
      return next err if err
      data.should.eql [
        { FIELD_1: '20322', FIELD_2: '051544' }
        { FIELD_1: '28392', FIELD_2: '898392' }
        { FIELD_1: '83929', FIELD_2: '843999' }
      ]
      next()
