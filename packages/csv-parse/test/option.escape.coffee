
import { parse } from '../lib/index.js'

describe 'Option `escape`', ->

  describe 'normalisation, coercion & validation', ->
  
    it 'default', ->
      parse().options.escape.should.eql Buffer.from('"')
      parse(escape: undefined).options.escape.should.eql Buffer.from('"')
      parse(escape: true).options.escape.should.eql Buffer.from('"')
  
    it 'custom', ->
      parse(escape: '\\').options.escape.should.eql Buffer.from('\\')
      parse(escape: Buffer.from('\\')).options.escape.should.eql Buffer.from('\\')
  
    it 'disabled', ->
      (parse(escape: null).options.escape is null).should.be.true()
      (parse(escape: false).options.escape is null).should.be.true()
  
    it 'invalid', ->
      (->
        parse escape: 1
      ).should.throw 'Invalid Option: escape must be a buffer, a string or a boolean, got 1'
      # (->
      #   parse escape: 'abc'
      # ).should.throw 'Invalid Option Length: escape must be one character, got 3'

    it 'is compatible with buffer size', (next) ->
      parser = parse escape: ':::', (err, records) ->
        records.should.eql [
          [ '1', '2"2', '3' ]
          [ 'b', 'c', 'd' ]
        ]
        next err
      parser.write c for c in """
      1,"2:::"2",3
      b,c,d
      """
      parser.end()
  
  describe 'disabled', ->

    it 'when null', (next) ->
      parse '''
      a"b
      '1"2'
      ''', escape: null, quote: '\'', (err, records) ->
        return next err if err
        records.should.eql [
          [ 'a"b' ],[ '1"2' ]
        ]
        next()
      
  describe 'same as quote', ->

    it 'length is 1 char', (next) ->
      parse '''
      aa,"b1""b2","c""d""e"
      "f""g",h,"i1""i2"
      ''', escape: '"', (err, records) ->
        return next err if err
        records.should.eql [
          [ 'aa','b1"b2','c"d"e' ]
          [ 'f"g','h','i1"i2' ]
        ]
        next()
  
    it 'length is multiple char', (next) ->
      parse '''
      aa,$$b1$$$$b2$$,$$c$$$$d$$$$e$$
      $$f$$$$g$$,h,$$i1$$$$i2$$
      ''', escape: '$$', quote: '$$', (err, records) ->
        return next err if err
        records.should.eql [
          [ 'aa','b1$$b2','c$$d$$e' ]
          [ 'f$$g','h','i1$$i2' ]
        ]
        next()

  describe 'different than quote', ->

    it 'apply to quote char', (next) ->
      parse '''
      aa,"b1\\"b2","c\\"d\\"e"
      "f\\"g",h,"i1\\"i2"
      ''', escape: '\\', (err, records) ->
        return next err if err
        records.should.eql [
          [ 'aa','b1"b2','c"d"e' ]
          [ 'f"g','h','i1"i2' ]
        ]
        next()

    it 'apply to quote char', (next) ->
      parse '''
      aa,"b1$$"b2","c$$"d$$"e"
      "f$$"g",h,"i1$$"i2"
      ''', escape: '$$', (err, records) ->
        return next err if err
        records.should.eql [
          [ 'aa','b1"b2','c"d"e' ]
          [ 'f"g','h','i1"i2' ]
        ]
        next()

    it 'apply to escape char', (next) ->
      parse '''
      aa,"b1\\\\b2","c\\\\d\\\\e"
      "f\\\\g",h,"i1\\\\i2"
      ''', escape: '\\', (err, records) ->
        return next err if err
        records.should.eql [
          [ 'aa','b1\\b2','c\\d\\e' ]
          [ 'f\\g','h','i1\\i2' ]
        ]
        next()

    it 'does not apply outside quoted field', (next) ->
      parse '''
      aa,b1\\\\b2,c\\\\d\\\\e
      f\\\\g,h,i1\\\\i2
      ''', escape: '\\', (err, records) ->
        return next err if err
        records.should.eql [
          [ 'aa','b1\\\\b2','c\\\\d\\\\e' ]
          [ 'f\\\\g','h','i1\\\\i2' ]
        ]
        next()

    it 'does not apply to delimiter', (next) ->
      parse '''
      aa\\,bb
      ''', escape: '\\', (err, records) ->
        return next err if err
        records.should.eql [
          [ 'aa\\','bb' ]
        ]
        next()

    it 'handle non continuous chunks', (next) ->
      records = []
      parser = parse escape: '\\'
      parser.on 'readable', ->
        while d = parser.read()
          records.push d
      parser.on 'end', ->
        records.should.eql [
          [ 'abc " def' ]
        ]
        next()
      parser.write chr for chr in '''
        "abc \\" def"
        '''
      parser.end()
