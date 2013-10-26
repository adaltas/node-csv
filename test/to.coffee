
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
stream = require 'stream'
should = require 'should'
Iconv = require('iconv').Iconv
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'to', ->

  describe 'auto', ->

    it 'should write to a path', (next) ->
      data = """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      csv()
      .from(data)
      .to( "#{__dirname}/fromto/string_to_stream.tmp" )
      .on 'finish', (count) ->
        count.should.eql 2
        expect = fs.readFileSync "#{__dirname}/fromto/string_to_stream.out"
        result = fs.readFileSync "#{__dirname}/fromto/string_to_stream.tmp"
        result.should.eql expect
        fs.unlink "#{__dirname}/fromto/string_to_stream.tmp", next
    it 'should write to a string', (next) ->
      data = """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      csv()
      .from.string(data)
      .to (output) ->
        output.should.eql data
        next()

  describe 'string', ->
    it 'should write to a string', (next) ->
      data = """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      csv()
      .from.string(data)
      .to.string (output, count) ->
        output.should.eql data
        count.should.eql 2
        next()

  describe 'path', ->
  
    it 'Test string to stream', (next) ->
      data = """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      csv()
      .from.string(data)
      .to.path( "#{__dirname}/fromto/string_to_stream.tmp" )
      .on 'record', (record, index) ->
        index.should.be.below 2
        if index is 0
          record[0].should.eql '20322051544'
        else if index is 1
          record[0].should.eql '28392898392'
      .on 'finish', (count) ->
        count.should.eql 2
        expect = fs.readFileSync "#{__dirname}/fromto/string_to_stream.out"
        result = fs.readFileSync "#{__dirname}/fromto/string_to_stream.tmp"
        result.should.eql expect
        fs.unlink "#{__dirname}/fromto/string_to_stream.tmp", next

  describe 'array', ->
  
    it 'should output an array', (next) ->
      data = """
      20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      csv()
      .from.string(data)
      .to.array (data) ->
        data.should.eql [
          ['20322051544','1979.0','8.8017226E7','ABC','45','2000-01-01']
          ['28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27']
        ]
        next()

  describe 'end', ->

    it 'should call the end function', (next) ->
      out = ->
        @writable = true
        @
      out.prototype.__proto__ = stream.prototype
      out.prototype.write = (data) -> true
      out.prototype.end = next
      out = new out
      csv()
      .from.array(['a','b'])
      .to.stream( out )

    it 'should not call the end function if end is false', (next) ->
      out = ->
        @writable = true
        @
      out.prototype.__proto__ = stream.prototype
      out.prototype.write = (data) -> true
      out.prototype.end = ->
        true.should.not.be.ok
      out = new out
      csv()
      .from.array(['a','b'])
      .to.stream( out, end: false )
      .on 'end', ->
        setTimeout next, 200



