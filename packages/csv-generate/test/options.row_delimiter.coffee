
generate = require '../lib'

describe 'option row_delimiter', ->

  it 'default to unix style', (next) ->
    generator = generate length: 10, encoding: 'ascii', (err, data) ->
      data.split('\n').length.should.eql 10 unless err
      next err

  it 'accept multiple chars', (next) ->
    generator = generate row_delimiter: 'abcd', length: 10, encoding: 'ascii', (err, data) ->
      data.split('abcd').length.should.eql 10 unless err
      next err
