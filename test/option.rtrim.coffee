
parse = require '../lib'

describe 'Option `rtrim`', ->

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
