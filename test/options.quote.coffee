
parse = require '../lib'

describe 'options quote', ->
  
  it 'default', ->
    parser = parse()
    parser.options.quote.should.eql Buffer.from('"')[0]
      
  it 'normalize', ->
    parser = parse quote: true
    parser.options.quote.should.eql Buffer.from('"')[0]
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
    
  it 'values containing quotes and double quotes escape', (next) ->
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

  describe 'error "Quoted field not terminated"', ->
    
    it 'when unclosed', (next) ->
      parse """
      "",1974,8.8392926E7,"","
      """, (err, data) ->
        err.message.should.eql 'Invalid Closing Quote: quote is not closed at line 1'
        next()

  describe 'error "Invalid Closing Quote"', ->

    it 'when followed by a character', (next) ->
      parse '""!', quote: '"', escape: '"', (err) ->
        err.message.should.eql 'Invalid Closing Quote: got "!" at line 1 instead of delimiter, row delimiter, trimable character (if activated) or comment'
        next()

    it 'no throw followed by a comment', (next) ->
      parse '""# A comment', quote: '"', escape: '"', comment: '#', (err) ->
        next err

    it 'no throw followed by a delimiter', (next) ->
      parse '""|BB', quote: '"', escape: '"', delimiter: '|', (err) ->
        next err

    it 'no throw followed by a row delimiter', (next) ->
      parse '""|BB', quote: '"', escape: '"', rowDelimiter: '|', (err) ->
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
        err.message.should.eql 'Invalid opening quote at line 3'
        (data == undefined).should.be.true
        next()
      
