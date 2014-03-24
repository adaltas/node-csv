
should = require 'should'
transform = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'async', ->

  it 'modify the recieved object', (next) ->
    transform [
      [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
      [ '83929843999','1944','8.8349294E2','HIJ','17','2060-08-28' ]
    ], (row, callback) ->
      process.nextTick ->
        row.push row.shift()
        callback null, row
    , (err, data) ->
      return next err if err
      data.should.eql [
        [ '1979','8.8017226E7','ABC','45','2000-01-01', '20322051544' ]
        [ '1974','8.8392926E7','DEF','23','2050-11-27', '28392898392' ]
        [ '1944','8.8349294E2','HIJ','17','2060-08-28', '83929843999' ]
      ]
      next()
    
  it 'skip lines when undefined is returned', (next) ->
    transform [
      [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
      [ '83929843999','1944','8.8349294E2','HIJ','17','2060-08-28' ]
    ], (row, callback) ->
      process.nextTick callback
    , (err, data) ->
      return next err if err
      data.should.eql []
      next()
    
  it 'skip lines when undefined is returned', (next) ->
    index = 0
    transform [
      [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
      [ '83929843999','1944','8.8349294E2','HIJ','17','2060-08-28' ]
      [ '47191084482','1978','8.8392926E7','2FF','23','2064-02-15' ]
    ], (row, callback) ->
      process.nextTick ->
        index++
        callback null, if index % 2 then row else null
    , (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
        [ '83929843999','1944','8.8349294E2','HIJ','17','2060-08-28' ]
      ]
      next()
    
  it 'recieve an array and return an object', (next) ->
    transform [
      [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
    ], (row, callback) ->
      process.nextTick ->
        callback null, field_1: row[4], field_2: row[3]
    , (err, data) ->
      return next err if err
      data.should.eql [
        { field_1: '45', field_2: 'ABC' }
        { field_1: '23', field_2: 'DEF' }
      ]
      next()
    
  it 'should accept a returned string', (next) ->
    index = -1
    transform [
      [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
    ], (row, callback) ->
      process.nextTick ->
        index++
        callback null, ( if index > 0 then ',' else '' ) + "#{row[4]}:#{row[3]}"
    , (err, data) ->
      return next err if err
      data.join('').should.eql '45:ABC,23:DEF'
      next()
    
  it 'should accept a returned number', (next) ->
    index = 0
    transform [
      [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
      [ '83929843999','1944','8.8349294E2','HIJ','17','2060-08-28' ]
    ], (row, callback) ->
      process.nextTick ->
        callback null, index++
    , (err, data) ->
      return next err if err
      data.join('').should.eql '012'
      next()
    
  it 'should accept a returned array with different types', (next) ->
    transform [
      [ '20322051544','1979','8.8017226E7','2000-01-01' ]
      [ '28392898392','1974','8.8392926E7','2050-11-27' ]
      [ '83929843999','1944','8.8349294E2','2060-08-28' ]
    ], (row, callback) ->
      process.nextTick ->
        [year, month, day] = row[3].split('-')
        callback null, [parseInt(row[0]), parseFloat(row[2]) ,Date.UTC(year, month, day)]
    , (err, data) ->
      return next err if err
      data.should.eql [
        [ 20322051544,'8.8017226E7',949363200000 ]
        [ 28392898392,'8.8392926E7',2555712000000 ]
        [ 83929843999,'8.8349294E2',2863555200000 ]
      ]
      next()
    
  it 'should accept multiple emit', (next) ->
    chunks = [
      [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
      [ '47191084482','1978','8.8392926E7','2FF','23','2064-02-15' ]
    ]
    transform [
      [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
      [ '83929843999','1944','8.8349294E2','HIJ','17','2060-08-28' ]
    ], (row, callback) ->
      process.nextTick ->
        callback null, row, chunks.shift()
    , (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
        [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
        [ '83929843999','1944','8.8349294E2','HIJ','17','2060-08-28' ]
        [ '47191084482','1978','8.8392926E7','2FF','23','2064-02-15' ]
      ]
      next()












