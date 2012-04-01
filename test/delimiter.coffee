
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'delimiter', ->
    it 'Test empty value', ->
        csv()
        .fromPath( "#{__dirname}/delimiter/empty_value.in" )
        .toPath( "#{__dirname}/delimiter/empty_value.tmp" )
        .transform (data, index) ->
            data.length.should.eql 5
            if index is 0
                data[1].should.eql ''
                data[4].should.eql ''
            else if index is 1
                data[0].should.eql ''
                data[3].should.eql ''
                data[4].should.eql ''
            data
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync( "#{__dirname}/delimiter/empty_value.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/delimiter/empty_value.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/delimiter/empty_value.tmp"
    it 'Test tabs to comma', ->
        csv()
        .fromPath( "#{__dirname}/delimiter/tab_to_coma.in", delimiter: '\t' )
        .toPath( "#{__dirname}/delimiter/tab_to_coma.tmp", delimiter: ',' )
        .transform (data,index) ->
            data.length.should.eql 5
            if index is 0
                data[1].should.eql ''
                data[4].should.eql ''
            else if index is 1
                data[0].should.eql ''
                data[3].should.eql ''
                data[4].should.eql ''
            data
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync( "#{__dirname}/delimiter/tab_to_coma.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/delimiter/tab_to_coma.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/delimiter/tab_to_coma.tmp"

