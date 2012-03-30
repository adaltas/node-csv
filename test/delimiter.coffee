
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
assert = require 'assert'
csv = require '..'

module.exports = 
    'Test empty value': ->
        csv()
        .fromPath( "#{__dirname}/delimiter/empty_value.in" )
        .toPath( "#{__dirname}/delimiter/empty_value.tmp" )
        .transform (data, index) ->
            assert.strictEqual 5, data.length
            if index is 0
                assert.strictEqual '', data[1]
                assert.strictEqual '', data[4]
            else if index is 1
                assert.strictEqual '', data[0]
                assert.strictEqual '', data[3]
                assert.strictEqual '', data[4]
            data
        .on 'end', (count) ->
            assert.strictEqual 2, count
            assert.equal(
                fs.readFileSync( "#{__dirname}/delimiter/empty_value.out" ).toString(),
                fs.readFileSync( "#{__dirname}/delimiter/empty_value.tmp" ).toString()
            )
            fs.unlink "#{__dirname}/delimiter/empty_value.tmp"
    'Test tabs to comma': ->
        csv()
        .fromPath( "#{__dirname}/delimiter/tab_to_coma.in", delimiter: '\t' )
        .toPath( "#{__dirname}/delimiter/tab_to_coma.tmp", delimiter: ',' )
        .transform (data,index) ->
            assert.strictEqual 5, data.length
            if index is 0
                assert.strictEqual '', data[1]
                assert.strictEqual '', data[4]
            else if index is 1
                assert.strictEqual '', data[0]
                assert.strictEqual '', data[3]
                assert.strictEqual '', data[4]
            data
        .on 'end', (count) ->
            assert.strictEqual 2, count
            assert.equal(
                fs.readFileSync( "#{__dirname}/delimiter/tab_to_coma.out" ).toString(),
                fs.readFileSync( "#{__dirname}/delimiter/tab_to_coma.tmp" ).toString()
            )
            fs.unlink "#{__dirname}/delimiter/tab_to_coma.tmp"

