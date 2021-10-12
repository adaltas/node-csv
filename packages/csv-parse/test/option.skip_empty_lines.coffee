
import { parse } from '../lib/index.js'

describe 'Option `skip_empty_lines`', ->
  
  it 'validation', ->
    parse '', skip_empty_lines: true, (->)
    parse '', skip_empty_lines: false, (->)
    parse '', skip_empty_lines: null, (->)
    parse '', skip_empty_lines: undefined, (->)
    (->
      parse '', skip_empty_lines: 1, (->)
    ).should.throw 'Invalid Option: skip_empty_lines must be a boolean, got 1'
    (->
      parse '', skip_empty_lines: 'oh no', (->)
    ).should.throw 'Invalid Option: skip_empty_lines must be a boolean, got "oh no"'
  
  describe 'false', ->
  
    it 'dont skip by default', (next) ->
      parse '''
      ABC\n\nDEF
      ''', (err, data) ->
        
        data.should.eql [
          [ 'ABC' ]
          [ '' ]
          [ 'DEF' ]
        ] unless err
        next err

  describe 'usage', ->
  
    it 'skip', (next) ->
      parse '''
      ABC\n\nDEF
      ''', skip_empty_lines: true, (err, data) ->
        data.should.eql [
          [ 'ABC' ]
          [ 'DEF' ]
        ] unless err
        next err
        
    it 'quoted fields are not interpreted as empty', (next) ->
      parse '''
      ABC\n""\nDEF
      ''', skip_empty_lines: true, (err, data) ->
        data.should.eql [
          [ 'ABC' ]
          [ '' ]
          [ 'DEF' ]
        ] unless err
        next err

    it 'skip respect parser.read', (next) ->
      data = []
      parser = parse skip_empty_lines: true
      parser.write '''
      
      20322051544,1979,8.8017226E7,ABC,45,2000-01-01

      28392898392,1974,8.8392926E7,DEF,23,2050-11-27

      '''
      parser.on 'readable', ->
        while(d = parser.read())
          data.push d
      parser.on 'error', (err) ->
        next err
      parser.on 'end', ->
        data.should.eql [
          ['20322051544', '1979', '8.8017226E7', 'ABC', '45', '2000-01-01']
          ['28392898392', '1974', '8.8392926E7', 'DEF', '23', '2050-11-27']
        ]
        next()
      parser.end()
  
  describe 'with other options', ->
    
    it 'used conjointly with trim to ignore whitespaces', (next) ->
      parse '''
      a,b,c
      \t
      d,e,f
      ''',
        skip_empty_lines: true
        trim: true
      , (err, records) ->
        records.should.eql [
          ['a', 'b', 'c'],
          ['d', 'e', 'f']
        ] unless err
        next err
