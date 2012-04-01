
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'quotes', ->
    it 'Test regular quotes',  ->
        csv()
        .fromPath( "#{__dirname}/quotes/regular.in" )
        .toPath( "#{__dirname}/quotes/regular.tmp" )
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/regular.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/regular.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/regular.tmp"
    it 'Test quotes with delimiter',  ->
        csv()
        .fromPath("#{__dirname}/quotes/delimiter.in")
        .toPath("#{__dirname}/quotes/delimiter.tmp")
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/delimiter.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/delimiter.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/delimiter.tmp"
    it 'Test quotes inside field',  ->
        csv()
        .fromPath( "#{__dirname}/quotes/in_field.in" )
        .toPath( "#{__dirname}/quotes/in_field.tmp" )
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/in_field.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/in_field.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/in_field.tmp"
    it 'Test empty value',  ->
        csv()
        .fromPath "#{__dirname}/quotes/empty_value.in",
            quote: '"'
            escape: '"'
        .toPath("#{__dirname}/quotes/empty_value.tmp")
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/empty_value.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/empty_value.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/empty_value.tmp"
    it 'Test quoted quote',  ->
        csv()
        .fromPath "#{__dirname}/quotes/quoted.in",
            quote: '"',
            escape: '"',
        .toPath("#{__dirname}/quotes/quoted.tmp")
        .on 'data', (data,index) ->
            data.length.should.eql 5
            if index is 0
                data[1].should.eql '"'
                data[4].should.eql '"ok"'
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/quoted.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/quoted.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/quoted.tmp"
    it 'Test quoted linebreak',  ->
        csv()
        .fromPath "#{__dirname}/quotes/linebreak.in",
            quote: '"',
            escape: '"'
        .toPath("#{__dirname}/quotes/linebreak.tmp")
        .on 'data', (data,index) ->
            data.length.should.eql 5
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/linebreak.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/linebreak.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/linebreak.tmp"
    it 'Test unclosed quote', (next) ->
        csv()
        .fromPath "#{__dirname}/quotes/unclosed.in",
            quote: '"'
            escape: '"'
        .toPath( "#{__dirname}/quotes/unclosed.tmp" )
        .on 'end', -> 
            false.should.be.ok
        .on 'error', (e) ->
            e.message.should.eql 'Quoted field not terminated'
            fs.unlink "#{__dirname}/quotes/unclosed.tmp"
            next()
    it 'Test invalid quotes', (next) ->
        csv()
        .fromPath "#{__dirname}/quotes/invalid.in",
            quote: '"',
            escape: '"'
        .toPath( "#{__dirname}/quotes/invalid.tmp" )
        .on 'end', ->
            false.should.be.ok
        .on 'error', (e) ->
            e.message.should.match /Invalid closing quote/
            fs.unlink "#{__dirname}/quotes/invalid.tmp"
            next()
    it 'Test invalid quotes from string', (next) ->
        csv()
        .from '"",1974,8.8392926E7,""t,""',
            quote: '"'
            escape: '"'
        .toPath( "#{__dirname}/quotes/invalidstring.tmp" )
        .on 'end', ->
            false.should.be.ok
        .on 'error', (e) ->
            e.message.should.match /Invalid closing quote/
            fs.unlink "#{__dirname}/quotes/invalidstring.tmp"
            next()
