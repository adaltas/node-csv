
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'transform', ->
    it 'Test reorder fields', (next) ->
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
            fs.unlink "#{__dirname}/transform/reorder.tmp", next
    it 'should skip all lines where transform return undefined', (next) ->
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
            fs.unlink "#{__dirname}/transform/undefined.tmp", next
    it 'should skip all lines where transform return null', (next) ->
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
            fs.unlink "#{__dirname}/transform/null.tmp", next
    it 'Test return object', (next) ->
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
            fs.unlink "#{__dirname}/transform/object.tmp", next
    it 'should accept a returned string', (next) ->
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
            fs.unlink "#{__dirname}/transform/string.tmp", next
    it 'should accept a returned integer', (next) ->
        result = ''
        test = csv()
        .transform (data, index) ->
            data[1]
        .on 'data', (data) ->
            result += data
        .on 'end', ->
            result.should.eql '210'
            next()
        for i in [2..0]
            test.write ['Test '+i, i, '"']
        test.end()
    it 'should accept a returned array with different types', (next) ->
        # Test date, int and float
        csv()
        .fromPath("#{__dirname}/transform/types.in")
        .toPath("#{__dirname}/transform/types.tmp")
        .transform (data, index) ->
            data[3] = data[3].split('-')
            [parseInt(data[0]), parseFloat(data[1]), parseFloat(data[2]) ,Date.UTC(data[3][0], data[3][1], data[3][2]), !!data[4], !!data[5]]
        .on 'end', (count) ->
            count.should.eql 2
            expect = fs.readFileSync("#{__dirname}/transform/types.out").toString()
            result = fs.readFileSync("#{__dirname}/transform/types.tmp").toString()
            result.should.eql expect
            fs.unlink "#{__dirname}/transform/types.tmp", next
    it 'should catch error thrown in transform callback', (next) ->
        count = 0
        error = false
        test = csv()
        .toPath( "#{__dirname}/write/write_array.tmp" )
        .transform (data, index) ->
            throw new Error "Error at index #{index}" if index % 10 is 9
            data
        .on 'error', (e) ->
            error = true
            e.message.should.equal 'Error at index 9'
            # Test if readstream is destroyed on error
            # Give it some time in case transform keep being called even after the error
            setTimeout next, 100
        .on 'data', (data) ->
            data[1].should.be.below 9
        .on 'end', ->
            false.should.be.ok
            next()
        for i in [0...1000]
            test.write ['Test '+i, i, '"'] unless error






