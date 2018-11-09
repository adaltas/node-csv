
parse = require '../lib'

describe 'options ltrim', ->

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
    # 3rd line: with row delimiter
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
      err.message.should.eql 'Invalid opening quote at line 1'
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

describe 'rtrim', ->

  it 'plain text', (next) ->
    parse """
    a b ,c d 
    e f ,g h 
    """, quote: "'", escape: "'", trim: true, (err, data) ->
      data.should.eql [['a b', 'c d'],['e f', 'g h']] unless err
      next err

  it 'after quote', (next) ->
    data = '''
    'a' ,'b' 
    'c' ,'d' 
    '''
    parser = parse quote: "'", escape: "'", trim: true, (err, data) ->
      data.should.eql [["a", "b"],["c", "d"]] unless err
      next err
    parser.write chr for chr in data
    parser.end()

  it 'quote followed by escape', (next) ->
    # 1st line: with field delimiter
    # 2nd line: with row delimiter
    # 3rd line: with end of file
    parse """
    'a''' ,'b'''
    'c''','d''' 
    'e''','f''' 
    """, quote: "'", escape: "'", trim: true, (err, data) ->
      data.should.eql [["a'", "b'"],["c'", "d'"],["e'", "f'"]] unless err
      next err
  
  it 'with whitespaces around quotes', (next) ->
    data = '''
    "a b "   ,"c d   " 
    "e f " ,"g h   "   
    '''
    parser = parse rtrim: true, (err, data) ->
      data.should.eql [['a b ', 'c d   '],['e f ', 'g h   ']] unless err
      next err
    parser.write chr for chr in data
    parser.end()

  it 'with char after whitespaces', (next) ->
    data = '''
    "a b " x  ,"c d   " x
    "e f " x,"g h   "  x 
    '''
    parser = parse rtrim: true, (err, data) ->
      err.message.should.eql 'Invalid Closing Quote: found non trimable byte after quote at line 1'
      next()
    parser.write chr for chr in data
    parser.end()

describe 'trim', ->

  it 'should ignore the whitespaces immediately preceding and following the delimiter', (next) ->
    data = []
    parser = parse trim: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
      data.should.eql [
        [ 'FIELD 1','FIELD 2','FIELD 3','FIELD 4','FIELD 5','FIELD 6' ]
        [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
        [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
      ]
      next()
    parser.write """
      FIELD 1  ,  FIELD 2 , FIELD 3,FIELD 4 , FIELD 5,FIELD 6   
    20322051544,1979  ,8.8017226E7,ABC  , 45 ,    2000-01-01
      28392898392,    1974,8.8392926E7,DEF   ,  23 , 2050-11-27
    """
    parser.end()

  it 'should preserve whitespace inside text if there are quotes or not', (next) ->
    data = []
    parser = parse trim: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
      data.should.eql [
        [ 'FIELD 1','FIELD 2','FIELD 3','FIELD 4','FIELD 5','FIELD 6' ]
        [ '20322051544','1979','8.8017226E7','ABC DEF','45','2000-01-01' ]
        [ '28392898392','1974','8.8392926E7',' ABC DEF ','23','2050-11-27' ]
      ]
      next()
    parser.write """
    FIELD 1,  FIELD 2, FIELD 3, FIELD 4, FIELD 5, FIELD 6
    20322051544, 1979, 8.8017226E7, ABC DEF , 45, 2000-01-01
    28392898392, 1974, 8.8392926E7," ABC DEF ", 23, 2050-11-27
    """
    parser.end()

  it 'with columns and last field is a space', (next) ->
    parse 'h1,h2,h3, \n1,2,3, \n4,5,6, ', 
      delimiter: ','
      columns: true
      trim: true
    , (err, data) ->
      data.should.eql [
        { h1: '1', h2: '2', h3: '3', '': '' }
        { h1: '4', h2: '5', h3: '6', '': '' }
      ] unless err
      next err

  it 'last field empty', (next) ->
    parse "a,", trim: true, (err, records) ->
      records.should.eql [ [ 'a', '' ] ] unless err
      next err

  it 'with skip_empty_lines and empty lines at the end', (next) ->
    parse "letter,number\na,1\nb,2\nc,3\n",
      columns: true
      skip_empty_lines: true
      trim: true
    , (err, data) ->
      return next err if err
      data.should.eql [
        { letter: 'a', number: '1' }
        { letter: 'b', number: '2' }
        { letter: 'c', number: '3' }
      ]
      next()

  it 'write aggressively', (next) ->
    records = []
    parser = parse({ trim: true })
    parser.on 'readable', ->
      while(d = parser.read())
        records.push d
    parser.on 'end', ->
      records.should.eql [
        [ 'Test 0', '', ' 0,00 ', '"' ]
        [ 'Test 1', '', ' 100000,100000 ', '"' ]
        [ 'Test 2', '', ' 200000,200000 ', '"' ]
        [ 'Test 3', '', ' 300000,300000 ', '"' ]
        [ 'Test 4', '', ' 400000,400000 ', '"' ]
        [ 'Test 5', '', ' 500000,500000 ', '"' ]
        [ 'Test 6', '', ' 600000,600000 ', '"' ]
        [ 'Test 7', '', ' 700000,700000 ', '"' ]
        [ 'Test 8', '', ' 800000,800000 ', '"' ]
        [ 'Test 9', '', ' 900000,900000 ', '"' ]
      ]
      next()
    data = '''
     Test 0 ,," 0,00 ",""""
     Test 1 ,," 100000,100000 ",""""
     Test 2 ,," 200000,200000 ",""""
     Test 3 ,," 300000,300000 ",""""
     Test 4 ,," 400000,400000 ",""""
     Test 5 ,," 500000,500000 ",""""
     Test 6 ,," 600000,600000 ",""""
     Test 7 ,," 700000,700000 ",""""
     Test 8 ,," 800000,800000 ",""""
     Test 9 ,," 900000,900000 ",""""
    '''
    parser.write chr for chr in data
    parser.end()

describe 'no trim', ->

  it 'should preserve surrounding whitespaces', (next) ->
    data = []
    parser = parse()
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
      data.should.eql [
        [ '  FIELD 1  ','  FIELD 2 ',' FIELD 3','FIELD 4 ',' FIELD 5','FIELD 6   ' ]
        [ '20322051544','1979  ','8.8017226E7','AB C  ',' 45 ','   2000-01-01' ]
        [ '  28392898392','    1974','8.8392926E7','D EF   ','  23 ',' 2050-11-27' ]
      ]
      next()
    parser.write """
      FIELD 1  ,  FIELD 2 , FIELD 3,FIELD 4 , FIELD 5,FIELD 6   
    20322051544,1979  ,8.8017226E7,AB C  , 45 ,   2000-01-01
      28392898392,    1974,8.8392926E7,D EF   ,  23 , 2050-11-27
    """
    parser.end()
