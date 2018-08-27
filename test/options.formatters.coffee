
stringify = require '../src'

describe 'options formatters', ->

  it 'handle boolean formatter', (next) ->
    stringify [
      value: true
    ], {formatters: boolean: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'handle date formatter', (next) ->
    stringify [
      {value: new Date}
    ], {formatters: date: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'handle number formatter', (next) ->
    stringify [
      value: 3.14
    ], {formatters: number: (value) -> '' + value * 2 }, (err, data) ->
      data.should.eql '6.28\n'  unless err
      next err

  it 'handle object formatter', (next) ->
    stringify [
      value: a: 1
    ], {formatters: object: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'boolean must return a string', (next) ->
    stringify [
      a: true
    ], {formatters: boolean: (value) -> if value then 1 else 0}, (err, data) ->
      err.message.should.eql 'Formatter must return a string, null or undefined'
      next()
