
parse = require '../src'

describe 'options skip_lines_with_error', ->
  
  it 'handle "Invalid closing quote"', (next) ->
    skip = null
    parse """
    "a","b","c"
    "one","two","three"
    "four"," " ","six"
    "seven","eight","nine"
    """, skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ["a","b","c"]
        ["one","two","three"]
        ["seven","eight","nine"]
      ] unless err
      skip.message.should.eql 'Invalid closing quote at line 3; found " " instead of delimiter ","' unless err
      next err
    .on 'skip', (err) -> skip = err

  it 'handle "Invalid opening quote"', (next) ->
    skip = null
    parse """
    "line",1
    "line",invalid h"ere"
    line,3
    """, skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ["line","1"]
        ["line", "3"]
      ] unless err
      skip.message.should.match 'Invalid opening quote at line 2' unless err
      next err
    .on 'skip', (err) -> skip = err
  
  it 'handle "Quoted field not terminated"', (next) ->
    skip = null
    parse """
    "a",b,"c",d
    "",1974,8.8392926E7,"","
    """, skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c', 'd']
      ] unless err
      skip.message.should.match 'Quoted field not terminated at line 2' unless err
      next err
    .on 'skip', (err) -> skip = err

  it 'handle "Number of columns does not match header"', (next) ->
    skip = null
    parse """
    1,2,3
    4,5,6,x
    7,8,9,y
    """, skip_lines_with_error: true, columns: ["a", "b", "c", "d"], (err, data) ->
      data.should.eql [
        { a: '4', b: '5', c: '6', d: 'x'}
        { a: '7', b: '8', c: '9', d: 'y'}
      ] unless err
      skip.message.should.match 'Number of columns on line 1 does not match header' unless err
      next err
    .on 'skip', (err) -> skip = err
    

  it 'handle "Number of columns is inconsistent', (next) ->
    skip = null
    parse """
    a,b,c,d
    1,2,3
    e,f,g,h
    """, skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c', 'd']
        ['e', 'f', 'g', 'h']
      ] unless err
      skip.message.should.match 'Number of columns is inconsistent on line 2' unless err
      next err
    .on 'skip', (err) -> skip = err
