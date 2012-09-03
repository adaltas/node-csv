
###
Node CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
Testing the read options `trim`, `ltrim` and `rtrim`.
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'trim', ->
  
  it 'should ignore the whitespaces immediately following the delimiter', (next) ->
    csv()
    .from.path( "#{__dirname}/trim/ltrim.in", ltrim: true )
    .to.path( "#{__dirname}/trim/ltrim.tmp" )
    .transform( (record, index) -> record )
    .on 'close', (count) ->
      count.should.eql 3
      expect = fs.readFileSync "#{__dirname}/trim/ltrim.out"
      result = fs.readFileSync "#{__dirname}/trim/ltrim.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/trim/ltrim.tmp", next
  
  it 'should ignore the whitespaces immediately preceding the delimiter', (next) ->
    csv()
    .from.path( "#{__dirname}/trim/rtrim.in", rtrim: true )
    .to.path( "#{__dirname}/trim/rtrim.tmp" )
    .transform( (record, index) -> record )
    .on 'close', (count) ->
      count.should.eql 3
      expect = fs.readFileSync "#{__dirname}/trim/rtrim.out"
      result = fs.readFileSync "#{__dirname}/trim/rtrim.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/trim/rtrim.tmp", next
  
  it 'should ignore the whitespaces immediately preceding and following the delimiter', (next) ->
    csv()
    .from.path( "#{__dirname}/trim/trim.in", trim: true )
    .to.path( "#{__dirname}/trim/trim.tmp" )
    .transform( (record, index) -> record )
    .on 'close', (count) ->
      count.should.eql 3
      expect = fs.readFileSync "#{__dirname}/trim/trim.out"
      result = fs.readFileSync "#{__dirname}/trim/trim.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/trim/trim.tmp", next
  
  it 'should preserve surrounding whitespaces', (next) ->
    csv()
    .from.path( "#{__dirname}/trim/notrim.in" )
    .to.path( "#{__dirname}/trim/notrim.tmp" )
    .transform( (record, index) -> record )
    .on 'close', (count) ->
      count.should.eql 3
      expect = fs.readFileSync "#{__dirname}/trim/notrim.out"
      result = fs.readFileSync "#{__dirname}/trim/notrim.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/trim/notrim.tmp", next

