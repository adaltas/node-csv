
fs = require 'fs'
stringify = require '../lib'

describe 'Option `quoted_match`', ->
  
  it 'a string', (next) ->
    count = 0
    data = ''
    stringifier = stringify [
      ['abc', 'def']
    ], quoted_match: 'e', eof: false, (err, data) ->
      data.should.eql '''
      abc,"def"
      ''' unless err
      next err
        
  it 'a regex', (next) ->
    count = 0
    data = ''
    stringifier = stringify [
      ['abcd', 'efg']
    ], quoted_match: /^\w{3}$/, eof: false, (err, data) ->
      data.should.eql '''
      abcd,"efg"
      ''' unless err
      next err
        
  it 'an array', (next) ->
    count = 0
    data = ''
    stringifier = stringify [
      ['ab', 'cd', 'efg']
    ], quoted_match: ['d', /^\w{3}$/], eof: false, (err, data) ->
      data.should.eql '''
      ab,"cd","efg"
      ''' unless err
      next err
