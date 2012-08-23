
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'buffer', ->
    it 'Buffer smaller than in', (next) ->
        csv()
        .from.path "#{__dirname}/buffer/smaller.in",
            bufferSize: 1024
        .to.path("#{__dirname}/buffer/smaller.tmp")
        .transform (data) ->
            data.should.be.a 'object'
            data
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/buffer/smaller.out").toString()
            result = fs.readFileSync("#{__dirname}/buffer/smaller.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/buffer/smaller.tmp", next
    it 'Buffer same as in', (next) ->
        csv()
        .from.path "#{__dirname}/buffer/same.in",
            bufferSize: 1024
        .to.path("#{__dirname}/buffer/same.tmp")
        .transform (data) ->
            data.should.be.a 'object'
            data
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/buffer/same.out").toString()
            result = fs.readFileSync("#{__dirname}/buffer/same.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/buffer/same.tmp", next
