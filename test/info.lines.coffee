
parse = require '../lib'
assert_error = require './api.assert_error'

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
      assert_error err,
        message: 'Invalid Opening Quote: a quote is found inside a field at line 3'
        code: 'INVALID_OPENING_QUOTE'
        field: 'h'
      (data == undefined).should.be.true
      next()
  
  it 'should count empty lines with "skip_empty_lines" true', (next) ->
    parse """
    "this","line","is",valid

    "this","line",is,"also,valid"
    this,"line",is,invalid h"ere"
    "and",valid,line,follows...
    """, skip_empty_lines: true, (err, data) ->
      assert_error err,
        message: 'Invalid Opening Quote: a quote is found inside a field at line 4'
        code: 'INVALID_OPENING_QUOTE'
        field: 'invalid h'
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
      assert_error err,
        message: 'Quote Not Closed: the parsing is finished with an opening quote at line 5'
        code: 'CSV_QUOTE_NOT_CLOSED'
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
      assert_error err,
        message: 'Invalid Closing Quote: got " " at line 3 instead of delimiter, row delimiter, trimable character (if activated) or comment'
        code: 'CSV_INVALID_CLOSING_QUOTE'
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
      assert_error err,
        message: 'Invalid Closing Quote: got "t" at line 2 instead of delimiter, row delimiter, trimable character (if activated) or comment'
        code: 'CSV_INVALID_CLOSING_QUOTE'
      (data == undefined).should.be.true
      next()
