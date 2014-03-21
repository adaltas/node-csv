
should = require 'should'
produce = require 'produce'
transform = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'callback', ->

  it 'with data, transform and callback', (next) ->
    transform [
      [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
      [ '83929843999','1944','8.8349294E2','HIJ','17','2060-08-28' ]
    ], (row) ->
      row.push row.shift()
      row
    , (err, data) ->
      return next err if err
      data.should.eql [
        [ '1979','8.8017226E7','ABC','45','2000-01-01', '20322051544' ]
        [ '1974','8.8392926E7','DEF','23','2050-11-27', '28392898392' ]
        [ '1944','8.8349294E2','HIJ','17','2060-08-28', '83929843999' ]
      ]
      next()