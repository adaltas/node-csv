
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'columns', ->

  it 'should map the column property name to display name', (next) ->
    stringify [
      {field1: 'val11', field2: 'val12', field3: 'val13'}
      {field1: 'val21', field2: 'val22', field3: 'val23'}
    ], header: true, columns: {field1: 'column1', field3: 'column3'}, (err, data) ->
      data.should.eql 'column1,column3\nval11,val13\nval21,val23'
      next()