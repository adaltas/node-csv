
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'fromto', ->
    it 'Test fs stream', ->
        csv()
        .fromStream(fs.createReadStream "#{__dirname}/fromto/sample.in", flags: 'r' )
        .toStream(fs.createWriteStream "#{__dirname}/fromto/sample.tmp", flags: 'w' )
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync( "#{__dirname}/fromto/sample.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/fromto/sample.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/fromto/sample.tmp"
    it 'Test string without destination', ->
        csv()
        .from(fs.readFileSync( "#{__dirname}/fromto/sample.in" ).toString())
        .on 'data', (data, index) ->
            index.should.be.below 2
            if index is 0
                data[0].should.eql '20322051544'
            else if index is 1
                data[0].should.eql '28392898392'
        .on 'end', (count) ->
            count.should.eql 2
    it 'Test string to stream', ->
        csv()
        .from(fs.readFileSync( "#{__dirname}/fromto/string_to_stream.in" ).toString())
        .toPath( "#{__dirname}/fromto/string_to_stream.tmp" )
        .on 'data', (data, index) ->
            index.should.be.below 2
            if index is 0
                data[0].should.eql '20322051544'
            else if index is 1
                data[0].should.eql '28392898392'
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync( "#{__dirname}/fromto/string_to_stream.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/fromto/string_to_stream.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/fromto/string_to_stream.tmp"
    it 'Test array to stream', ->
        # note: destination line breaks is windows styled because we can't guess it
        data = [
            ["20322051544","1979.0","8.8017226E7","ABC","45","2000-01-01"]
            ["28392898392","1974.0","8.8392926E7","DEF","23","2050-11-27"]
        ]
        csv()
        .from(data)
        .toPath( "#{__dirname}/fromto/array_to_stream.tmp" )
        .on 'data', (data, index) ->
            index.should.be.below 2
            if index is 0
                data[0].should.eql '20322051544'
            else if index is 1
                data[0].should.eql '28392898392'
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync( "#{__dirname}/fromto/array_to_stream.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/fromto/array_to_stream.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/fromto/array_to_stream.tmp"
    it 'Test null', ->
        # note: destination line breaks is windows styled because we can't guess it
        data = [
            ["20322051544",null,"8.8017226E7","ABC","45","2000-01-01"]
            ["28392898392","1974.0","8.8392926E7","DEF","23",null]
        ]
        csv()
        .from(data)
        .transform( (data) ->
            data[0] = null
            data[3] = null
            data
        )
        .toPath( "#{__dirname}/fromto/null.tmp" )
        .on 'data', (data, index) ->
            index.should.be.below 2
            should.not.exist data[0]
            should.not.exist data[3]
            if index is 0
                should.not.exist data[1]
            else if index is 1
                should.not.exist data[5]
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync( "#{__dirname}/fromto/null.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/fromto/null.tmp" ).toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/fromto/null.tmp"




