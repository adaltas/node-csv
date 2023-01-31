
import { parse } from '../lib/index.js'
import { assert_error } from './api.assert_error.coffee'

describe 'API events', ->
  
  it 'emit `readable` event', (next) ->
    records = []
    parser = parse()
    parser.on 'readable', ->
      while record = this.read()
        records.push record
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'end', ->
      records.should.eql [
        [ 'ABC', '45' ]
        [ 'DEF', '23' ]
      ]
      next()
    parser.end()
      
  it 'emit `data` event', (next) ->
    records = []
    parser = parse()
    parser.on 'data', (record) ->
      records.push record
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'end', ->
      records.should.eql [
        [ 'ABC', '45' ]
        [ 'DEF', '23' ]
      ]
      next()
    parser.end()

  it 'ensure error in _transform is called once', (next) ->
    data = '''
     x  " a b",x "   c d"
    x " e f", x  "   g h"
    '''
    parser = parse (err) ->
      assert_error err,
        message: 'Invalid Opening Quote: a quote is found on field 0 at line 1, value is " x  "'
        code: 'INVALID_OPENING_QUOTE'
        field: ' x  '
      next()
    parser.write chr for chr in data
    parser.end()

  it 'emit `error`', (next) ->
    parser = parse()
    parser.on 'readable', ->
      while @read() then true
    parser.on 'end', ->
      next Error 'End should not be fired'
    parser.on 'error', (err) ->
      err.message.should.eql 'Invalid Record Length: expect 3, got 2 on line 2'
      next()
    parser.write """
    a,a,a
    b,b
    """
    parser.end()

  it 'emit `error` with data as argument', (next) ->
    parser = parse """
    a,a,a
    b,b
    c,c,c
    """
    parser.on 'end', ->
      next Error 'End should not be fired'
    parser.on 'error', (err) ->
      err.message.should.eql 'Invalid Record Length: expect 3, got 2 on line 2'
      next()

  it 'emit `destroy` event', (next) ->
    parser = parse """
    a,a,a
    b,b,b
    c,c,c
    """
    parser.on 'readable', (data) ->
      while this.read() isnt null then true
    parser.on 'close', next
    parser.on 'error', ->
      next Error 'Event `error` should not be fired'

  it 'emit `destroy` event with `to_line` option', (next) ->
    # See https://github.com/adaltas/node-csv/issues/333
    parser = parse """
    a,a,a
    b,b,b
    c,c,c
    """, to_line: 2
    parser.on 'readable', (data) ->
      while this.read() isnt null then true
    parser.on 'close', next
    parser.on 'error', ->
      next Error 'Event `error` should not be fired'
    
