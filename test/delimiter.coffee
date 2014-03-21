
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'delimiter', ->
  
  it 'with empty field', (next) ->
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
  
  it 'with tabs to comma', (next) ->
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
