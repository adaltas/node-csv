
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'header', ->

  it 'Test line breaks custom', (next) ->
    stringify [
      [ '20322051544','1979.0','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
    ], rowDelimiter: '::', (err, result) ->
      return next err if err
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01::28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
  
  it 'Test line breaks unix', (next) ->
    stringify [
      [ '20322051544','1979.0','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
    ], rowDelimiter: 'unix', (err, result) ->
      return next err if err
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\n28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
  
  it 'Test line breaks unicode', (next) ->
    stringify [
      [ '20322051544','1979.0','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
    ], rowDelimiter: 'unicode', (err, result) ->
      return next err if err
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\u202828392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
  
  it 'Test line breaks mac', (next) ->
    stringify [
      [ '20322051544','1979.0','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
    ], rowDelimiter: 'mac', (err, result) ->
      return next err if err
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\r28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
  
  it 'Test line breaks windows', (next) ->
    stringify [
      [ '20322051544','1979.0','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
    ], rowDelimiter: 'windows', (err, result) ->
      return next err if err
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\r\n28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
  