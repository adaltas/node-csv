
generate = require 'csv-generate'
parse = require '../src'

describe 'api arguments', ->

  it 'exports Parser class', ->
    parse.Parser.should.be.a.Function
  
  describe '0 arg', ->

    it 'no arguments', (next) ->
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
    
  describe '1 arg', ->

    it 'callback:function; pipe data and get result in callback', (next) ->
      generate(length: 2, seed: 1, columns: 2, fixed_size: true)
      .pipe parse (err, data) ->
        data.should.eql [ [ 'OMH', 'ONKCHhJmjadoA' ], [ 'D', 'GeACHiN' ] ]
        next err

    it 'options:object; write data and read stream', (next) ->
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
    
  describe '2 args', ->

    it 'data:string, options:object; read stream', (next) ->
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

    it 'options:object, callback:function; write data and get result in callback', (next) ->
      parser = parse columns: true, (err, data) ->
        data.should.eql [field_1: 'value 1', field_2: 'value 2']
        next err
      parser.write 'field_1,field_2\nvalue 1,value 2'
      parser.end()

    it 'data:string, callback:function', (next) ->
      parse 'value a,value b\nvalue 1,value 2', (err, data) ->
        data.should.eql [ [ 'value a', 'value b' ], [ 'value 1', 'value 2' ] ]
        next err

    it 'data:buffer, callback:function', (next) ->
      parse new Buffer('value a,value b\nvalue 1,value 2'), (err, data) ->
        data.should.eql [ [ 'value a', 'value b' ], [ 'value 1', 'value 2' ] ]
        next err

    it 'data:undefined, options:object', ->
      try
        parse undefined, {}
      catch err
        err.message.should.eql 'Invalid first argument: undefined'

    it 'data:undefined, callback:function', (next) ->
      parse undefined, (err, data) ->
        err.message.should.eql 'Invalid first argument: undefined'
        next()

    it 'data:array, callback:function', (next) ->
      parse ['value a,value b', 'value 1,value 2'], (err, data) ->
        err.message.should.eql 'Invalid first argument: ["value a,value b","value 1,value 2"]'
        next()

    it 'options:object, options:object', ->
      try
        parse {}, {}
      catch err
        err.message.should.eql 'Invalid arguments: got options twice as first and second arguments'
      
  describe '3 args', ->

    it 'data:string, options:object, callback:function', (next) ->
      parse 'field_1,field_2\nvalue 1,value 2', columns: true, (err, data) ->
        data.should.eql [field_1: 'value 1', field_2: 'value 2']
        next err

    it 'data:buffer, options:object, callback:function', (next) ->
      parse new Buffer('field_1,field_2\nvalue 1,value 2'), columns: true, (err, data) ->
        data.should.eql [field_1: 'value 1', field_2: 'value 2']
        next err

    it 'data:undefined, options:object, callback:function', (next) ->
      parse undefined, columns: true, (err, data) ->
        err.message.should.eql 'Invalid data argument: undefined'
        next()

    it 'data:string, options:object, callback:undefined', (next) ->
      try
        parse 'field_1,field_2\nvalue 1,value 2', columns: true, undefined
      catch err
        err.message.should.eql "Invalid callback argument: undefined"
        next()
