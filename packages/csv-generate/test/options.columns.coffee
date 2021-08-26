
generate = require '../lib'

describe 'option columns', ->

  it 'as number', (next) ->
    @timeout 1000000
    count = 0
    data = []
    generator = generate columns: 3
    generator.on 'readable', ->
      while d = generator.read()
        data.push d
        if count++ is 2
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .length.should.eql 3
      next()

  it 'as types', (next) ->
    @timeout 1000000
    count = 0
    data = []
    generator = generate columns: ['int', 'bool'], seed: 1
    generator.on 'readable', ->
      while d = generator.read()
        data.push d
        if count++ is 2
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .should.eql ['1790016367053545', '0']
      next()

  it 'validate types', (next) ->
    try
      generate columns: ['int', 'bool', 'invalid']
    catch err
      err.message.should.eql 'Invalid column type: got "invalid", default values are ["ascii","int","bool"]'
      next()

  it 'as user function', (next) ->
    @timeout 1000000
    count = 0
    data = []
    generator = generate columns: [
      -> 'a'
      -> 'b'
    ]
    generator.on 'readable', ->
      while d = generator.read()
        data.push d
        if count++ is 2
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .should.eql ['a', 'b']
      next()
