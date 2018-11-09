
parse = require '../lib'

describe 'options skip_lines_with_error', ->
  
  it 'handle "Invalid closing quote"', (next) ->
    skip = null
    parser = parse skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ["a","b","c"]
        ["one","two","three"]
        ["seven","eight","nine"]
      ] unless err
      skip.message.should.eql 'Invalid Closing Quote: got " " at line 3 instead of delimiter, row delimiter, trimable character (if activated) or comment' unless err
      next err
    parser.on 'skip', (err) ->
      skip = err
    parser.write '''
    "a","b","c"
    "one","two","three"
    "four"," " ","six"
    "seven","eight","nine"
    '''
    parser.end()

  it 'handle "Invalid opening quote"', (next) ->
    skip = null
    parser = parse skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ["line","1"]
        ["line", "3"]
      ] unless err
      skip.message.should.match 'Invalid opening quote at line 2' unless err
      next err
    parser.on 'skip', (err) -> skip = err
    parser.write '''
    "line",1
    "line",invalid h"ere"
    line,3
    '''
    parser.end()
  
  it 'handle "Quoted field not terminated"', (next) ->
    skip = null
    parser = parse skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c', 'd']
      ] unless err
      skip.message.should.match 'Invalid Closing Quote: quote is not closed at line 2' unless err
      next err
    parser.on 'skip', (err) ->
      skip = err
    parser.write '''
      "a",b,"c",d
      "",1974,8.8392926E7,"","
      '''
    parser.end()

  it 'handle "Number of columns is inconsistent"', (next) ->
    skip = null
    parser = parse skip_lines_with_error: true, columns: ["a", "b", "c", "d"], (err, data) ->
      data.should.eql [
        { a: '4', b: '5', c: '6', d: 'x'}
        { a: '7', b: '8', c: '9', d: 'y'}
      ] unless err
      skip.message.should.match 'Invalid Record Length: header length is 4, got 3 on line 1' unless err
      next err
    parser.on 'skip', (err) -> skip = err
    parser.write '''
    1,2,3
    4,5,6,x
    7,8,9,y
    '''
    parser.end()
    

  it 'handle "Invalid Record Length"', (next) ->
    skip = null
    parser = parse skip_lines_with_error: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c', 'd']
        ['e', 'f', 'g', 'h']
      ] unless err
      skip.message.should.match 'Invalid Record Length: expect 4, got 3 on line 2' unless err
      next err
    parser.on 'skip', (err) ->
      skip = err
    parser.write '''
    a,b,c,d
    1,2,3
    e,f,g,h
    '''
    parser.end()
