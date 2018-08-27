
stringify = require '../src'

describe 'options formatters', ->

  it 'should let overwrite date formatter', (next) ->
    stringify [
      {value: new Date}
    ], {formatters: date: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'should let overwrite boolean formatter', (next) ->
    stringify [
      value: true
    ], {formatters: bool: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'should let overwrite object formatter', (next) ->
    stringify [
      value: a: 1
    ], {formatters: object: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'must return a string', (next) ->
    stringify [
      a: true
    ], {formatters: bool: (value) -> if value then 1 else 0}, (err, data) ->
      err.message.should.eql 'Formatter must return a string, null or undefined'
      next()
