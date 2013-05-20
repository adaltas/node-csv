
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'write', ->
  
  it 'Test write array', (next) ->
    count = 0;
    test = csv()
    .on 'record', (record, index) ->
      record.should.be.an.instanceof Array
      count.should.eql index
      count++
    .on 'end', ->
      count.should.eql 10
    .to.string (result) ->
      result.should.eql """
      Test 0,0,\"\"\"\"
      Test 1,1,\"\"\"\"
      Test 2,2,\"\"\"\"
      Test 3,3,\"\"\"\"
      Test 4,4,\"\"\"\"
      Test 5,5,\"\"\"\"
      Test 6,6,\"\"\"\"
      Test 7,7,\"\"\"\"
      Test 8,8,\"\"\"\"
      Test 9,9,\"\"\"\"
      """
      next()
    for i in [0...10]
      test.write ["Test #{i}", i, '"']
    test.end()
  
  it 'Test write object with column options', (next) ->
    count = 0
    test = csv()
    .on 'record', (record, index) ->
      record.should.be.a 'object'
      record.should.not.be.an.instanceof Array
      count.should.eql index
      count++
    .on 'end', ->
      count.should.eql 10
    .to.string( (result) ->
      result.should.eql """
      Test 0,0,\"\"\"\"
      Test 1,1,\"\"\"\"
      Test 2,2,\"\"\"\"
      Test 3,3,\"\"\"\"
      Test 4,4,\"\"\"\"
      Test 5,5,\"\"\"\"
      Test 6,6,\"\"\"\"
      Test 7,7,\"\"\"\"
      Test 8,8,\"\"\"\"
      Test 9,9,\"\"\"\"
      """
      next()
    , columns: ['name','value','escape'])
    for i in [0...10]
      test.write {name: "Test #{i}", value:i, escape: '"', ovni: "ET #{i}"}
    test.end()
  
  it 'Test write string', (next) ->
    count = 0
    test = csv()
    .on 'record', (record, index) ->
      record.should.be.an.instanceof Array
      count.should.eql index
      count++
    .on 'end', ->
      count.should.eql 10
    .to.string (result) ->
      result.should.eql """
      Test 0,0,\"\"\"\"
      Test 1,1,\"\"\"\"
      Test 2,2,\"\"\"\"
      Test 3,3,\"\"\"\"
      Test 4,4,\"\"\"\"
      Test 5,5,\"\"\"\"
      Test 6,6,\"\"\"\"
      Test 7,7,\"\"\"\"
      Test 8,8,\"\"\"\"
      Test 9,9,\"\"\"\"
      """
      next()
    buffer = ''
    for i in [0...10]
      buffer += ''.concat "Test #{i}", ',', i, ',', '""""', "\n"
      if buffer.length > 250
        test.write buffer.substr 0, 250
        buffer = buffer.substr 250
    test.write buffer
    test.end()
  
  it 'Test write string should be preserve', (next) ->
    count = 0
    test = csv()
    .transform (record, index) ->
      if index is 0
        test.write '--------------------\n', true
      test.write record
      test.write '\n--------------------', true
      record.should.be.an.instanceof Array
      count.should.eql index
      count++
      null
    .to.string (result) ->
      result.should.eql """
      # This line should not be parsed
      --------------------
      Test 0,0,\"\"\"\"
      --------------------
      Test 1,1,\"\"\"\"
      --------------------
      # This one as well
      """
      next()
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
    .to.path( '/dev/null' )
    .transform (record, index) ->
      count++
    .on 'close', ->
      count.should.eql 1000
      next()
    for i in [0...1000]
      test.write ['Test '+i, i, '"']
    test.end()
  
  it 'should emit header even without a source', (next) ->
    test = csv()
    .on 'end', (count) ->
      count.should.eql 2
    .to.string( (result) ->
      result.should.eql """
      col1,col2
      foo1,goo1
      foo2,goo2
      """
      next()
    , columns: [ 'col1', 'col2' ], header: true, rowDelimiter: 'unix')
    test.write col1: 'foo1', col2: 'goo1'
    test.write col1: 'foo2', col2: 'goo2'
    test.end()
  
  it 'throw error if not writable', (next) ->
    test = csv()
    test.on 'error', (err) ->
      err.message.should.eql 'CSV no longer writable'
      next()
    test.write 'abc,123'
    test.end()
    test.write 'def,456'




