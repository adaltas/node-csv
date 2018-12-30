
parse = require '../lib'

describe 'Option `rtrim`', ->
  
  it 'validation', ->
    parse '', rtrim: true, (->)
    parse '', rtrim: false, (->)
    parse '', rtrim: null, (->)
    parse '', rtrim: undefined, (->)
    (->
      parse '', rtrim: 1, (->)
    ).should.throw 'Invalid Option: rtrim must be a boolean, got 1'
    (->
      parse '', rtrim: "true", (->)
    ).should.throw 'Invalid Option: rtrim must be a boolean, got "true"'

describe 'Option `ltrim`', ->
  
  it 'validation', ->
    parse '', ltrim: true, (->)
    parse '', ltrim: false, (->)
    parse '', ltrim: null, (->)
    parse '', ltrim: undefined, (->)
    (->
      parse '', ltrim: 1, (->)
    ).should.throw 'Invalid Option: ltrim must be a boolean, got 1'
    (->
      parse '', ltrim: "true", (->)
    ).should.throw 'Invalid Option: ltrim must be a boolean, got "true"'

describe 'Option `trim`', ->
  
  it 'validation', ->
    parse '', trim: true, (->)
    parse '', trim: false, (->)
    parse '', trim: null, (->)
    parse '', trim: undefined, (->)
    (->
      parse '', trim: 1, (->)
    ).should.throw 'Invalid Option: trim must be a boolean, got 1'
    (->
      parse '', trim: "true", (->)
    ).should.throw 'Invalid Option: trim must be a boolean, got "true"'
  
  it 'set ltrim', ->
    parser = parse trim: true
    parser.options.ltrim.should.be.true()
      
  it 'respect ltrim', ->
    parser = parse trim: true, ltrim: false
    parser.options.ltrim.should.be.false()
      
  it 'set rtrim', ->
    parser = parse trim: true
    parser.options.rtrim.should.be.true()
      
  it 'respect rtrim', ->
    parser = parse trim: true, rtrim: false
    parser.options.rtrim.should.be.false()

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
