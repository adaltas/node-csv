
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
        records.map ({record, info}) ->
          should(record).be.an.Array()
          should(info).be.an.Object()
        next err
          
    it 'info properties', (next) ->
      parse '''
      a,b,c
      ''', info: true, (err, records) ->
        {info} = records[0]
        Object.keys(info).sort().should.eql [
          'bytes',
          'columns', 'comment_lines', 'empty_lines', 'error', 'header',
          'index', 'invalid_field_length', 'lines', 'records'
        ]
        next err
          
    it 'validate the `lines` and `bytes` properties', (next) ->
      parse '''
      a,b,c
      d,e,f
      g,h,i
      ''', info: true, (err, records) ->
        records.map(
          ({info}) -> [info.lines, info.bytes]
        ).should.eql [[1, 6], [2, 12], [3, 17]] unless err
        next err
          
    it 'with skip_empty_lines', (next) ->
      parse '''
      
      a,b,c
      
      d,e,f
      
      g,h,i
      ''', info: true, skip_empty_lines: true, (err, records) ->
        records.map(
          ({info}) -> [info.lines, info.bytes]
        ).should.eql [[2, 7], [4, 14], [6, 20]] unless err
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
          ({info}) -> [info.lines, info.bytes]
        ).should.eql [[2, 15], [4, 30], [6, 44]] unless err
        next err
          
    it 'with multiline records', (next) ->
      parse '''
      a,b,c
      d,"e
      ",f
      g,h,i
      ''', info: true, (err, records) ->
        records.map(
          ({info}) -> [info.lines, info.bytes]
        ).should.eql [[1, 6], [3, 15], [4, 20]] unless err
        next err
    
