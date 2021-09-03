
import generate from 'csv-generate'
import parse, {Parser} from '../lib/index.js'
import {assert_error} from './api.assert_error.coffee'

describe 'API arguments', ->

  it 'exports Parser class', ->
    Parser.should.be.a.Function
  
  describe '0 arg', ->

    it 'no arguments', (next) ->
      data = []
      parser = parse()
      parser.on 'readable', ->
        while d = this.read()
          data.push d
      parser.on 'err', (err) ->
        next err
      parser.on 'end', ->
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
      parser.on 'end', ->
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
      parser.on 'end', ->
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
      parse Buffer.from('value a,value b\nvalue 1,value 2'), (err, data) ->
        data.should.eql [ [ 'value a', 'value b' ], [ 'value 1', 'value 2' ] ]
        next err

    it 'data:undefined, options:object', ->
      (->
        parse undefined, {}
      ).should.throw
        message: 'Invalid argument: got undefined at index 0'
        code: 'CSV_INVALID_ARGUMENT'

    it 'data:undefined, callback:function', ->
      (->
        parse undefined, (->)
      ).should.throw
        message: 'Invalid argument: got undefined at index 0'
        code: 'CSV_INVALID_ARGUMENT'

    it 'data:array, callback:function', ->
      (->
        parse ['value a,value b', 'value 1,value 2'], (->)
      ).should.throw
        message: 'Invalid argument: got ["value a,value b","value 1,value 2"] at index 0'
        code: 'CSV_INVALID_ARGUMENT'

    it 'options:object, options:object', ->
      (->
        parse {}, {}
      ).should.throw
        message: 'Invalid argument: got {} at index 1'
        code: 'CSV_INVALID_ARGUMENT'

  describe '3 args', ->

    it 'data:string, options:object, callback:function', (next) ->
      parse 'field_1,field_2\nvalue 1,value 2', columns: true, (err, data) ->
        data.should.eql [field_1: 'value 1', field_2: 'value 2']
        next err

    it 'data:buffer, options:object, callback:function', (next) ->
      parse Buffer.from('field_1,field_2\nvalue 1,value 2'), columns: true, (err, data) ->
        data.should.eql [field_1: 'value 1', field_2: 'value 2']
        next err

    it 'data:undefined, options:object, callback:function', ->
      (->
        parse undefined, columns: true, (->)
      ).should.throw
        message: 'Invalid argument: got undefined at index 0'
        code: 'CSV_INVALID_ARGUMENT'

    it 'data:string, options:object, callback:undefined', ->
      (->
        parse 'field_1,field_2\nvalue 1,value 2', columns: true, undefined
      ).should.throw
        message: 'Invalid argument: got undefined at index 2'
        code: 'CSV_INVALID_ARGUMENT'
      
