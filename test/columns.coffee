
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'columns', ->

  it 'should map the column property name to display name', (next) ->
    stringify [
      {field1: 'val11', field2: 'val12', field3: 'val13'}
      {field1: 'val21', field2: 'val22', field3: 'val23'}
    ], header: true, columns: {field1: 'column1', field3: 'column3'}, (err, data) ->
      return next err if err
      data.should.eql 'column1,column3\nval11,val13\nval21,val23\n'
      next()
  
  it 'should be the same length', (next) ->
    # Since there is not columns set in input options, we just expect
    # the output stream to contains 2 fields
    stringify [
      [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
    ], columns: ["FIELD_1", "FIELD_2"], (err, data) ->
      return next err if err
      data.should.eql '20322051544,1979\n28392898392,1974\n'
      next()

  it 'should map the column property name to display name', (next) ->
    stringify [
      {field1: 'val11', field2: 'val12', field3: 'val13'}
      {field1: 'val21', field2: 'val22', field3: 'val23'}
    ], columns: {field1: 'column1', field3: 'column3'}, header: true, (err, data) ->
      return next err if err
      data.should.eql 'column1,column3\nval11,val13\nval21,val23\n'
      next()







