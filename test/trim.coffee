
fs = require 'fs'
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'ltrim', ->
  
  it 'should ignore the whitespaces immediately following the delimiter', (next) ->
    data = []
    parser = parse ltrim: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'FIELD 1','FIELD 2','FIELD 3','FIELD 4','FIELD 5','FIELD 6' ]
        [ '20322051544',' 1979','8.8017226E7','ABC','45','2000-01-01' ]
        [ '28392898392','     1974','8.8392926E7','DEF','23','2050-11-27' ]
      ]
      next()
    parser.write """
    FIELD 1, FIELD 2, FIELD 3,    FIELD 4, FIELD 5,        FIELD 6
    20322051544," 1979",8.8017226E7,      ABC,45,2000-01-01
    28392898392,    "     1974",  8.8392926E7,DEF,   23, 2050-11-27
    """
    parser.end()
  
  it 'should work on last field', (next) ->
    data = []
    parser = parse ltrim: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
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
  
  it 'should ignore the whitespaces immediately preceding the delimiter', (next) ->
    data = []
    parser = parse rtrim: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'FIELD_1','FIELD_2','FIELD_3','FIELD_4','FIELD_5','FIELD_6']
        [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01']
        [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27']
      ]
      next()
    parser.write """
    FIELD_1 ,FIELD_2  ,FIELD_3  ,FIELD_4    ,FIELD_5 ,FIELD_6         
    20322051544   ,1979,8.8017226E7  ,ABC,45    ,2000-01-01  
    28392898392,1974     ,8.8392926E7,DEF,23 ,2050-11-27 
    """
    parser.end()

describe 'trim', ->

  it 'should ignore the whitespaces immediately preceding and following the delimiter', (next) ->
    data = []
    parser = parse trim: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
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
    parser.on 'finish', ->
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

describe 'no trim', ->
  
  it 'should preserve surrounding whitespaces', (next) ->
    data = []
    parser = parse()
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
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



