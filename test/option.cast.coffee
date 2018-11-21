
stringify = require '../src'

describe 'Option `cast`', ->

  it 'handle string formatter', (next) ->
    stringify [
      value: 'ok'
    ], {cast: string: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'handle boolean formatter', (next) ->
    stringify [
      value: true
    ], {cast: boolean: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'handle date formatter', (next) ->
    stringify [
      value: new Date
    ], {cast: date: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'handle number formatter', (next) ->
    stringify [
      value: 3.14
    ], {cast: number: (value) -> '' + value * 2 }, (err, data) ->
      data.should.eql '6.28\n'  unless err
      next err

  it 'handle object formatter', (next) ->
    stringify [
      value: a: 1
    ], {cast: object: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'catch error', (next) ->
    stringify [
      value: true
    ], {cast: boolean: (value) -> throw Error 'Catchme'}, (err, data) ->
      err.message.should.eql 'Catchme'
      next()

  it 'boolean must return a string', (next) ->
    stringify [
      value: true
    ], {cast: boolean: (value) -> if value then 1 else 0}, (err, data) ->
      err.message.should.eql 'Formatter must return a string, null or undefined'
      next()
