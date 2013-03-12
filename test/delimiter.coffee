
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'delimiter', ->
  
  it 'Test empty value', (next) ->
    csv()
    .from.string( """
      20322051544,,8.8017226E7,45,
      ,1974,8.8392926E7,,
      """ )
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
    .on 'end', (count) ->
      count.should.eql 2
    .to.string (result) ->
      result.should.eql """
      20322051544,,8.8017226E7,45,
      ,1974,8.8392926E7,,
      """
      next()
  
  it 'Test tabs to comma', (next) ->
    csv()
    .from.string( """
      20322051544\t\t8.8017226E7\t45\t
      \t1974\t8.8392926E7\t\t
      """, delimiter: '\t' )
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
    .on 'end', (count) ->
      count.should.eql 2
    .to.string( (result) ->
      result.should.eql """
      20322051544,,8.8017226E7,45,
      ,1974,8.8392926E7,,
      """
      next()
    , delimiter: ',' )

