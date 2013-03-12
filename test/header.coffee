
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'header', ->
  
  it 'should print headers with defined write columns', (next) ->
    csv()
    .from.string("""
      20322051544,1979,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974,8.8392926E7,DEF,23,2050-11-27
      """)
    .on 'end', (count) ->
      count.should.eql 2
    .to.string( (result) ->
      result.should.eql """
      FIELD_1,FIELD_2
      20322051544,1979
      28392898392,1974
      """
      next()
    , header: true, columns: ["FIELD_1", "FIELD_2"] )
  
  it 'should print headers with true read columns and defined write columns', (next) ->
    csv()
    .from.string("""
      FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
      20322051544,1979,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974,8.8392926E7,DEF,23,2050-11-27
      """, columns: true)
    .to.string( (result) ->
      result.should.eql """
      FIELD_1,FIELD_2
      20322051544,1979
      28392898392,1974
      """
      next()
    , header: true, columns: ["FIELD_1", "FIELD_2"] )

  it 'should print headers if no records to parse', (next) ->
    csv()
    .from.array([])
    .to.string((data) ->
      data.should.eql 'some,headers'
    , header: true, columns: ['some', 'headers'])
    .on 'end', (count) ->
      count.should.eql 0
      next()





