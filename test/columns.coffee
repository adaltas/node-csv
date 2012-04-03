
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'columns', ->
    describe 'in read option', ->
        it 'Test columns in true', (next) ->
            # Note: if true, columns are expected to be in first line
            csv()
            .fromPath( "#{__dirname}/columns/in_true.in", columns: true )
            .toPath( "#{__dirname}/columns/in_true.tmp" )
            .transform (data, index) ->
                data.should.be.a 'object'
                data.should.not.be.an.instanceof Array
                if index is 0
                    data.FIELD_1.should.eql '20322051544'
                else if index is 1
                    data.FIELD_4.should.eql 'DEF'
                data
            .on 'end', (count) ->
                count.should.eql 2
                expect = fs.readFileSync("#{__dirname}/columns/in_true.out").toString()
                result = fs.readFileSync("#{__dirname}/columns/in_true.tmp").toString()
                result.should.eql expect
                fs.unlink("#{__dirname}/columns/in_true.tmp")
                next()
        it 'Test columns in named', (next) ->
            # Note: if true, columns are expected to be in first line
            csv()
            .fromPath("#{__dirname}/columns/in_named.in", {
                columns: ["FIELD_1", "FIELD_2", "FIELD_3", "FIELD_4", "FIELD_5", "FIELD_6"]
            })
            .toPath("#{__dirname}/columns/in_named.tmp")
            .transform (data, index) ->
                data.should.be.a 'object'
                data.should.not.be.an.instanceof Array
                if index is 0
                    data.FIELD_1.should.eql '20322051544'
                else if index is 1
                    data.FIELD_4.should.eql 'DEF'
                data
            .on 'data',(data, index) ->
                data.should.be.a 'object'
                data.should.not.be.an.instanceof Array
            .on 'end',(count) ->
                count.should.eql 2
                expect = fs.readFileSync("#{__dirname}/columns/in_named.out").toString()
                result = fs.readFileSync("#{__dirname}/columns/in_named.tmp").toString()
                result.should.eql expect
                fs.unlink "#{__dirname}/columns/in_named.tmp"
                next()
    describe 'in write option', ->
        it 'should be the same length', (next) ->
            # Since there is not columns set in input options, we just expect
            # the output stream to contains 2 fields
            csv()
            .fromPath("#{__dirname}/columns/out_no_transform.in")
            .toPath("#{__dirname}/columns/out_no_transform.tmp",
                columns: ["FIELD_1", "FIELD_2"]
            )
            .on 'data', (data, index) ->
                data.should.be.an.instanceof Array
            .on 'end', (count) ->
                count.should.eql 2
                expect = fs.readFileSync("#{__dirname}/columns/out_no_transform.out").toString()
                result = fs.readFileSync("#{__dirname}/columns/out_no_transform.tmp").toString()
                result.should.eql expect
                fs.unlink "#{__dirname}/columns/out_named.tmp"
                next()
        it 'should filter from a transformed object', (next) ->
            # We are no returning an object
            csv()
            .fromPath("#{__dirname}/columns/out_named.in")
            .toPath("#{__dirname}/columns/out_named.tmp",
                columns: ["FIELD_1", "FIELD_2"]
            )
            .transform (data, index) ->
                data.should.be.an.instanceof Array
                {FIELD_2: data[3], zombie: data[1], FIELD_1: data[4]}
            .on 'data', (data, index) ->
                data.should.be.a 'object'
                data.should.not.be.an.instanceof Array
            .on 'end', (count) ->
                count.should.eql 2
                expect = fs.readFileSync("#{__dirname}/columns/out_named.out").toString()
                result = fs.readFileSync("#{__dirname}/columns/out_named.tmp").toString()
                result.should.eql expect
                fs.unlink "#{__dirname}/columns/out_named.tmp"
                next()





