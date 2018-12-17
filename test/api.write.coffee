
stringify = require '../src'

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

  it 'write invalid record null', (next) ->
    stringifier = stringify()
    stringifier.on 'error', (err) ->
      err.message.should.eql 'May not write null values to stream'
      next()
    stringifier.on 'end', ->
      next Error 'Oh no!'
    stringifier.write null, 'utf8' , (e,d) ->
      stringifier.end()

  it 'write invalid record true', (next) ->
    stringifier = stringify()
    stringifier.on 'error', (err) ->
      err.message.should.eql 'Invalid Record: expect an array or an object, got true'
      next()
    stringifier.on 'end', ->
      next Error 'Oh no!'
    stringifier.write true, 'utf8' , (e,d) ->
      stringifier.end()
  
  describe 'input', ->

    it 'array are immutable', (next) ->
      chunks = [['a', 'b'], ['c', 'd']]
      stringify chunks, (err) ->
        chunks.should.eql [['a', 'b'], ['c', 'd']] unless err
        next err
      
    it 'object (with columns are immutable', (next) ->
      chunks = [{a: 1, b: 2}, {a: 3, b: 4}]
      stringify chunks, columns: ['b'], (err, data) ->
        chunks.should.eql [{a: 1, b: 2}, {a: 3, b: 4}] unless err
        next err
      
    it 'object (without columns) are immutable', (next) ->
      chunks = [{a: 1, b: 2}, {a: 3, b: 4}]
      stringify chunks, (err, data) ->
        chunks.should.eql [{a: 1, b: 2}, {a: 3, b: 4}] unless err
        next err
