
fs = require 'fs'
parse = require '../src'

describe 'options delimiter', ->
  
  it 'using default comma', (next) ->
    parse """
    20322051544,,8.8017226E7,45,
    ,1974,8.8392926E7,,
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','','8.8017226E7','45','']
        [ '','1974','8.8392926E7','','']
      ]
      next()
  
  it 'using tab', (next) ->
    parse """
    20322051544\t\t8.8017226E7\t45\t
    \t1974\t8.8392926E7\t\t
    """, delimiter: '\t', (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','','8.8017226E7','45','']
        [ '','1974','8.8392926E7','','']
      ]
      next()
  
  it 'multiple chars empty fields only', (next) ->
    parse """
    !#
    !#
    """, delimiter: '!#', (err, data) ->
      return next err if err
      data.should.eql [
        [ '', '']
        [ '', '']
      ]
      next()
  
  it 'multiple chars mixed fields', (next) ->
    parse """
    20322051544!#!#8.8017226E7!#45!#
    !#1974!#8.8392926E7!#!#
    """, delimiter: '!#', (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','','8.8017226E7','45','']
        [ '','1974','8.8392926E7','','']
      ]
      next()
      
  it 'If the delimiter does not match from the csv data, parsing should terminate with appropriate error message when the data read is more than the value set for max_limit_on_data_read', (next) ->
    parse """
    a,b,c
    a,b,c
    a,b,c
    a,b,c
    a,b,c
    """, delimiter: ':', rowDelimiter: '\t\t', max_limit_on_data_read: 10, (err, data) ->
      err.message.should.eql 'Field exceeds max_limit_on_data_read setting (10) ":"' if err
      should(data).not.be.ok()
      next()
