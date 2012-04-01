
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'escape', ->
    # Note: we only escape quote and escape character
    it 'Test default', ->
        csv()
        .fromPath( "#{__dirname}/escape/default.in" , escape: '"' )
        .toPath( "#{__dirname}/escape/default.tmp" )
        .on 'data', (data, index) ->
            if index is 0
                data[1].should.eql '19"79.0'
                data[3].should.eql 'A"B"C'
        .on 'end', ->
            result = fs.readFileSync( "#{__dirname}/escape/default.out" ).toString()
            expect = fs.readFileSync( "#{__dirname}/escape/default.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/escape/default.tmp"
    it 'Test backslash', ->
        csv()
        .fromPath( "#{__dirname}/escape/backslash.in" , escape: '\\' )
        .toPath( "#{__dirname}/escape/backslash.tmp" )
        .on 'data', (data, index) ->
            if index is 0
                data[1].should.eql '19"79.0'
                data[3].should.eql 'A"B"C'
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync( "#{__dirname}/escape/backslash.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/escape/backslash.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/escape/backslash.tmp" 