
stringify = require '../lib'

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
