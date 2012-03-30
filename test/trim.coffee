
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
assert = require 'assert'
csv = require '..'

module.exports =
    'Test ignoring whitespace immediately following the delimiter': ->
        csv()
        .fromPath( "#{__dirname}/trim/ltrim.in", ltrim: true )
        .toPath( "#{__dirname}/trim/ltrim.tmp" )
        .transform( (data, index) -> data )
        .on 'end', (count) ->
            assert.strictEqual(3,count);
            assert.equal(
                fs.readFileSync( "#{__dirname}/trim/ltrim.out" ).toString(),
                fs.readFileSync( "#{__dirname}/trim/ltrim.tmp" ).toString()
            );
            fs.unlink "#{__dirname}/trim/ltrim.tmp"
    'Test rtrim - ignoring whitespace immediately preceding the delimiter': ->
        csv()
        .fromPath( "#{__dirname}/trim/rtrim.in", rtrim: true )
        .toPath( "#{__dirname}/trim/rtrim.tmp" )
        .transform( (data, index) -> data )
        .on 'end', (count) ->
            assert.strictEqual(3,count);
            assert.equal(
                fs.readFileSync( "#{__dirname}/trim/rtrim.out" ).toString(),
                fs.readFileSync( "#{__dirname}/trim/rtrim.tmp" ).toString()
            );
            fs.unlink "#{__dirname}/trim/rtrim.tmp"
    'Test trim - ignoring whitespace both immediately preceding and following the delimiter': ->
        csv()
        .fromPath( "#{__dirname}/trim/trim.in", trim: true )
        .toPath( "#{__dirname}/trim/trim.tmp" )
        .transform( (data, index) -> data )
        .on 'end', (count) ->
            assert.strictEqual 3, count
            assert.equal(
                fs.readFileSync( "#{__dirname}/trim/trim.out" ).toString(),
                fs.readFileSync( "#{__dirname}/trim/trim.tmp" ).toString()
            )
            fs.unlink "#{__dirname}/trim/trim.tmp"
    'Test no trim': ->
        csv()
        .fromPath( "#{__dirname}/trim/notrim.in" )
        .toPath( "#{__dirname}/trim/notrim.tmp" )
        .transform( (data, index) -> data )
        .on 'end', (count) ->
            assert.strictEqual 3, count
            assert.equal(
                fs.readFileSync( "#{__dirname}/trim/notrim.out" ).toString(),
                fs.readFileSync( "#{__dirname}/trim/notrim.tmp" ).toString()
            )
            fs.unlink "#{__dirname}/trim/notrim.tmp"

