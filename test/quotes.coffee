
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
assert = require 'assert'
csv = require '..'

module.exports =
    'Test regular quotes':  ->
        csv()
        .fromPath( "#{__dirname}/quotes/regular.in" )
        .toPath( "#{__dirname}/quotes/regular.tmp" )
        .on 'end', ->
            assert.equal(
                fs.readFileSync("#{__dirname}/quotes/regular.out").toString(),
                fs.readFileSync("#{__dirname}/quotes/regular.tmp").toString()
            )
            fs.unlink "#{__dirname}/quotes/regular.tmp"
    'Test quotes with delimiter':  ->
        csv()
        .fromPath("#{__dirname}/quotes/delimiter.in")
        .toPath("#{__dirname}/quotes/delimiter.tmp")
        .on 'end', ->
            assert.equal(
                fs.readFileSync("#{__dirname}/quotes/delimiter.out").toString(),
                fs.readFileSync("#{__dirname}/quotes/delimiter.tmp").toString()
            )
            fs.unlink "#{__dirname}/quotes/delimiter.tmp"
    'Test quotes inside field':  ->
        csv()
        .fromPath( "#{__dirname}/quotes/in_field.in" )
        .toPath( "#{__dirname}/quotes/in_field.tmp" )
        .on 'end', ->
            assert.equal(
                fs.readFileSync("#{__dirname}/quotes/in_field.out").toString(),
                fs.readFileSync("#{__dirname}/quotes/in_field.tmp").toString()
            )
            fs.unlink "#{__dirname}/quotes/in_field.tmp"
    'Test empty value':  ->
        csv()
        .fromPath "#{__dirname}/quotes/empty_value.in",
            quote: '"'
            escape: '"'
        .toPath("#{__dirname}/quotes/empty_value.tmp")
        .on 'end', ->
            assert.equal(
                fs.readFileSync("#{__dirname}/quotes/empty_value.out").toString(),
                fs.readFileSync("#{__dirname}/quotes/empty_value.tmp").toString()
            )
            fs.unlink "#{__dirname}/quotes/empty_value.tmp"
    'Test quoted quote':  ->
        csv()
        .fromPath "#{__dirname}/quotes/quoted.in",
            quote: '"',
            escape: '"',
        .toPath("#{__dirname}/quotes/quoted.tmp")
        .on 'data', (data,index) ->
            assert.strictEqual(5,data.length)
            if index is 0
                assert.strictEqual('"',data[1])
                assert.strictEqual('"ok"',data[4])
        .on 'end', ->
            assert.equal(
                fs.readFileSync("#{__dirname}/quotes/quoted.out").toString(),
                fs.readFileSync("#{__dirname}/quotes/quoted.tmp").toString()
            )
            fs.unlink "#{__dirname}/quotes/quoted.tmp"
    'Test quoted linebreak':  ->
        csv()
        .fromPath "#{__dirname}/quotes/linebreak.in",
            quote: '"',
            escape: '"'
        .toPath("#{__dirname}/quotes/linebreak.tmp")
        .on 'data', (data,index) ->
            assert.strictEqual(5,data.length)
        .on 'end', ->
            assert.equal(
                fs.readFileSync("#{__dirname}/quotes/linebreak.out").toString(),
                fs.readFileSync("#{__dirname}/quotes/linebreak.tmp").toString()
            )
            fs.unlink "#{__dirname}/quotes/linebreak.tmp"
    'Test unclosed quote': (next) ->
        n = 0
        csv()
        .fromPath "#{__dirname}/quotes/unclosed.in",
            quote: '"'
            escape: '"'
        .toPath( "#{__dirname}/quotes/unclosed.tmp" )
        .on 'end', -> 
            assert.ok false, 'end was raised'
        .on 'error', -> 
            ++n
        next -> # finish
            assert.equal 1, n, 'error was not raised'
            fs.unlink "#{__dirname}/quotes/unclosed.tmp"
    'Test invalid quotes': (next) ->
        n = 0
        csv()
        .on 'error', (e) ->
            assert.equal e.message.split(';')[0], 'Invalid closing quote'
            ++n
        .fromPath "#{__dirname}/quotes/invalid.in",
            quote: '"',
            escape: '"'
        .toPath( "#{__dirname}/quotes/invalid.tmp" )
        .on 'end', ->
            assert.ok false, 'end was raised'
        next -> # finish
            assert.equal 1, n, 'error was not raised'
            fs.unlink "#{__dirname}/quotes/invalid.tmp"
    'Test invalid quotes from string': (next) ->
        n = 0
        csv()
        .on 'error', (e) ->
            assert.equal e.message.split(';')[0], 'Invalid closing quote'
            ++n
        .from '"",1974,8.8392926E7,""t,""',
            quote: '"'
            escape: '"'
        .toPath( "#{__dirname}/quotes/invalidstring.tmp" )
        .on 'end', ->
            assert.ok false, 'end was raised'
        next -> # finish
            assert.equal 1, n
            fs.unlink "#{__dirname}/quotes/invalidstring.tmp"
