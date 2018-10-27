
fs = require 'fs'
parse = require '../src'

describe 'options quote', ->
  
  it 'with default',  (next) ->
    parse """
    abc,"123",def,"456"
    hij,klm,"789",nop
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'abc','123','def','456' ]
        [ 'hij','klm','789','nop' ]
      ]
      next()
    
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
    parse """
    20322051544,\"\"\"\",8.8017226E7,45,\"\"\"ok\"\"\"
    "",1974,8.8392926E7,"",""
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','"','8.8017226E7','45','"ok"' ]
        [ '','1974','8.8392926E7','','' ]
      ]
      next()
    
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
      err.message.should.eql 'Quoted field not terminated at line 1'
      next()

describe 'error "Invalid closing quote"', ->

  it 'when invalid quotes', (next) ->
    parse """
      ""  1974    8.8392926E7 ""t ""
      ""  1974    8.8392926E7 ""  ""
    """, quote: '"', escape: '"', delimiter: "\t", (err) ->
      err.message.should.eql 'Invalid closing quote at line 1; found " " instead of delimiter "\\t"'
      next()
    
  it '"Invalid closing quote" display expected delimiter', (next) ->
    parse '"",1974,8.8392926E7,""t,""', quote: '"', escape: '"', (err) ->
      err.message.should.eql 'Invalid closing quote at line 1; found "t" instead of delimiter ","'
      next()

describe 'error "Invalid opening quotes"', ->

  it 'count empty lines', (next) ->
    parse """
    "this","line","is",valid
    
    "this","line",is,"also,valid"
    this,"line",is,invalid h"ere"
    "and",valid,line,follows...
    """, (err, data) ->
      err.message.should.eql 'Invalid opening quote at line 4'
      (data == undefined).should.be.true
      next()
    
