
parse = require '../lib'
assert_error = require './api.assert_error'

describe 'Option `ltrim`', ->

  it 'plain text', (next) ->
    parse """
     a b, c d
     e f, g h
    """, quote: "'", escape: "'", trim: true, (err, data) ->
      data.should.eql [['a b', 'c d'],['e f', 'g h']] unless err
      next err

  it 'before quote', (next) ->
    data = '''
     'a', 'b'
     'c', 'd'
    '''
    parser = parse quote: "'", escape: "'", trim: true, (err, data) ->
      data.should.eql [["a", "b"],["c", "d"]] unless err
      next err
    parser.write chr for chr in data
    parser.end()

  it 'quote followed by escape', (next) ->
    # 1st line: with start of file
    # 2nd line: with field delimiter
    # 3rd line: with record delimiter
    parse """
     '''a','''b'
    '''c', '''d'
     '''e','''f'
    """, quote: "'", escape: "'", trim: true, (err, data) ->
      data.should.eql [["'a", "'b"],["'c", "'d"],["'e", "'f"]] unless err
      next err
  
  it 'with whitespaces around quotes', (next) ->
    data = '''
       " a b", "   c d"
     " e f",   "   g h"
    '''
    parser = parse ltrim: true, (err, data) ->
      data.should.eql [[' a b', '   c d'],[' e f', '   g h']] unless err
      next err
    parser.write chr for chr in data
    parser.end()

  it 'with char after whitespaces', (next) ->
    data = '''
     x  " a b",x "   c d"
    x " e f", x  "   g h"
    '''
    parser = parse ltrim: true, (err, data) ->
      assert_error err,
        message: 'Invalid Opening Quote: a quote is found inside a field at line 1'
        code: 'INVALID_OPENING_QUOTE'
        field: 'x  '
      next()
    parser.write chr for chr in data
    parser.end()
  
  it 'should work on last field', (next) ->
    data = []
    parser = parse ltrim: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
      data.should.eql [
        [ 'FIELD_1','FIELD_2' ]
        [ '20322051544','a' ]
        [ '28392898392',' ' ]
      ]
      next()
    parser.write """
    FIELD_1, FIELD_2
    20322051544, a
    28392898392, " "
    """
    parser.end()
