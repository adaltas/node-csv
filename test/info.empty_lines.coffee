
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
