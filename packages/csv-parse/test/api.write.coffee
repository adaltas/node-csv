
import { parse } from '../lib/index.js'

describe 'API write', ->

  it 'string randomly splited', (next) ->
    data = []
    parser = parse()
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'end', ->
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
  
  it 'throw error if not writable', (next) ->
    parser = parse()
    parser.on 'error', (err) ->
      err.message.should.eql 'write after end'
      next()
    parser.write 'abc,123'
    parser.end()
    parser.write 'def,456'
  
  it 'support multi-bytes utf8 encoded characters', (next) ->
    parser = parse (err, data) ->
      data[0][0].should.eql '€'
      next()
    parser.write Buffer.from [0xE2]
    parser.write Buffer.from [0x82]
    parser.write Buffer.from [0xAC]
    parser.end()
