
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'transform', ->
    it 'Test reorder fields', ->
        count = 0
        csv()
        .fromPath("#{__dirname}/transform/reorder.in")
        .toPath("#{__dirname}/transform/reorder.tmp")
        .transform (data, index) ->
            count.should.eql index
            count++
            data.unshift data.pop()
            return data
        .on 'end', ->
            count.should.eql 2
            expect = fs.readFileSync("#{__dirname}/transform/reorder.out").toString()
            result = fs.readFileSync("#{__dirname}/transform/reorder.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/transform/reorder.tmp"
    it 'Test return undefined - skip all lines', ->
        count = 0
        csv()
        .fromPath("#{__dirname}/transform/undefined.in")
        .toPath("#{__dirname}/transform/undefined.tmp")
        .transform (data, index) ->
            count.should.eql index
            count++
            return
        .on 'end', ->
            count.should.eql 2
            expect = fs.readFileSync("#{__dirname}/transform/undefined.out").toString()
            result = fs.readFileSync("#{__dirname}/transform/undefined.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/transform/undefined.tmp"
    it 'Test return null - skip one of two lines', ->
        count = 0
        csv()
        .fromPath("#{__dirname}/transform/null.in")
        .toPath("#{__dirname}/transform/null.tmp")
        .transform (data, index) ->
            count.should.eql index
            count++
            if index % 2 then data else null
        .on 'end', ->
            count.should.eql 6
            expect = fs.readFileSync("#{__dirname}/transform/null.out").toString()
            result = fs.readFileSync("#{__dirname}/transform/null.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/transform/null.tmp"
    it 'Test return object', ->
        # we don't define columns
        # recieve and array and return an object
        # also see the columns test
        csv()
        .fromPath("#{__dirname}/transform/object.in")
        .toPath("#{__dirname}/transform/object.tmp")
        .transform (data, index) ->
            { field_1: data[4], field_2: data[3] }
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync("#{__dirname}/transform/object.out").toString()
            result = fs.readFileSync("#{__dirname}/transform/object.tmp").toString()
            result.should.eql expect
            fs.unlink("#{__dirname}/transform/object.tmp")
    it 'Test return string', ->
        csv()
        .fromPath("#{__dirname}/transform/string.in")
        .toPath("#{__dirname}/transform/string.tmp")
        .transform (data, index) ->
            ( if index > 0 then ',' else '') + data[4] + ":" + data[3]
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync("#{__dirname}/transform/string.out").toString()
            result = fs.readFileSync("#{__dirname}/transform/string.tmp").toString()
            result.should.eql expect
            fs.unlink("#{__dirname}/transform/string.tmp")
    it 'Test types', ->
        # Test date, int and float
        csv()
        .fromPath(__dirname+'/transform/types.in')
        .toPath("#{__dirname}/transform/types.tmp")
        .transform (data, index) ->
            data[3] = data[3].split('-')
            [parseInt(data[0]), parseFloat(data[1]), parseFloat(data[2]) ,Date.UTC(data[3][0], data[3][1], data[3][2]), !!data[4], !!data[5]]
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync("#{__dirname}/transform/types.out").toString()
            result = fs.readFileSync("#{__dirname}/transform/types.tmp").toString()
            result.should.eql expect
            fs.unlink("#{__dirname}/transform/types.tmp")



