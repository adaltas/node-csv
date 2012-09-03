
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'delimiter', ->
  
  it 'Test empty value', (next) ->
    csv()
    .from.path( "#{__dirname}/delimiter/empty_value.in" )
    .to.path( "#{__dirname}/delimiter/empty_value.tmp" )
    .transform (record, index) ->
      record.length.should.eql 5
      if index is 0
        record[1].should.eql ''
        record[4].should.eql ''
      else if index is 1
        record[0].should.eql ''
        record[3].should.eql ''
        record[4].should.eql ''
      record
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/delimiter/empty_value.out"
      result = fs.readFileSync "#{__dirname}/delimiter/empty_value.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/delimiter/empty_value.tmp", next
  
  it 'Test tabs to comma', (next) ->
    csv()
    .from.path( "#{__dirname}/delimiter/tab_to_coma.in", delimiter: '\t' )
    .to.path( "#{__dirname}/delimiter/tab_to_coma.tmp", delimiter: ',' )
    .transform (record, index) ->
      record.length.should.eql 5
      if index is 0
        record[1].should.eql ''
        record[4].should.eql ''
      else if index is 1
        record[0].should.eql ''
        record[3].should.eql ''
        record[4].should.eql ''
      record
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/delimiter/tab_to_coma.out"
      result = fs.readFileSync "#{__dirname}/delimiter/tab_to_coma.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/delimiter/tab_to_coma.tmp", next

