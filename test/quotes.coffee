
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'quotes', ->
    it 'Test regular quotes',  ->
        csv()
        .from.path( "#{__dirname}/quotes/regular.in" )
        .to.path( "#{__dirname}/quotes/regular.tmp" )
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/regular.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/regular.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/regular.tmp"
    it 'should read quoted values containing delimiters and write around quote only the value containing delimiters',  ->
        csv()
        .from.path("#{__dirname}/quotes/delimiter.in")
        .to.path("#{__dirname}/quotes/delimiter.tmp")
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/delimiter.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/delimiter.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/delimiter.tmp"
    it 'Test quotes inside field',  ->
        csv()
        .from.path( "#{__dirname}/quotes/in_field.in" )
        .to.path( "#{__dirname}/quotes/in_field.tmp" )
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/in_field.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/in_field.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/in_field.tmp"
    it 'Test empty value',  ->
        csv()
        .from.path "#{__dirname}/quotes/empty_value.in",
            quote: '"'
            escape: '"'
        .to.path("#{__dirname}/quotes/empty_value.tmp")
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/empty_value.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/empty_value.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/empty_value.tmp"
    it 'should read values with quotes, escaped as double quotes, and write empty values as not quoted',  ->
        csv()
        .from.path "#{__dirname}/quotes/contains_quotes.in",
            quote: '"',
            escape: '"',
        .to.path("#{__dirname}/quotes/contains_quotes.tmp")
        .on 'data', (data,index) ->
            data.length.should.eql 5
            if index is 0
                data[1].should.eql '"'
                data[4].should.eql '"ok"'
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/contains_quotes.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/contains_quotes.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/contains_quotes.tmp"
    it 'should accept line breaks inside quotes',  ->
        csv()
        .from.path "#{__dirname}/quotes/linebreak.in",
            quote: '"',
            escape: '"'
        .to.path("#{__dirname}/quotes/linebreak.tmp")
        .on 'data', (data,index) ->
            data.length.should.eql 5
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/linebreak.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/linebreak.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/linebreak.tmp"
    it 'Test unclosed quote', (next) ->
        csv()
        .from.path "#{__dirname}/quotes/unclosed.in",
            quote: '"'
            escape: '"'
        .to.path( "#{__dirname}/quotes/unclosed.tmp" )
        .on 'end', -> 
            false.should.be.ok
        .on 'error', (e) ->
            e.message.should.eql 'Quoted field not terminated'
            fs.unlink "#{__dirname}/quotes/unclosed.tmp"
            next()
    it 'Test invalid quotes', (next) ->
        csv()
        .from.path "#{__dirname}/quotes/invalid.in",
            quote: '"',
            escape: '"'
        .to.path( "#{__dirname}/quotes/invalid.tmp" )
        .on 'end', ->
            false.should.be.ok
        .on 'error', (e) ->
            e.message.should.match /Invalid closing quote/
            fs.unlink "#{__dirname}/quotes/invalid.tmp"
            next()
    it 'Test invalid quotes from string', (next) ->
        csv()
        .from.string '"",1974,8.8392926E7,""t,""',
            quote: '"'
            escape: '"'
        .to.path( "#{__dirname}/quotes/invalidstring.tmp" )
        .on 'end', ->
            false.should.be.ok
        .on 'error', (e) ->
            e.message.should.match /Invalid closing quote/
            fs.unlink "#{__dirname}/quotes/invalidstring.tmp"
            next()
    it 'should quotes all fields', (next) ->
        csv()
        .from.path("#{__dirname}/quotes/quoted.in")
        .to.path( "#{__dirname}/quotes/quoted.tmp", quoted: true )
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/quotes/quoted.out").toString()
            result = fs.readFileSync("#{__dirname}/quotes/quoted.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/quotes/quoted.tmp"
            next()
        .on 'error', (e) ->
            false.should.be.ok

