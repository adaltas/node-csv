
should = require 'should'
generate = require 'csv-generate'
parse = require '../src'

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

  it '2 args: data(string), callback', (next) ->
    parse 'value a,value b\nvalue 1,value 2', (err, data) ->
      data.should.eql [ [ 'value a', 'value b' ], [ 'value 1', 'value 2' ] ]
      next err

  it '2 args: data(buffer), callback', (next) ->
    parse new Buffer('value a,value b\nvalue 1,value 2'), (err, data) ->
      data.should.eql [ [ 'value a', 'value b' ], [ 'value 1', 'value 2' ] ]
      next err

  it '3 args: data(string), options, callback', (next) ->
    parse 'field_1,field_2\nvalue 1,value 2', columns: true, (err, data) ->
      data.should.eql [field_1: 'value 1', field_2: 'value 2']
      next err

  it '3 args: data(buffer), options, callback', (next) ->
    parse new Buffer('field_1,field_2\nvalue 1,value 2'), columns: true, (err, data) ->
      data.should.eql [field_1: 'value 1', field_2: 'value 2']
      next err

  it '3 args: data undefined, options, callback', (next) ->
    parse undefined, columns: true, (err, data) ->
      err.message.should.eql 'Invalid data argument: undefined'
      next()

  it '3 args: data, options, callback undefined', (next) ->
    try
      parse 'field_1,field_2\nvalue 1,value 2', columns: true, undefined
    catch e
      e.message.should.eql "Invalid callback argument: undefined"
      next()
