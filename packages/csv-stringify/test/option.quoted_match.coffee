
import { stringify } from '../lib/index.js'

describe 'Option `quoted_match`', ->
  
  it 'default to `null`', (next) ->
    stringifier = stringify [
      ['abc', 'def']
    ], ->
      should(stringifier.options.quoted_match).be.null()
      next()
  
  it 'a string', (next) ->
    count = 0
    data = ''
    stringify [
      ['abc', 'def']
    ], quoted_match: 'e', eof: false, (err, data) ->
      data.should.eql '''
      abc,"def"
      ''' unless err
      next err
        
  it 'a regex', (next) ->
    count = 0
    data = ''
    stringify [
      ['abcd', 'efg']
    ], quoted_match: /^\w{3}$/, eof: false, (err, data) ->
      data.should.eql '''
      abcd,"efg"
      ''' unless err
      next err
        
  it 'an array', (next) ->
    count = 0
    data = ''
    stringify [
      ['ab', 'cd', 'efg']
    ], quoted_match: ['d', /^\w{3}$/], eof: false, (err, data) ->
      data.should.eql '''
      ab,"cd","efg"
      ''' unless err
      next err

  it 'an empty string regex with no other "quoted" options (#344)', (next) ->
    count = 0
    data = ''
    stringify [
      ['a', null, undefined, '', 'b']
    ], quoted_match: /^$/, eof: false, (err, data) ->
      data.should.eql '''
      a,,,"",b
      ''' unless err
      next err

  it 'an empty string regex with all other "quoted" options set to false (#344)', (next) ->
    count = 0
    data = ''
    stringify [
      ['a', null, undefined, '', 'b']
    ], quoted: false, quoted_empty: false, quoted_string: false, quoted_match: /^$/, eof: false, (err, data) ->
      data.should.eql '''
      a,,,"",b
      ''' unless err
      next err

  it 'an empty string regex has higher priority than the "quoted" option', (next) ->
    count = 0
    data = ''
    stringify [
      ['a', null, undefined, '', 'b']
    ], quoted: true, quoted_match: /^$/, eof: false, (err, data) ->
      data.should.eql '''
      "a",,,"","b"
      ''' unless err
      next err

  it "an empty string regex does not conflict with quoted_string set to true", (next) ->
    count = 0
    data = ''
    stringify [
      ['a', null, undefined, '', 'b']
    ], quoted_string: true, quoted_match: /^$/, eof: false, (err, data) ->
      data.should.eql '''
      "a",,,"","b"
      ''' unless err
      next err

  it "an empty string regex does not conflict with quoted_empty set to true", (next) ->
    count = 0
    data = ''
    stringify [
      ['a', null, undefined, '' , 'b']
    ], quoted_empty: true, quoted_match: /^$/, eof: false, (err, data) ->
      data.should.eql '''
      a,"","","",b
      ''' unless err
      next err
