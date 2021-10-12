
import { parse } from '../lib/index.js'
import { assert_error } from './api.assert_error.coffee'

describe 'Option `bom`', ->
  
  it 'validate', ->
    (->
      parse bom: 'ohno', ( -> )
    ).should.throw
      message: 'Invalid option bom: bom must be true, got "ohno"'
      code: 'CSV_INVALID_OPTION_BOM'

  it 'preserve bom if not defined', (next) ->
    parser = parse (err, data) ->
      data.should.eql [
        ['\ufeffa', 'b', 'c']
        ['d', 'e', 'f']
      ]
      next()
    parser.write Buffer.from "\ufeffa,b,c\n"
    parser.write Buffer.from 'd,e,f'
    parser.end()

  it 'preserve BOM if false', (next) ->
    parser = parse bom: false, (err, data) ->
      data.should.eql [
        ['\ufeffa', 'b', 'c']
        ['d', 'e', 'f']
      ]
      next()
    parser.write Buffer.from "\ufeffa,b,c\n"
    parser.write Buffer.from 'd,e,f'
    parser.end()

  it 'with column option with bom `true`', (next) ->
    parser = parse
      columns: true
      bom: true
    , (err, records) ->
      records[0]['key'].should.eql 'value'
      next()
    parser.write Buffer.from "\ufeffkey\nvalue"
    parser.end()

  it 'with column option with bom `false`', (next) ->
    parser = parse
      columns: true
      bom: false
    , (err, records) ->
      records[0]['\ufeffkey'].should.eql 'value'
      next()
    parser.write Buffer.from "\ufeffkey\nvalue"
    parser.end()

  it 'throw parsing error if quote follow bom', (next) ->
    parser = parse (err, data) ->
      assert_error err,
        message: 'Invalid Opening Quote: a quote is found inside a field at line 1'
        code: 'INVALID_OPENING_QUOTE'
        field: '\ufeff'
      next()
    parser.write Buffer.from "\ufeff\"a\",b,c\n"
    parser.write Buffer.from 'd,e,f'
    parser.end()

  it 'handle BOM with utf8 (default)', (next) ->
    parser = parse bom: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c']
        ['d', 'e', 'f']
      ]
      next()
    parser.write Buffer.from "\ufeffa,b,c\n"
    parser.write Buffer.from 'd,e,f'
    parser.end()

  it 'preserve data if BOM is true', (next) ->
    parser = parse bom: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c']
        ['d', 'e', 'f']
      ]
      next()
    parser.write Buffer.from "a,b,c\n"
    parser.write Buffer.from 'd,e,f'
    parser.end()

  it 'handle BOM even if no enough data in the first package', (next) ->
    parser = parse bom: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c']
        ['d', 'e', 'f']
      ]
      next()
    parser.write Buffer.from [239]
    parser.write Buffer.from [187]
    parser.write Buffer.from [191]
    parser.write Buffer.from "a,b,c\n"
    parser.write Buffer.from "d,e,f"
    parser.end()

  it 'preserve data if no enough data to detect BOM', (next) ->
    parser = parse bom: true, (err, data) ->
      data.should.eql [
        ['\ufffd']
      ]
      next()
    parser.write Buffer.from [239, 187]
    parser.end()
