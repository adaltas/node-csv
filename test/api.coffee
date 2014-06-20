
should = require 'should'
generate = require 'csv-generate'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'api', ->

  it 'exports Parser class', ->
    parse.Parser.should.be.a.Function

  it '0 arg', (next) ->
    data = []
    parser = parse()
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'err', (err) ->
      next err
    parser.on 'finish', ->
      data.should.eql [ [ 'field_1', 'field_2' ], [ 'value 1', 'value 2' ] ]
      next()
    parser.write 'field_1,field_2\nvalue 1,value 2'
    parser.end()

  it '1 arg: callback; pipe data and get result in callback', (next) ->
    generate(length: 2, seed: 1, columns: 2, fixed_size: true)
    .pipe parse (err, data) ->
      data.should.eql [ [ 'OMH', 'ONKCHhJmjadoA' ], [ 'D', 'GeACHiN' ] ]
      next err

  it '1 arg: options; write data and read stream', (next) ->
    data = []
    parser = parse columns: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'err', (err) ->
      next err
    parser.on 'finish', ->
      data.should.eql [field_1: 'value 1', field_2: 'value 2']
      next()
    parser.write 'field_1,field_2\nvalue 1,value 2'
    parser.end()

  it '2 args: data, options; read stream', (next) ->
    data = []
    parser = parse 'field_1,field_2\nvalue 1,value 2', columns: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'err', (err) ->
      next err
    parser.on 'finish', ->
      data.should.eql [field_1: 'value 1', field_2: 'value 2']
      next()

  it '2 args: options, callback; write data and get result in callback', (next) ->
    parser = parse columns: true, (err, data) ->
      data.should.eql [field_1: 'value 1', field_2: 'value 2']
      next err
    parser.write 'field_1,field_2\nvalue 1,value 2'
    parser.end()

  it '2 args: callback, callback', (next) ->
    parse 'value a,value b\nvalue 1,value 2', (err, data) ->
      data.should.eql [ [ 'value a', 'value b' ], [ 'value 1', 'value 2' ] ]
      next err

  it '3 args: callback, options, callback', (next) ->
    parse 'field_1,field_2\nvalue 1,value 2', columns: true, (err, data) ->
      data.should.eql [field_1: 'value 1', field_2: 'value 2']
      next err

