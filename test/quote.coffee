
fs = require 'fs'
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'quote', ->
  
  it 'with separator inside fields',  (next) ->
    stringify [
      [ '20322051544','1979.0','8.8017226E7','ABC,45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,1979.0,8.8017226E7,"ABC,45",2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()
    
  it 'with values containing delimiters', (next) ->
    stringify [
      [ '20322051544',',1979.0,8.8017226E7,ABC,45,2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
      [ '28392898392,1974.0','8.8392926E7','DEF,23,2050-11-27,' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,",1979.0,8.8017226E7,ABC,45,2000-01-01"
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      "28392898392,1974.0",8.8392926E7,"DEF,23,2050-11-27,"
      """
      next()
    
  it 'with fields containing quotes', (next) ->
    stringify [
      [ '20322051544','1979.0','8.801"7226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','2"3','2050-11-27' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,1979.0,"8.801""7226E7",ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,"2""3",2050-11-27
      """
      next()
    
  it 'empty value', (next) ->
    stringify [
      [ '20322051544','','8.8017226E7','45','' ]
      [ '','1974','8.8392926E7','','' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,,8.8017226E7,45,
      ,1974,8.8392926E7,,
      """
      next()
    
  it 'values containing quotes and double quotes escape', (next) ->
    stringify [
      [ '20322051544','"','8.8017226E7',45,'"ok"' ]
      [ '','1974','8.8392926E7','','' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,\"\"\"\",8.8017226E7,45,\"\"\"ok\"\"\"
      ,1974,8.8392926E7,,
      """
      next()
    
  it 'line breaks inside quotes', (next) ->
    stringify [
      [ '20322051544','\n',',8.8017226E7',45,'\nok\n' ]
      [ '\n','1974','8.8392926E7','','\n' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,"
      ",",8.8017226E7",45,"
      ok
      "
      "
      ",1974,8.8392926E7,,"
      "
      """
      next()








