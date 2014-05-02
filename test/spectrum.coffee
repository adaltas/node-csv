
spectrum = require 'csv-spectrum'
each = require 'each'
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'spectrum', ->

  it 'pass all tests', (next) ->
    spectrum (err, tests) ->
      each tests
      .on 'item', (test, next) ->
        parse test.csv.toString(), columns: true, (err, data) ->
          return next err if err
          data.should.eql JSON.parse test.json.toString()
          next()
      .on 'both', (err) ->
        next err
