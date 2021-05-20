
parse = require '../lib'

describe 'Option `info`', ->
  
  describe 'validation', ->
    
    it 'check the columns value', ->
      (->
        parse "", info: 'ok', (->)
      ).should.throw 'Invalid Option: info must be true, got "ok"'
  
  describe 'true', ->
    
    it 'return info and records', (next) ->
      parse '''
      a,b,c
      d,e,f
      g,h,i
      ''', info: true, (err, records) ->
        records.map(
          ({info}) -> info.lines
        ).should.eql [1, 2, 3] unless err
        next err
          
    it 'with skip_empty_lines', (next) ->
      parse '''
      
      a,b,c
      
      d,e,f
      
      g,h,i
      ''', info: true, skip_empty_lines: true, (err, records) ->
        records.map(
          ({info}) -> info.lines
        ).should.eql [2, 4, 6] unless err
        next err
          
    it 'with comment', (next) ->
      parse '''
      # line 1
      a,b,c
      # line 2
      d,e,f
      # line 3
      g,h,i
      ''', info: true, comment: '#', (err, records) ->
        records.map(
          ({info}) -> info.lines
        ).should.eql [2, 4, 6] unless err
        next err
          
    it 'with multiline records', (next) ->
      parse '''
      a,b,c
      d,"e
      ",f
      g,h,i
      ''', info: true, (err, records) ->
        records.map(
          ({info}) -> info.lines
        ).should.eql [1, 3, 4] unless err
        next err
    
