
generate = require '../lib'

describe 'option eof', ->

  it 'default to trailing newline character if true', (next) ->
    generator = generate eof: true, length: 10, encoding: 'ascii', (err, data) ->
      data.split('\n')[10].should.eql '' unless err
      next err

  it 'accept any string', (next) ->
    generator = generate eof: 'abcd', length: 10, encoding: 'ascii', (err, data) ->
      data.split('abcd')[1].should.eql '' unless err
      next err
