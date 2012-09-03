
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'escape', ->

  # Note: we only escape quote and escape character
  it 'should honor the default double quote escape charactere', (next) ->
    csv()
    .from.path("#{__dirname}/escape/default.in", escape: '"')
    .to.path("#{__dirname}/escape/default.tmp")
    .on 'record', (record, index) ->
      if index is 0
        record[1].should.eql '19"79.0'
        record[3].should.eql 'A"B"C'
    .on 'close', ->
      result = fs.readFileSync "#{__dirname}/escape/default.out"
      expect = fs.readFileSync "#{__dirname}/escape/default.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/escape/default.tmp", next

  it 'should honor the backslash escape charactere', (next) ->
    csv()
    .from.path("#{__dirname}/escape/backslash.in", escape: '\\')
    .to.path("#{__dirname}/escape/backslash.tmp")
    .on 'record', (record, index) ->
      if index is 0
        record[1].should.eql '19"79.0'
        record[3].should.eql 'A"B"C'
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/escape/backslash.out"
      result = fs.readFileSync "#{__dirname}/escape/backslash.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/escape/backslash.tmp", next
