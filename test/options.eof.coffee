
generate = require '../src'

describe 'option fixed_size', ->

  it 'default to trailing newline character if true', (next) ->
    generator = generate length: 10, eof: true, (err, data) ->
      data.split('\n')[10].should.eql '' unless err
      next err

  it 'accept any string', (next) ->
    generator = generate length: 10, eof: 'abcd', (err, data) ->
      data.split('abcd')[1].should.eql '' unless err
      next err
