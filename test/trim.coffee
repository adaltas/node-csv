
###
Node CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
Testing the read options `trim`, `ltrim` and `rtrim`.
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'ltrim', ->
  
  it 'should ignore the whitespaces immediately following the delimiter', (next) ->
    csv()
    .from.string("""
      FIELD_1, FIELD_2,	FIELD_3,    FIELD_4, FIELD_5,				 FIELD_6
      20322051544," 1979",8.8017226E7,	    ABC,45,2000-01-01
      28392898392,		"	    1974",  8.8392926E7,DEF,   23, 2050-11-27
      """, ltrim: true )
    .transform( (record, index) -> record )
    .on 'close', (count) ->
      count.should.eql 3
    .to.string (data) ->
      data.should.eql """
      FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
      20322051544, 1979,8.8017226E7,ABC,45,2000-01-01
      28392898392,	    1974,8.8392926E7,DEF,23,2050-11-27
      """
      next()
  
  it 'should work on last field', (next) ->
    csv()
    .from.string("""
      FIELD_1, FIELD_2
      20322051544, a
      28392898392, " "
      """, ltrim: true )
    .transform( (record, index) -> record )
    .on 'close', (count) ->
      count.should.eql 3
    .to.string (data) ->
      data.should.eql """
      FIELD_1,FIELD_2
      20322051544,a
      28392898392, 
      """
      next()

describe 'rtrim', ->
  
  it 'should ignore the whitespaces immediately preceding the delimiter', (next) ->
    csv()
    .from.string("""
      FIELD_1 ,FIELD_2  ,FIELD_3	,FIELD_4		,FIELD_5 ,FIELD_6   	 	 	
      20322051544		,1979,8.8017226E7  ,ABC,45		,2000-01-01	 
      28392898392,1974   	 ,8.8392926E7,DEF,23 ,2050-11-27 
      """, rtrim: true )
    .transform( (record, index) -> record )
    .on 'close', (count) ->
      count.should.eql 3
    .to.string (data) ->
      data.should.eql """
      FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
      20322051544,1979,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974,8.8392926E7,DEF,23,2050-11-27
      """
      next()

describe 'trim', ->

  it 'should ignore the whitespaces immediately preceding and following the delimiter', (next) ->
    csv()
    .from.string("""
        FIELD_1  ,	FIELD_2	, FIELD_3,FIELD_4 ,	FIELD_5,FIELD_6		
      20322051544,1979	,8.8017226E7,ABC  , 45 ,	  2000-01-01
        28392898392,		1974,8.8392926E7,DEF   ,  23 , 2050-11-27
      """, trim: true )
    .transform( (record, index) -> record )
    .on 'close', (count) ->
      count.should.eql 3
    .to.string (data) ->
      data.should.eql """
      FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
      20322051544,1979,8.8017226E7,ABC,45,2000-01-01
      28392898392,1974,8.8392926E7,DEF,23,2050-11-27
      """
      next()
  
  it 'should preserve surrounding whitespaces', (next) ->
    csv()
    .from.string("""
        FIELD_1  ,	FIELD_2	, FIELD_3,FIELD_4 ,	FIELD_5,FIELD_6		
      20322051544,1979	,8.8017226E7,ABC  , 45 ,	  2000-01-01
        28392898392,		1974,8.8392926E7,DEF   ,  23 , 2050-11-27
      """)
    .transform( (record, index) -> record )
    .on 'close', (count) ->
      count.should.eql 3
    .to.string (data) ->
      data.should.eql """
        FIELD_1  ,	FIELD_2	, FIELD_3,FIELD_4 ,	FIELD_5,FIELD_6		
      20322051544,1979	,8.8017226E7,ABC  , 45 ,	  2000-01-01
        28392898392,		1974,8.8392926E7,DEF   ,  23 , 2050-11-27
      """
      next()

