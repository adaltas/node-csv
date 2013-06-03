
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'quotes', ->

  describe 'parser', ->
  
    it 'Test regular quotes',  (next) ->
      csv()
      .from.string("""
        20322051544,"1979.0",8.8017226E7,"ABC,45","2000-01-01"
        28392898392,1974.0,"8.8392926E7",DEF,23,2050-11-27
        """)
      .to.string (data) ->
        data.should.eql """
        20322051544,1979.0,8.8017226E7,"ABC,45",2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """
        next()
    
    it 'should read quoted values containing delimiters and write around quote only the value containing delimiters', (next) ->
      csv()
      .from.string("""
        20322051544,",1979.0,8.8017226E7,ABC,45,2000-01-01"
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        "28392898392,1974.0","8.8392926E7","DEF,23,2050-11-27"
        """)
      .to.string (data) ->
        data.should.eql """
        20322051544,",1979.0,8.8017226E7,ABC,45,2000-01-01"
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        "28392898392,1974.0",8.8392926E7,"DEF,23,2050-11-27"
        """
        next()
    
    it 'Test quotes inside field', (next) ->
      csv()
      .from.string("""
        20322051544,"1979.0",8.801"7226E7,ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,2"3,2050-11-27
        """)
      .to.string (data) ->
        data.should.eql """
        20322051544,1979.0,"8.801""7226E7",ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,"2""3",2050-11-27
        """
        next()
    
    it 'Test empty value', (next) ->
      csv()
      .from.string("""
        20322051544,"",8.8017226E7,45,""
        "",1974,8.8392926E7,"",""
        """, quote: '"', escape: '"')
      .to.string (data) ->
        data.should.eql """
        20322051544,,8.8017226E7,45,
        ,1974,8.8392926E7,,
        """
        next()
    
    it 'should read values with quotes, escaped as double quotes, and write empty values as not quoted', (next) ->
      csv()
      .from.string("""
        20322051544,\"\"\"\",8.8017226E7,45,\"\"\"ok\"\"\"
        "",1974,8.8392926E7,"",""
        """, quote: '"', escape: '"')
      .on 'record', (record,index) ->
        record.length.should.eql 5
        if index is 0
          record[1].should.eql '"'
          record[4].should.eql '"ok"'
      .to.string (data) ->
        data.should.eql """
        20322051544,\"\"\"\",8.8017226E7,45,\"\"\"ok\"\"\"
        ,1974,8.8392926E7,,
        """
        next()
    
    it 'should accept line breaks inside quotes', (next) ->
      csv()
      .from.string("""
        20322051544,"
        ",8.8017226E7,45,"
        ok
        "
        "
        ",1974,8.8392926E7,"","
        "
        """, quote: '"', escape: '"')
      .on 'record', (record,index) ->
        record.length.should.eql 5
      .to.string (data) ->
        data.should.eql """
        20322051544,"
        ",8.8017226E7,45,"
        ok
        "
        "
        ",1974,8.8392926E7,,"
        "
        """
        next()

  describe 'error', ->
  
    it 'when unclosed', (next) ->
      csv()
      .from.string("""
        "",1974,8.8392926E7,"","
        """, quote: '"', escape: '"')
      .on 'close', -> 
        false.should.be.ok
      .on 'error', (e) ->
        e.message.should.eql 'Quoted field not terminated at line 1'
        next()
    
    it 'when invalid quotes', (next) ->
      csv()
      .from.string("""
        ""  1974    8.8392926E7 ""t ""
        ""  1974    8.8392926E7 ""  ""
        """, quote: '"', escape: '"', delimiter: "\t")
      .on 'close', ->
        false.should.be.ok
      .on 'error', (e) ->
        e.message.should.eql 'Invalid closing quote at line 1; found " " instead of delimiter "\\t"'
        next()
    
    it 'when invalid quotes from string', (next) ->
      csv()
      .from.string '"",1974,8.8392926E7,""t,""',
        quote: '"'
        escape: '"'
      .on 'close', ->
        false.should.be.ok
      .on 'error', (e) ->
        e.message.should.match /Invalid closing quote/
        next()

    it.skip 'when around invalid quotes', (next) ->
      csv()
      .from.string("""
        384682,SAMAY Hostel,Jiron "Florida 285"
        """, quote: '"', escape: '"', relax: true)
      # .to.array (data) ->
      #   data.should.eql [ [ '384682', 'SAMAY Hostel', 'Jiron "Florida 285"' ] ]
      #   next()
      .on 'error', (e) ->
        # Error should be thrown unless we remove 
        # the 'relax' option and change our strategy
        e.message.should.match /Invalid closing quote/
        next()

  describe 'serializer', ->
  
    it 'should quotes all fields', (next) ->
      csv()
      .from.string("""
        20322051544,"1979.0",8.801"7226E7,ABC
        "283928""98392",1974.0,8.8392926E7,DEF
        """)
      .on 'error', (e) ->
        false.should.be.ok
      .to.string( (data) ->
        data.should.eql """
        "20322051544","1979.0","8.801""7226E7","ABC"
        "283928""98392","1974.0","8.8392926E7","DEF"
        """
        next()
      , quoted: true )

