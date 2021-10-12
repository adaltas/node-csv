
import { parse } from '../lib/index.js'
import { assert_error } from './api.assert_error.coffee'

describe 'Option `quote`', ->

  it 'is compatible with buffer size', (next) ->
    parser = parse escape: '$', quote: '::::::', (err, data) ->
      data.should.eql [
        [ '1', '2::::::2', '3' ]
        [ 'b', 'c', 'd' ]
      ]
      next err
    parser.write c for c in """
    1,::::::2$::::::2::::::,3
    b,c,d
    """
    parser.end()
  
  it 'default', ->
    parser = parse()
    parser.options.quote.should.eql Buffer.from('"')
      
  it 'normalize', ->
    parser = parse quote: true
    parser.options.quote.should.eql Buffer.from('"')
    parser = parse quote: false
    (parser.options.quote is null).should.be.true()
    parser = parse quote: null
    (parser.options.quote is null).should.be.true()
  
  it 'with default',  (next) ->
    data = '''
    abc,"123",def,"456"
    hij,klm,"789",nop
    '''
    parser = parse (err, data) ->
      return next err if err
      data.should.eql [
        [ 'abc','123','def','456' ]
        [ 'hij','klm','789','nop' ]
      ]
      next()
    parser.write chr for chr in data
    parser.end()
    
  it 'with fields containing delimiters', (next) ->
    parse """
    20322051544,",1979.0,8.8017226E7,ABC,45,2000-01-01",1,2,3,4
    28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
    "28392898392,1974.0","8.8392926E7","DEF,23,2050-11-27,",4,5,6
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544',',1979.0,8.8017226E7,ABC,45,2000-01-01','1','2','3','4' ]
        [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
        [ '28392898392,1974.0','8.8392926E7','DEF,23,2050-11-27,','4','5','6' ]
      ]
      next()
    
  it 'empty value', (next) ->
    parse """
    20322051544,"",8.8017226E7,45,""
    "",1974,8.8392926E7,"",""
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','','8.8017226E7','45','' ]
        [ '','1974','8.8392926E7','','' ]
      ]
      next()
    
  it 'values containing quotes and double quotes escape', (next) ->
    parse '''
    AB,"""",CD,"""hi"""
    "",JK,"",""
    ''', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'AB','"','CD','"hi"' ]
        [ '','JK','','' ]
      ]
      next()
    
  it 'only containing quotes and double quotes escape', (next) ->
    data = '''
    """"
    """"
    '''
    parser = parse (err, data) ->
      return next err if err
      data.should.eql [
        [ '"' ]
        [ '"' ]
      ]
      next()
    parser.write chr for chr in data
    parser.end()
    
  it 'line breaks inside quotes', (next) ->
    parse """
    20322051544,"
    ",8.8017226E7,45,"
    ok
    "
    "
    ",1974,8.8392926E7,"","
    "
    """, (err, data) ->
      data.should.eql [
        [ '20322051544','\n','8.8017226E7','45','\nok\n' ]
        [ '\n','1974','8.8392926E7','','\n' ]
      ] unless err
      next err

  describe 'disabled', ->
    
    it 'if empty', (next) ->
      parse """
      a,b,c
      1,r"2"d"2",3
      """, quote: '', (err, data) ->
        data.should.eql [['a','b','c'],['1','r"2"d"2"','3']] unless err
        next err
    
    it 'if null', (next) ->
      parse """
      a,b,c
      1,r"2"d"2",3
      """, quote: null, (err, data) ->
        data.should.eql [['a','b','c'],['1','r"2"d"2"','3']] unless err
        next err
    
    it 'if false', (next) ->
      parse """
      a,b,c
      1,r"2"d"2",3
      """, quote: null, (err, data) ->
        data.should.eql [['a','b','c'],['1','r"2"d"2"','3']] unless err
        next err
  
  describe 'options', ->
    
    it 'with multiple chars', (next) ->
      parse """
      $$a$$,b,$$c$$
      1,$$2$$,3
      """, quote: '$$', (err, data) ->
        data.should.eql [['a','b','c'],['1','2','3']] unless err
        next err
    
    it 'with columns', (next) ->
      parse """
      a,"b",c
      1,"2",3
      """, quote: true, columns: true, (err, data) ->
        data.should.eql [ { a: '1', b: '2', c: '3' } ] unless err
        next err

  describe 'error "Quoted field not terminated"', ->
    
    it 'when unclosed', (next) ->
      parse """
      "",1974,8.8392926E7,"","
      """, (err, data) ->
        assert_error err,
          message: 'Quote Not Closed: the parsing is finished with an opening quote at line 1'
          code: 'CSV_QUOTE_NOT_CLOSED'
        next()

  describe 'error "Invalid Closing Quote"', ->

    it 'when followed by a character', (next) ->
      parse '""!', quote: '"', escape: '"', (err) ->
        assert_error err,
          message: 'Invalid Closing Quote: got "!" at line 1 instead of delimiter, record delimiter, trimable character (if activated) or comment'
          code: 'CSV_INVALID_CLOSING_QUOTE'
        next()

    it 'no throw followed by a comment', (next) ->
      parse '""# A comment', quote: '"', escape: '"', comment: '#', (err) ->
        next err

    it 'no throw followed by a delimiter', (next) ->
      parse '""|BB', quote: '"', escape: '"', delimiter: '|', (err) ->
        next err

    it 'no throw followed by a record delimiter', (next) ->
      parse '""|BB', quote: '"', escape: '"', record_delimiter: '|', (err) ->
        next err

    it 'no throw followed by a trimable character', (next) ->
      parse '"" ', quote: '"', escape: '"', rtrim: true, (err) ->
        next err

  describe 'error "Invalid opening quotes"', ->

    it 'count empty lines', (next) ->
      parse """
      "this","line","is",valid
      "this","line",is,"also,valid"
      this,"line",is,invalid h"ere"
      "and",valid,line,follows...
      """, (err, data) ->
        assert_error err,
          message: 'Invalid Opening Quote: a quote is found inside a field at line 3'
          code: 'INVALID_OPENING_QUOTE'
          field: 'invalid h'
        (data == undefined).should.be.true
        next()
      
