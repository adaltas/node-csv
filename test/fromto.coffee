
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'fromto', ->
  
  it 'Test fs stream', (next) ->
    csv()
    .from.stream(fs.createReadStream "#{__dirname}/fromto/sample.in", flags: 'r' )
    .to.stream(fs.createWriteStream "#{__dirname}/fromto/sample.tmp", flags: 'w' )
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/fromto/sample.out"
      result = fs.readFileSync "#{__dirname}/fromto/sample.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/fromto/sample.tmp", next
  
  it 'Test array to stream', (next) ->
    # note: destination line breaks is unix styled because we can't guess it
    record = [
      ["20322051544","1979.0","8.8017226E7","ABC","45","2000-01-01"]
      ["28392898392","1974.0","8.8392926E7","DEF","23","2050-11-27"]
    ]
    csv()
    .from.array(record)
    .to.path( "#{__dirname}/fromto/array_to_stream.tmp" )
    .on 'record', (record, index) ->
      index.should.be.below 2
      if index is 0
        record[0].should.eql '20322051544'
      else if index is 1
        record[0].should.eql '28392898392'
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/fromto/array_to_stream.out"
      result = fs.readFileSync "#{__dirname}/fromto/array_to_stream.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/fromto/array_to_stream.tmp", next
  
  it 'should encode null as empty string', (next) ->
    # note: destination line breaks is unix styled because we can't guess it
    record = [
      ["20322051544",null,"8.8017226E7","ABC","45","2000-01-01"]
      ["28392898392","1974.0","8.8392926E7","DEF","23",null]
    ]
    csv()
    .from.array(record)
    .transform( (record) ->
      record[0] = null
      record[3] = null
      record
    )
    .to.path( "#{__dirname}/fromto/null.tmp" )
    .on 'record', (record, index) ->
      index.should.be.below 2
      should.not.exist record[0]
      should.not.exist record[3]
      if index is 0
        should.not.exist record[1]
      else if index is 1
        should.not.exist record[5]
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/fromto/null.out"
      result = fs.readFileSync "#{__dirname}/fromto/null.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/fromto/null.tmp", next




