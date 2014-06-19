
fs = require 'fs'
should = require 'should'
generate = require 'csv-generate'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'API', ->

  it '0 arg', (next) ->
    data = ''
    stringifier = stringify()
    stringifier.on 'readable', ->
      while d = stringifier.read()
        data += d
    stringifier.on 'err', (err) ->
      next err
    stringifier.on 'finish', ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2\n'
      next()
    stringifier.write ['field_1','field_2']
    stringifier.write ['value 1','value 2']
    stringifier.end()

  it '1 arg: write data, pass option and pipe result', (next) ->
    data = ''
    generator = generate length: 2, objectMode: true, seed: 1, columns: 2
    stringifier = stringify eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    generator.on 'error', next
    generator.on 'end', (err) ->
      stringifier.end()
    generator.on 'readable', ->
      while(row = generator.read())
        stringifier.write row
    stringifier.on 'finish', ->
      data.should.eql """
      OMH,ONKCHhJmjadoA
      D,GeACHiN
      """
      next()

  it '1 arg: pass data and pipe result', (next) ->
    data = ''
    stringifier = stringify [
      ['field_1','field_2'], ['value 1','value 2']
    ]
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'finish', ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2\n'
      next()

  it '2 args: pass data, pass option and pipe result', (next) ->
    data = ''
    stringifier = stringify [
      ['field_1','field_2'], ['value 1','value 2']
    ], eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'finish', ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2'
      next()

  it '2 args: pass data, pass callback', (next) ->
    data = ''
    stringifier = stringify [
      ['field_1','field_2'], ['value 1','value 2']
    ], (err, data) ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2\n'
      next()

  it '2 args: pass options, pass callback', (next) ->
    data = ''
    stringifier = stringify eof: false, (err, data) ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2'
      next()
    stringifier.write ['field_1','field_2']
    stringifier.write ['value 1','value 2']
    stringifier.end()

  it '3 args: pass data, pass options, pass callback', (next) ->
    data = ''
    stringifier = stringify [
      ['field_1','field_2'], ['value 1','value 2']
    ], eof: false, (err, data) ->
      data.should.eql 'field_1,field_2\nvalue 1,value 2'
      next()
