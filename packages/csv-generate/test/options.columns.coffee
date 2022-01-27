
import { generate } from '../lib/index.js'

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
  
  describe 'user function', ->

    it 'accept string or null or number', (next) ->
      @timeout 1000000
      data = []
      generator = generate length: 1, columns: [
        -> 'a'
        -> null
        -> 1
      ]
      generator.on 'readable', ->
        while d = generator.read()
          data.push d.toString()
      generator.on 'error', next
      generator.on 'end', ->
        data.should.eql ['a,,1']
        next()

    it 'validate return argument', (next) ->
      @timeout 1000000
      generator = generate objectMode: true, columns: [
        -> {}
      ]
      generator.on 'readable', ->
        while d = generator.read() then true
      generator.on 'error', (err) ->
        err.message.should.eql [
          'INVALID_VALUE:'
          'values returned by column function must be'
          'a string, a number or null,'
          'got {}'
        ].join ' '
        next()
      generator.on 'end', -> next Error('Oh no')

    it 'validate arguments in objectMode', (next) ->
      @timeout 1000000
      data = []
      generator = generate objectMode: true, length: 1, columns: [
        ({options}) -> JSON.stringify(options)
        ({state}) -> JSON.stringify(state)
      ]
      generator.on 'readable', ->
        while d = generator.read()
          data.push JSON.parse(d[0]), JSON.parse(d[1])
      generator.on 'error', next
      generator.on 'end', ->
        data.should.eql [
          objectMode: true
          length: 1
          columns: [ null, null ]
          delimiter: ','
          duration: null
          encoding: null
          end: null
          eof: false
          fixedSize: false
          maxWordLength: 16
          rowDelimiter: '\n'
          seed: false
          sleep: 0
        ,
          start_time: null
          fixed_size_buffer: ''
          count_written: 0
          count_created: 0
        ]
        next()
