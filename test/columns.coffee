
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'columns', ->
    describe 'in read option', ->
        it 'Test columns in true', (next) ->
            # Note: if true, columns are expected to be in first line
            csv()
            .from.path( "#{__dirname}/columns/in_true.in", columns: true )
            .to.path( "#{__dirname}/columns/in_true.tmp" )
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
                expect = fs.readFileSync "#{__dirname}/columns/in_true.out"
                result = fs.readFileSync "#{__dirname}/columns/in_true.tmp"
                result.should.eql expect
                fs.unlink("#{__dirname}/columns/in_true.tmp")
                next()
        it 'Test columns in named', (next) ->
            # Note: if true, columns are expected to be in first line
            csv()
            .from.path("#{__dirname}/columns/in_named.in", {
                columns: ["FIELD_1", "FIELD_2", "FIELD_3", "FIELD_4", "FIELD_5", "FIELD_6"]
            })
            .to.path("#{__dirname}/columns/in_named.tmp")
            .transform (data, index) ->
                data.should.be.a 'object'
                data.should.not.be.an.instanceof Array
                if index is 0
                    data.FIELD_1.should.eql '20322051544'
                else if index is 1
                    data.FIELD_4.should.eql 'DEF'
                data
            .on 'data', (data, index) ->
                data.should.be.a 'object'
                data.should.not.be.an.instanceof Array
            .on 'end', (count) ->
                count.should.eql 2
                expect = fs.readFileSync "#{__dirname}/columns/in_named.out"
                result = fs.readFileSync "#{__dirname}/columns/in_named.tmp"
                result.should.eql expect
                fs.unlink "#{__dirname}/columns/in_named.tmp"
                next()
    describe 'in write option', ->
        it 'should be the same length', (next) ->
            # Since there is not columns set in input options, we just expect
            # the output stream to contains 2 fields
            csv()
            .from.path("#{__dirname}/columns/out_no_transform.in")
            .to.path("#{__dirname}/columns/out_no_transform.tmp",
                columns: ["FIELD_1", "FIELD_2"]
            )
            .on 'data', (data, index) ->
                data.should.be.an.instanceof Array
            .on 'end', (count) ->
                count.should.eql 2
                expect = fs.readFileSync "#{__dirname}/columns/out_no_transform.out"
                result = fs.readFileSync "#{__dirname}/columns/out_no_transform.tmp"
                result.should.eql expect
                fs.unlink "#{__dirname}/columns/out_no_transform.tmp"
                next()
        it 'should filter from a transformed object', (next) ->
            # We are no returning an object
            csv()
            .from.path("#{__dirname}/columns/out_named.in")
            .to.path("#{__dirname}/columns/out_named.tmp",
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
                expect = fs.readFileSync "#{__dirname}/columns/out_named.out"
                result = fs.readFileSync "#{__dirname}/columns/out_named.tmp"
                result.should.eql expect
                fs.unlink "#{__dirname}/columns/out_named.tmp"
                next()
        it 'should emit new columns in output', (next) ->
            csv()
            .from.path("#{__dirname}/columns/out_new.in", columns: true)
            .to.path("#{__dirname}/columns/out_new.tmp", newColumns: true, header: true)
            .transform (data) ->
                data.should.be.an.a 'object'
                data.FIELD_7 = 'new_field'
                data
            .on 'end', (count) ->
                count.should.eql 2
                expect = fs.readFileSync "#{__dirname}/columns/out_new.out"
                result = fs.readFileSync "#{__dirname}/columns/out_new.tmp"
                result.should.eql expect
                fs.unlink "#{__dirname}/columns/out_new.tmp"
                next()




