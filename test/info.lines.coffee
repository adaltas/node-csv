
parse = require '../lib'

describe 'properties lines', ->
  
  it 'count lines', (next) ->
    p = parse """
    a,b,c
    d,e,f
    h,i,j
    """, (err, data) ->
      p.info.lines.should.eql 3 unless err
      next err
        
  it 'count no line', (next) ->
    p = parse "", (err, data) ->
      p.info.lines.should.eql 1 unless err
      next err
        
  it 'count empty lines', (next) ->
    p = parse "\n\n", (err, data) ->
      p.info.lines.should.eql 3 unless err
      next err
  
  it 'should count sparse empty lines', (next) ->
    p = parse """
    
    a,b,c
    
    d,e,f
    h,i,j
    
    """, skip_empty_lines: true, (err, data) ->
      p.info.lines.should.eql 6 unless err
      next err
        
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
      err.message.should.eql "Invalid Closing Quote: quote is not closed at line 5"
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
      err.message.should.eql 'Invalid Closing Quote: got " " at line 3 instead of delimiter, row delimiter, trimable character (if activated) or comment'
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
      err.message.should.eql 'Invalid Closing Quote: got "t" at line 2 instead of delimiter, row delimiter, trimable character (if activated) or comment'
      (data == undefined).should.be.true
      next()
