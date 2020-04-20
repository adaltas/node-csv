
stringify = require '../lib'

describe 'Option `bom`', ->
  
  it 'validate', ->
    (->
      stringify [], bom: 'invalid', (->)
    ).should.throw
      code: 'CSV_OPTION_BOOLEAN_INVALID_TYPE'
      message: 'option `bom` is optional and must be a boolean value, got "invalid"'

  it 'value is `true`', (next) ->
    stringify [
      value: 'ok'
    ], bom: true, (err, data) ->
      data.should.eql Buffer.from([239, 187, 191]).toString()+'ok\n'
      next()

  it 'value is `false`', (next) ->
    stringify [
      value: 'ok'
    ], bom: false, (err, data) ->
      data.should.eql 'ok\n'
      next()
