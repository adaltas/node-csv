
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'line counter', ->
  
  it 'should display correct line number when invalid opening quotes', (next) ->
    parse """
    "this","line","is",valid
    "this","line",is,"also",valid
    this,"line",is,"invalid",h"ere"
    "and",valid,line,follows...
    """, (err, data) ->
      err.message.should.match /Invalid opening quote at line 3/
      (data == undefined).should.be.true
      next()

  it 'should display correct line number when unclosed quotes', (next) ->
    parse """
    "",1974,8.8392926E7,"",""
    "",1974,8.8392926E7,"",""
    "",1974,8.8392926E7,"",""
    "",1974,8.8392926E7,"","
    "",1974,8.8392926E7,"",""
    """, (err, data) ->
      err.message.should.match /Quoted field not terminated at line 4/
      (data == undefined).should.be.true
      next()
    
  it 'should display correct line number when invalid quotes', (next) ->
    parse """
      "  1974    8.8392926E7 ""t "
      "  1974    8.8392926E7 ""t "
      ""  1974    8.8392926E7 ""t ""
      "  1974    8.8392926E7 ""t "
      "  1974    8.8392926E7 "t ""
    """, quote: '"', escape: '"', delimiter: "\t", (err, data) ->
      err.message.should.match /Invalid closing quote at line 3/
      (data == undefined).should.be.true
      next()
    
  it 'should display correct line number when invalid quotes from string', (next) ->
    parse """
    "",1974,8.8392926E7,"",""
    "",1974,8.8392926E7,""t,""
    "",1974,8.8392926E7,""t,""
    "",1974,8.8392926E7,"",""
    "",1974,8.8392926E7,"",""
    "",1974,8.8392926E7,""t,""
    """, quote: '"', escape: '"', (err, data) ->
      err.message.should.match /Invalid closing quote at line 2/
      (data == undefined).should.be.true
      next()
