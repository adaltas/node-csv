
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'API write', ->
  
  it 'arrays', (next) ->
    count = 0
    data = ''
    stringifier = stringify eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      record.should.be.an.instanceof Array
      count.should.eql index
      count++
    stringifier.on 'finish', ->
      count.should.eql 10
      data.should.eql """
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
      stringifier.write ["Test #{i}", i, '"']
    stringifier.end()
  
  it 'objects with column options', (next) ->
    count = 0
    data = ''
    stringifier = stringify(columns: ['name','value','escape'], eof: false)
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      record.should.be.an.Object
      record.should.not.be.an.instanceOf Array
      count.should.eql index
      count++
    stringifier.on 'finish', ->
      count.should.eql 10
      data.should.eql """
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
      stringifier.write {name: "Test #{i}", value:i, escape: '"', ovni: "ET #{i}"}
    stringifier.end()
  
  it 'throw error if not writable', (next) ->
    stringifier = stringify()
    stringifier.on 'error', (err) ->
      err.message.should.eql 'write after end'
      next()
    stringifier.write ['abc','123']
    stringifier.end()
    stringifier.write ['def', '456']

  it 'accepts full write API', (next) ->
    stringifier = stringify()
    stringifier.on 'finish', ->
        next()
    stringifier.write ['abc','123'], 'utf8' , (e,d) ->
        stringifier.end()
