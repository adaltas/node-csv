
###
Node CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
Testing the read options `trim`, `ltrim` and `rtrim`.
###

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'trim', ->
    it 'should ignore the whitespaces immediately following the delimiter', ->
        csv()
        .fromPath( "#{__dirname}/trim/ltrim.in", ltrim: true )
        .toPath( "#{__dirname}/trim/ltrim.tmp" )
        .transform( (data, index) -> data )
        .on 'end', (count) ->
            count.should.eql 3
            expect = fs.readFileSync( "#{__dirname}/trim/ltrim.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/trim/ltrim.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/trim/ltrim.tmp"
    it 'should ignore the whitespaces immediately preceding the delimiter', ->
        csv()
        .fromPath( "#{__dirname}/trim/rtrim.in", rtrim: true )
        .toPath( "#{__dirname}/trim/rtrim.tmp" )
        .transform( (data, index) -> data )
        .on 'end', (count) ->
            count.should.eql 3
            expect = fs.readFileSync( "#{__dirname}/trim/rtrim.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/trim/rtrim.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/trim/rtrim.tmp"
    it 'should ignore the whitespaces immediately preceding and following the delimiter', ->
        csv()
        .fromPath( "#{__dirname}/trim/trim.in", trim: true )
        .toPath( "#{__dirname}/trim/trim.tmp" )
        .transform( (data, index) -> data )
        .on 'end', (count) ->
            count.should.eql 3
            expect = fs.readFileSync( "#{__dirname}/trim/trim.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/trim/trim.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/trim/trim.tmp"
    it 'should preserve surrounding whitespaces', ->
        csv()
        .fromPath( "#{__dirname}/trim/notrim.in" )
        .toPath( "#{__dirname}/trim/notrim.tmp" )
        .transform( (data, index) -> data )
        .on 'end', (count) ->
            count.should.eql 3
            expect = fs.readFileSync( "#{__dirname}/trim/notrim.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/trim/notrim.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/trim/notrim.tmp"

