
# Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)

fs = require 'fs'
should = require 'should'
csv = require '..'

describe 'write', ->
    it 'Test write array', ->
        count = 0;
        test = csv()
        .toPath( "#{__dirname}/write/write_array.tmp" )
        .on 'data', (data, index) ->
            data.should.be.an.instanceof Array
            count.should.eql index
            count++
        .on 'end', ->
            count.should.eql 1000
            expect = fs.readFileSync( "#{__dirname}/write/write.out" ).toString()
            result = fs.readFileSync( "#{__dirname}/write/write_array.tmp" ).toString()
            result.should.eql expect
            fs.unlinkSync "#{__dirname}/write/write_array.tmp"
        for i in [0...1000]
            test.write ["Test #{i}", i, '"']
        test.end()
    it 'Test write object with column options', ->
        count = 0
        test = csv()
        .toPath( "#{__dirname}/write/write_object.tmp", columns: ['name','value','escape'] )
        .on 'data', (data, index) ->
            data.should.be.a 'object'
            data.should.not.be.an.instanceof Array
            count.should.eql index
            count++
        .on 'end', ->
            count.should.eql 1000
            expect = fs.readFileSync( "#{__dirname}/write/write.out").toString()
            result = fs.readFileSync( "#{__dirname}/write/write_object.tmp").toString()
            result.should.eql expect
            fs.unlinkSync "#{__dirname}/write/write_object.tmp"
        for i in [0...1000]
            test.write {name: "Test #{i}", value:i, escape: '"', ovni: "ET #{i}"}
        test.end()
    it 'Test write string', ->
        count = 0
        test = csv()
        .toPath( "#{__dirname}/write/write_string.tmp" )
        .on 'data', (data, index) ->
            data.should.be.an.instanceof Array
            count.should.eql index
            count++
        .on 'end', ->
            count.should.eql 1000
            expect = fs.readFileSync("#{__dirname}/write/write.out").toString()
            result = fs.readFileSync("#{__dirname}/write/write_string.tmp").toString()
            result.should.eql expect
            fs.unlinkSync "#{__dirname}/write/write_string.tmp"
        buffer = ''
        for i in [0...1000]
            buffer += ''.concat "Test #{i}", ',', i, ',', '""""', "\r"
            if buffer.length > 250
                test.write buffer.substr 0, 250
                buffer = buffer.substr 250
        test.write buffer
        test.end()
    it 'Test write string with preserve', ->
        count = 0
        test = csv()
        .toPath( "#{__dirname}/write/string_preserve.tmp" )
        .transform (data, index) ->
            if index is 0
                test.write '--------------------\n', true
            test.write data
            test.write '\n--------------------', true
            data.should.be.an.instanceof Array
            count.should.eql index
            count++
            null
        .on 'end', ->
            expect = fs.readFileSync("#{__dirname}/write/string_preserve.out").toString()
            result = fs.readFileSync("#{__dirname}/write/string_preserve.tmp").toString()
            result.should.eql expect
            fs.unlinkSync "#{__dirname}/write/string_preserve.tmp"
        test.write '# This line should not be parsed', true
        test.write '\n', true
        buffer = ''
        for i in [0...2]
            buffer += ''.concat "Test #{i}", ',', i, ',', '""""', "\n"
            if buffer.length > 250
                test.write buffer.substr 0, 250
                buffer = buffer.substr 250
        test.write buffer
        test.write '\n', true
        test.write '# This one as well', true
        test.end()



