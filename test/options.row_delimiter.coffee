
generate = require '../src'

describe 'option row_delimiter', ->

  it 'default to unix style', (next) ->
    generator = generate length: 10, (err, data) ->
      data.split('\n').length.should.eql 10 unless err
      next err

  it 'accept multiple chars', (next) ->
    generator = generate length: 10, row_delimiter: 'abcd', (err, data) ->
      data.split('abcd').length.should.eql 10 unless err
      next err
