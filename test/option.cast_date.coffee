
parse = require '../lib'

describe 'Option `cast_date`', ->
  
  it 'true', (next) ->
    data = []
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
