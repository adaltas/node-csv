
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'row delimiter', ->

  it 'Test line breaks custom', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], rowDelimiter: '::', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC::28392898392,8.8392926E7,DEF::'
      next()
  
  it 'Test line breaks unix', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], rowDelimiter: 'unix', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC\n28392898392,8.8392926E7,DEF\n'
      next()
  
  it 'Test line breaks unicode', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], rowDelimiter: 'unicode', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC\u202828392898392,8.8392926E7,DEF\u2028'
      next()
  
  it 'Test line breaks mac', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], rowDelimiter: 'mac', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC\r28392898392,8.8392926E7,DEF\r'
      next()
  
  it 'Test line breaks windows', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], rowDelimiter: 'windows', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC\r\n28392898392,8.8392926E7,DEF\r\n'
      next()
  