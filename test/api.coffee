
fs = require 'fs'
generate = require 'csv-generate'
stringify = require '../src'

describe 'API', ->

  it '0 arg', (next) ->
    data = ''
    stringifier = stringify()
    stringifier.on 'readable', ->
      data += d while d = stringifier.read()
    stringifier.on 'err', (err) ->
      next err
    stringifier.on 'finish', ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2\n'
      next()
    stringifier.write ['field_1','field_2']
    stringifier.write ['value 1','value 2']
    stringifier.end()

  it '1 arg: option; write and data using the stream API', (next) ->
    data = ''
    generator = generate length: 2, objectMode: true, seed: 1, columns: 2
    stringifier = stringify eof: false
    stringifier.on 'readable', ->
      data += d while d = stringifier.read()
    generator.on 'error', next
    generator.on 'end', (err) ->
      stringifier.end()
    generator.on 'readable', ->
      stringifier.write row while row = generator.read()
    stringifier.on 'finish', ->
      data.should.eql """
      OMH,ONKCHhJmjadoA
      D,GeACHiN
      """
      next()

  it '1 arg: data and pipe result', (next) ->
    data = ''
    stringifier = stringify [
      ['field_1','field_2'], ['value 1','value 2']
    ]
    stringifier.on 'readable', ->
      data += d while d = stringifier.read()
    stringifier.on 'finish', ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2\n'
      next()

  it '2 args: data, option and pipe result', (next) ->
    data = ''
    stringifier = stringify [
      ['field_1','field_2'], ['value 1','value 2']
    ], eof: false
    stringifier.on 'readable', ->
      data += d while d = stringifier.read()
    stringifier.on 'finish', ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2'
      next()

  it '2 args: data, callback', (next) ->
    data = ''
    stringifier = stringify [
      ['field_1','field_2'], ['value 1','value 2']
    ], (err, data) ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2\n'
      next()

  it '2 args: options, callback', (next) ->
    data = ''
    stringifier = stringify eof: false, (err, data) ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2'
      next()
    stringifier.write ['field_1','field_2']
    stringifier.write ['value 1','value 2']
    stringifier.end()

  it '3 args: data, options, callback', (next) ->
    data = ''
    stringifier = stringify [
      ['field_1','field_2'], ['value 1','value 2']
    ], eof: false, (err, data) ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2'
      next()
