
parse = require '../lib'
fs = require 'fs/promises'

describe 'Option `encoding`', ->
  
  it 'validate', ->
    (->
      parse 'whocare', encoding: 666, (->)
    ).should.throw
      code: 'CSV_INVALID_OPTION_ENCODING'
      message: [
        'Invalid option encoding:',
        'encoding must be a string or null to return a buffer,',
        'got 666'
      ].join ' '
  
  it 'with delimiter', (next) ->
    parse Buffer.from('x:x', 'utf16le'),
      delimiter: ':'
      encoding: 'utf16le'
    , (err, data) ->
      data.should.eql [['x', 'x']] unless err
      next err
  
  it 'with escape equals quote', (next) ->
    parse Buffer.from( """
      a,b,c
      1,"2 ""3"" 4",5
      """, 'utf16le'
    ),
      encoding: 'utf16le'
    , (err, data) ->
      data.should.eql [
        [ 'a', 'b', 'c' ]
        [ '1', '2 "3" 4', '5' ]
      ] unless err
      next err
