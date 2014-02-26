
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'write', ->
  
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




