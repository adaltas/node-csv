
fs = require 'fs'
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'quote', ->
  
  it 'with default',  (next) ->
    parse """
    20322051544,"1979.0",8.8017226E7,"ABC,45","2000-01-01"
    28392898392,1974.0,"8.8392926E7",DEF,23,2050-11-27
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','1979.0','8.8017226E7','ABC,45','2000-01-01' ]
        [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
      ]
      next()
    
  it 'with fields containing delimiters', (next) ->
    parse """
    20322051544,",1979.0,8.8017226E7,ABC,45,2000-01-01"
    28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
    "28392898392,1974.0","8.8392926E7","DEF,23,2050-11-27,"
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544',',1979.0,8.8017226E7,ABC,45,2000-01-01' ]
        [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
        [ '28392898392,1974.0','8.8392926E7','DEF,23,2050-11-27,' ]
      ]
      next()
    
  it 'with fields containing quotes', (next) ->
    parse """
    20322051544,"1979.0",8.801"7226E7,ABC,45,2000-01-01
    28392898392,1974.0,8.8392926E7,DEF,2"3,2050-11-27
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','1979.0','8.801"7226E7','ABC','45','2000-01-01' ]
        [ '28392898392','1974.0','8.8392926E7','DEF','2"3','2050-11-27' ]
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
        [ '20322051544','"','8.8017226E7',45,'"ok"' ]
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
      return next err if err
      data.should.eql [
        [ '20322051544','\n','8.8017226E7',45,'\nok\n' ]
        [ '\n','1974','8.8392926E7','','\n' ]
      ]
      next()

describe 'quote error', ->
  
  it 'when unclosed', (next) ->
    parse """
    "",1974,8.8392926E7,"","
    """, (err, data) ->
      err.message.should.eql 'Quoted field not terminated at line 1'
      next()
    
  it 'when invalid quotes', (next) ->
    parse """
      ""  1974    8.8392926E7 ""t ""
      ""  1974    8.8392926E7 ""  ""
    """, quote: '"', escape: '"', delimiter: "\t", (err) ->
      err.message.should.eql 'Invalid closing quote at line 1; found " " instead of delimiter "\\t"'
      next()
    
  it 'when invalid quotes from string', (next) ->
    parse '"",1974,8.8392926E7,""t,""', quote: '"', escape: '"', (err) ->
      err.message.should.match /Invalid closing quote/
      next()
    





