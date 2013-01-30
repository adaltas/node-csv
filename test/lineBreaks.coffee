
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'lineBreaks', ->
  
  it 'Test line breaks custom', (next) ->
    csv()
    .from.string( """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """ )
    .on 'end', (count) ->
      count.should.eql 2
    .to.string( (result) ->
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01::28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
    , lineBreaks: '::' )
  
  it 'Test line breaks unix', (next) ->
    csv()
    .from.string( """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """ )
    .to.string( (result) ->
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\n28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
    , lineBreaks: 'unix')
  
  it 'Test line breaks unicode', (next) ->
    csv()
    .from.string( """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """ )
    .to.string( (result) ->
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\u202828392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
    , lineBreaks: 'unicode')
  
  it 'Test line breaks mac', (next) ->
    csv()
    .from.string( """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """ )
    .to.string( (result) ->
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\r28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
    , lineBreaks: 'mac')
  
  it 'Test line breaks windows', (next) ->
    csv()
    .from.string( """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """ )
    .to.string( (result) ->
      result.should.eql """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\r\n28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
    , lineBreaks: 'windows')


