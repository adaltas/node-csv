
should = require 'should'
parse = require '../src'

describe 'line counter', ->
  
  it 'should display correct line number when invalid opening quotes', (next) ->
    parse """
    "this","line","is",valid
    "this","line",is,"also,valid"
    this,"line",is,"invalid",h"ere"
    "and",valid,line,follows...
    """, (err, data) ->
      err.message.should.match /Invalid opening quote at line 3/
      (data == undefined).should.be.true
      next()
  
  it 'should count empty lines', (next) ->
    parse """
    "this","line","is",valid
    
    "this","line",is,"also,valid"
    this,"line",is,invalid h"ere"
    "and",valid,line,follows...
    """, (err, data) ->
      err.message.should.match /Invalid opening quote at line 4/
      (data == undefined).should.be.true
      next()
  
  it 'should count empty lines with "skip_empty_lines" true', (next) ->
    parse """
    "this","line","is",valid

    "this","line",is,"also,valid"
    this,"line",is,invalid h"ere"
    "and",valid,line,follows...
    """, skip_empty_lines: true, (err, data) ->
      err.message.should.match /Invalid opening quote at line 4/
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
      err.message.should.eql "Quoted field not terminated at line 6"
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
      err.message.should.eql 'Invalid closing quote at line 3; found " " instead of delimiter "\\t"'
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
