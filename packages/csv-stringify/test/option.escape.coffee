
stringify = require '../lib'

describe 'Option `escape`', ->
  
  it 'validation', ->
    stringify [], escape: ','
    stringify [], escape: Buffer.from ','
    ( ->
      stringify [], escape: true
    ).should.throw 'Invalid Option: escape must be a buffer or a string, got true'
    ( ->
      stringify [], escape: false
    ).should.throw 'Invalid Option: escape must be a buffer or a string, got false'
    ( ->
      stringify [], escape: 123
    ).should.throw 'Invalid Option: escape must be a buffer or a string, got 123'
    ( ->
      stringify [], escape: 'XX'
    ).should.throw 'Invalid Option: escape must be one character, got 2 characters'

  it 'only apply to quote and escape characters', (next) ->
    stringify [
      [ '-', '1"2' ]
      [ '-', '"' ]
      [ '-', '"abc' ]
      [ '-', 'def"' ]
    ], escape: '"', eof: false, (err, data) ->
      return next err if err
      data.should.eql """
      -,"1""2"
      -,"\"\""
      -,"\""abc"
      -,"def\"""
      """
      next()

  it 'escape delimiter', (next) ->
    stringify [
      [ 'a', 'b,c', 'd' ]
    ], escape: '"', delimiter: ',', eof: false, (err, data) ->
      return next err if err
      data.should.eql """
      a,"b,c",d
      """
      next()

  it 'escape record_delimiter', (next) ->
    stringify [
      [ 'a', 'b\nc', 'd' ]
    ], escape: '"', record_delimiter: '\n', eof: false, (err, data) ->
      return next err if err
      data.should.eql """
      a,"b\nc",d
      """
      next()

  it 'should honor the backslash escape characters', (next) ->
    stringify [
      [ '1"2','3"4"5' ]
      [ '\\abc', 'def\\' ]
      [ 'escape and quote','\\"' ] # actually \"
    ], escape: '\\', eof: false, (err, data) ->
      return next err if err
      data.should.eql """
      "1\\"2","3\\"4\\"5"
      \\abc,def\\
      escape and quote,"\\\\\\\""
      """
      # for the "escape char and quote char" value we want: \\\"
      next()
