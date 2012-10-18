
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'write', ->
  
  it 'Test write array', (next) ->
    count = 0;
    test = csv()
    .to.path( "#{__dirname}/write/write_array.tmp" )
    .on 'record', (record, index) ->
      record.should.be.an.instanceof Array
      count.should.eql index
      count++
    .on 'close', ->
      count.should.eql 1000
      expect = fs.readFileSync "#{__dirname}/write/write.out"
      result = fs.readFileSync "#{__dirname}/write/write_array.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/write/write_array.tmp", next
    for i in [0...1000]
      test.write ["Test #{i}", i, '"']
    test.end()
  
  it 'Test write object with column options', (next) ->
    count = 0
    test = csv()
    .to.path( "#{__dirname}/write/write_object.tmp", columns: ['name','value','escape'] )
    .on 'record', (record, index) ->
      record.should.be.a 'object'
      record.should.not.be.an.instanceof Array
      count.should.eql index
      count++
    .on 'close', ->
      count.should.eql 1000
      expect = fs.readFileSync "#{__dirname}/write/write.out"
      result = fs.readFileSync "#{__dirname}/write/write_object.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/write/write_object.tmp", next
    for i in [0...1000]
      test.write {name: "Test #{i}", value:i, escape: '"', ovni: "ET #{i}"}
    test.end()
  
  it 'Test write string', (next) ->
    count = 0
    test = csv()
    .to.path( "#{__dirname}/write/write_string.tmp" )
    .on 'record', (record, index) ->
      record.should.be.an.instanceof Array
      count.should.eql index
      count++
    .on 'close', ->
      count.should.eql 1000
      expect = fs.readFileSync "#{__dirname}/write/write.out"
      result = fs.readFileSync "#{__dirname}/write/write_string.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/write/write_string.tmp", next
    buffer = ''
    for i in [0...1000]
      buffer += ''.concat "Test #{i}", ',', i, ',', '""""', "\n"
      if buffer.length > 250
        test.write buffer.substr 0, 250
        buffer = buffer.substr 250
    test.write buffer
    test.end()
  
  it 'Test write string with preserve', (next) ->
    count = 0
    test = csv()
    .to.path( "#{__dirname}/write/string_preserve.tmp" )
    .transform (record, index) ->
      if index is 0
        test.write '--------------------\n', true
      test.write record
      test.write '\n--------------------', true
      record.should.be.an.instanceof Array
      count.should.eql index
      count++
      null
    .on 'close', ->
      expect = fs.readFileSync "#{__dirname}/write/string_preserve.out"
      result = fs.readFileSync "#{__dirname}/write/string_preserve.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/write/string_preserve.tmp", next
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
  
  it 'should transform record provided by write as an array', (next) ->
    # Fix bug in which transform callback was called by flush and not write
    count = 0
    test = csv()
    .to.path( "#{__dirname}/write/write_array.tmp" )
    .transform (record, index) ->
      count++
    .on 'close', ->
      count.should.eql 1000
      fs.unlink "#{__dirname}/write/write_array.tmp", next
    for i in [0...1000]
      test.write ['Test '+i, i, '"']
    test.end()
  
  it 'should emit header even without a source', (next) ->
    test = csv()
    .to.path "#{__dirname}/write/write_sourceless.tmp", 
      columns: [ 'col1', 'col2' ], 
      header: true, 
      lineBreaks: 'unix'
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/write/write_sourceless.out"
      result = fs.readFileSync "#{__dirname}/write/write_sourceless.tmp"
      result.toString().should.eql expect.toString()
      fs.unlink "#{__dirname}/write/write_sourceless.tmp", next
    test.write col1: 'foo1', col2: 'goo1'
    test.write col1: 'foo2', col2: 'goo2'
    test.end()




