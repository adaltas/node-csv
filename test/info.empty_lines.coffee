
parse = require '../lib'

describe 'properties empty_lines', ->

  it 'no lines', (next) ->
    parse '', (err, data, {empty_lines}) ->
      empty_lines.should.eql 0
      next()

  it 'no empty lines', (next) ->
    parse '''
    a,b,c
    d,e,f
    ''', (err, data, {empty_lines}) ->
      empty_lines.should.eql 0
      next()

  it 'one line in the middle of dataset', (next) ->
    parse '''
    a,b,c
    
    d,e,f
    ''', skip_empty_lines: true, (err, data, {empty_lines}) ->
      empty_lines.should.eql 1
      next()

  it 'one line at the end of dataset', (next) ->
    parse '''
    a,b,c
    d,e,f
    
    ''', (err, data, {empty_lines}) ->
      empty_lines.should.eql 1
      next()

  it 'dont count empty lines when empty and skip_empty_lines disabled', (next) ->
    parse '''
    
    a,b,c
    d,e,f
    ''', (err, data, {empty_lines}) ->
      err.message.should.eql 'Invalid Record Length: expect 1, got 3 on line 2'
      empty_lines.should.eql 0
      next()
