
import { parse } from '../lib/index.js'

describe 'Option `encoding`', ->
  
  describe 'validation & normalization', ->
    
    it 'boolean true convert to default', ->
      parse(encoding: true).options.encoding.should.eql 'utf8'
    
    it 'boolean false convert to null', ->
      (parse(encoding: false).options.encoding is null).should.be.true()
  
    it 'integer throw invalid encoding', ->
      (->
        parse 'whocare', encoding: 666, (->)
      ).should.throw
        code: 'CSV_INVALID_OPTION_ENCODING'
        message: [
          'Invalid option encoding:',
          'encoding must be a string or null to return a buffer,',
          'got 666'
        ].join ' '
  
  describe 'definition', ->
    
    it 'with delimiter', (next) ->
      parse Buffer.from('x:x', 'utf16le'),
        delimiter: ':'
        encoding: 'utf16le'
      , (err, records) ->
        records.should.eql [['x', 'x']] unless err
        next err
    
    it 'with escape equals quote', (next) ->
      parse Buffer.from( """
        a,b,c
        1,"2 ""3"" 4",5
        """, 'utf16le'
      ),
        encoding: 'utf16le'
      , (err, records) ->
        records.should.eql [
          [ 'a', 'b', 'c' ]
          [ '1', '2 "3" 4', '5' ]
        ] unless err
        next err
    
    it 'null return buffer', (next) ->
      parse Buffer.from( 'a,b\n1,2' ),
        encoding: null
      , (err, records) ->
        records.should.eql [
          [ Buffer.from('a'), Buffer.from('b') ]
          [ Buffer.from('1'), Buffer.from('2') ]
        ] unless err
        next err
  
  describe 'with bom', ->

    it 'handle BOM with utf16le', (next) ->
      parser = parse bom: true, encoding: 'utf16le', (err, records) ->
        records.should.eql [
          ['a', 'b', 'c']
          ['d', 'e', 'f']
        ]
        next()
      # parser.write Buffer.from Buffer.from([255, 254])
      parser.write Buffer.from "\ufeffa,b,c\n", 'utf16le'
      parser.write Buffer.from 'd,e,f', 'utf16le'
      parser.end()

    it 'is auto detected for utf16le', (next) ->
      parser = parse bom: true, (err, records) ->
        records.should.eql [
          ['a', 'b', 'c']
          ['d', 'e', 'f']
        ] unless err
        next err
      # parser.write Buffer.from Buffer.from([255, 254])
      parser.write Buffer.from '\ufeffa,b,"c"\n', 'utf16le'
      parser.write Buffer.from 'd,e,f', 'utf16le'
      parser.end()
