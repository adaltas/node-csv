
fs = require 'fs'
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'write', ->
  
  it 'should read numbers in property if auto_parse is specified', (next) ->
    data = []
    parser = parse({ auto_parse: true })
    parser.write """
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    28392898392,1974,8.8392926e7,DEF,23,2050-11-27
    """
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'error', (err) ->
      next err
    parser.on 'finish', ->
      data.should.eql [
        [20322051544, 1979, 8.8017226e7, 'ABC', 45, '2000-01-01']
        [28392898392, 1974, 8.8392926e7, 'DEF', 23, '2050-11-27']
      ]

      (typeof data[0][0]).should.eql 'number'
      (typeof data[0][1]).should.eql 'number'
      (typeof data[0][4]).should.eql 'number'
      (typeof data[1][0]).should.eql 'number'
      (typeof data[1][1]).should.eql 'number'
      (typeof data[1][4]).should.eql 'number'
      next()
    parser.end()

  it 'string randomly splited', (next) ->
    data = []
    parser = parse()
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'Test 0', '0', '"' ]
        [ 'Test 1', '1', '"' ]
        [ 'Test 2', '2', '"' ]
        [ 'Test 3', '3', '"' ]
        [ 'Test 4', '4', '"' ]
        [ 'Test 5', '5', '"' ]
        [ 'Test 6', '6', '"' ]
        [ 'Test 7', '7', '"' ]
        [ 'Test 8', '8', '"' ]
        [ 'Test 9', '9', '"' ]
      ]
      next()
    buffer = ''
    for i in [0...10]
      buffer += ''.concat "Test #{i}", ',', i, ',', '""""', "\n"
      if buffer.length > 250
        parser.write buffer.substr 0, 250
        buffer = buffer.substr 250
    parser.write buffer
    parser.end()
  
  it.skip 'a new line character', (next) ->
    # TODO, This is a bug that I dont have time to fix
    data = []
    parser = parse()
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'abc', '123' ]
        [ 'def', '456' ]
      ]
      next()
    parser.write 'abc,123'
    parser.write '\n'
    parser.write 'def,456'
    parser.end()
  
  it 'throw error if not writable', (next) ->
    parser = parse()
    parser.on 'error', (err) ->
      err.message.should.eql 'write after end'
      next()
    parser.write 'abc,123'
    parser.end()
    parser.write 'def,456'
  