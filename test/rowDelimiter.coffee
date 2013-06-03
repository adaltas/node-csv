
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'rowDelimiter', ->

  describe 'from', (next) ->

    it 'Test line breaks custom', (next) ->
      csv()
      .from.string( """
        ABC,45::DEF,23
        """, rowDelimiter: '::' )
      .on 'end', (count) ->
        count.should.eql 2
      .to.string (result) ->
        result.should.eql """
        ABC,45
        DEF,23
        """
        next()

    it 'should handle new line precede with a quote', (next) ->
      csv()
      .from.string( """
        "ABC","45"::"DEF","23"::"GHI","94"
        """, rowDelimiter: '::' )
      .on 'end', (count) ->
        count.should.eql 3
      .to.string (result) ->
        result.should.eql """
        ABC,45
        DEF,23
        GHI,94
        """
        next()

    it 'should handle chuncks of multiple chars', (next) ->
      test = csv()
      .from.options(rowDelimiter: '::')
      .on 'end', (count) ->
        count.should.eql 4
      .to.string (result) ->
        result.should.eql """
        ABC,45
        DEF,23
        GHI,94
        JKL,02
        """
        next()
      test.write '"ABC","45"'
      test.write '::"DEF","23":'
      test.write ':"GHI","94"::'
      test.write '"JKL","02"'
      test.end()
    
    it 'should handle chuncks in autodiscovery', (next) ->
      test = csv()
      .on 'end', (count) ->
        count.should.eql 4
      .to.string (result) ->
        result.should.eql """
        ABC,45
        DEF,23
        GHI,94
        JKL,02
        """
        next()
      test.write '"ABC","45"'
      test.write '\n"DEF","23"\n'
      test.write '"GHI","94"\n'
      test.write '"JKL","02"'
      test.end()

  describe 'to', ->

    it 'Test line breaks custom', (next) ->
      csv()
      .from.string( """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """ )
      .on 'end', (count) ->
        count.should.eql 2
      .to.string( (result) ->
        result.should.eql """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01::28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """
        next()
      , rowDelimiter: '::' )
    
    it 'Test line breaks unix', (next) ->
      csv()
      .from.string( """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """ )
      .to.string( (result) ->
        result.should.eql """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\n28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """
        next()
      , rowDelimiter: 'unix')
    
    it 'Test line breaks unicode', (next) ->
      csv()
      .from.string( """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """ )
      .to.string( (result) ->
        result.should.eql """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\u202828392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """
        next()
      , rowDelimiter: 'unicode')
    
    it 'Test line breaks mac', (next) ->
      csv()
      .from.string( """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """ )
      .to.string( (result) ->
        result.should.eql """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\r28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """
        next()
      , rowDelimiter: 'mac')
    
    it 'Test line breaks windows', (next) ->
      csv()
      .from.string( """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """ )
      .to.string( (result) ->
        result.should.eql """
        20322051544,1979.0,8.8017226E7,ABC,45,2000-01-01\r\n28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        """
        next()
      , rowDelimiter: 'windows')


