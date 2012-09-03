
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'lineBreaks', ->
  
  it 'Test line breaks custom', (next) ->
    csv()
    .from.path( "#{__dirname}/lineBreaks/lineBreaks.in" )
    .to.path( "#{__dirname}/lineBreaks/custom.tmp", lineBreaks: '::' )
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/lineBreaks/custom.out"
      result = fs.readFileSync "#{__dirname}/lineBreaks/custom.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/lineBreaks/custom.tmp", next
  
  it 'Test line breaks unix', (next) ->
    csv()
    .from.path( "#{__dirname}/lineBreaks/lineBreaks.in" )
    .to.path( "#{__dirname}/lineBreaks/unix.tmp", lineBreaks: "unix")
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/lineBreaks/unix.out"
      result = fs.readFileSync "#{__dirname}/lineBreaks/unix.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/lineBreaks/unix.tmp", next
  
  it 'Test line breaks unicode', (next) ->
    csv()
    .from.path( "#{__dirname}/lineBreaks/lineBreaks.in")
    .to.path( "#{__dirname}/lineBreaks/unicode.tmp", lineBreaks: 'unicode')
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/lineBreaks/unicode.out"
      result = fs.readFileSync "#{__dirname}/lineBreaks/unicode.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/lineBreaks/unicode.tmp", next
  
  it 'Test line breaks mac', (next) ->
    csv()
    .from.path( "#{__dirname}/lineBreaks/lineBreaks.in" )
    .to.path( "#{__dirname}/lineBreaks/mac.tmp", lineBreaks: 'mac' )
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/lineBreaks/mac.out"
      result = fs.readFileSync "#{__dirname}/lineBreaks/mac.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/lineBreaks/mac.tmp", next
  
  it 'Test line breaks windows', (next) ->
    csv()
    .from.path( "#{__dirname}/lineBreaks/lineBreaks.in" )
    .to.path( "#{__dirname}/lineBreaks/windows.tmp", lineBreaks: 'windows' )
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/lineBreaks/windows.out"
      result = fs.readFileSync "#{__dirname}/lineBreaks/windows.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/lineBreaks/windows.tmp", next


