
stringify = require '../src'

describe 'types', ->

  describe 'defaults', ->

    it 'should map date to getTime', (next) ->
      date = new Date
      stringify [
        {value: date}
      ], (err, data) ->
        data.should.eql date.getTime() + '\n'  unless err
        next err

    it 'should map true boolean value to 1', (next) ->
      stringify [
        {value: true}
      ], (err, data) ->
        data.should.eql '1\n'  unless err
        next err

    it 'should map object to its json representation', (next) ->
      stringify [
        {value: {a:1}}
      ], (err, data) ->
        data.should.eql '"{""a"":1}"\n'  unless err
        next err

  describe 'custom formatters', ->

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
