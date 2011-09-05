
# Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

fs = require('fs')
assert = require('assert')
csv = require('csv')

module.exports =
    'Buffer smaller than in': ->
        csv()
        .fromPath("#{__dirname}/buffer/smaller.in",
            bufferSize: 1024
        )
        .toPath("#{__dirname}/buffer/smaller.tmp")
        .transform( (data) ->
            assert.ok data instanceof Object
            data
        )
        .on('end', ->
            assert.equal(
                fs.readFileSync("#{__dirname}/buffer/smaller.out").toString(),
                fs.readFileSync("#{__dirname}/buffer/smaller.tmp").toString()
            )
            fs.unlink "#{__dirname}/buffer/smaller.tmp"
        )
    'Buffer same as in': ->
        csv()
        .fromPath("#{__dirname}/buffer/same.in",
            bufferSize: 1024
        )
        .toPath("#{__dirname}/buffer/same.tmp")
        .transform( (data) ->
            assert.ok data instanceof Object
            data
        )
        .on('end', ->
            assert.equal(
                fs.readFileSync("#{__dirname}/buffer/same.out").toString(),
                fs.readFileSync("#{__dirname}/buffer/same.tmp").toString()
            )
            fs.unlink "#{__dirname}/buffer/same.tmp"
        )
