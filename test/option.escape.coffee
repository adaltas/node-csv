
stringify = require '../src'

describe 'Option `escape`', ->

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
