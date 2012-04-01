
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'buffer', ->
    it 'Buffer smaller than in', ->
        csv()
        .fromPath("#{__dirname}/buffer/smaller.in",
            bufferSize: 1024
        )
        .toPath("#{__dirname}/buffer/smaller.tmp")
        .transform (data) ->
            data.should.be.a 'object'
            data
        .on('end', ->
            expect = fs.readFileSync("#{__dirname}/buffer/smaller.out").toString()
            result = fs.readFileSync("#{__dirname}/buffer/smaller.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/buffer/smaller.tmp"
        )
    it 'Buffer same as in', ->
        csv()
        .fromPath("#{__dirname}/buffer/same.in",
            bufferSize: 1024
        )
        .toPath("#{__dirname}/buffer/same.tmp")
        .transform (data) ->
            data.should.be.a 'object'
            data
        .on('end', ->
            expect = fs.readFileSync("#{__dirname}/buffer/same.out").toString()
            result = fs.readFileSync("#{__dirname}/buffer/same.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/buffer/same.tmp"
        )
